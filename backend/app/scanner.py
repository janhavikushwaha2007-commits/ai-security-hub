"""Security scanner APIs: URL, message, website, file, and password strength.

Each scanner returns a normalized risk assessment and persists the result to
MongoDB so users can review past scans from the scan-history page.
"""

import re
from datetime import datetime, timezone
from typing import Annotated
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from pydantic import BaseModel, Field

from app.auth import PublicUser, require_user

router = APIRouter(prefix="/api/scan", tags=["scan"])

RISKY_TLDS = {".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".zip", ".work"}
SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly"}
URL_KEYWORDS = [
    "login", "verify", "secure", "update", "bank", "account",
    "password", "free", "gift", "win", "kyc", "otp", "reward",
]
LOOKALIKE_BRANDS = [
    "paypa1", "paypai", "g00gle", "faceb00k", "arnazon",
    "app1e", "netfl1x", "micros0ft", "whatsap", "1nstagram",
]


class UrlIn(BaseModel):
    url: str = Field(min_length=1, max_length=2048)


class MessageIn(BaseModel):
    message: str = Field(min_length=1, max_length=20000)


class WebsiteIn(BaseModel):
    url: str = Field(min_length=1, max_length=2048)


class PasswordIn(BaseModel):
    password: str = Field(min_length=1, max_length=128)


def _level_from_score(score: int) -> str:
    if score >= 65:
        return "High Risk"
    if score >= 30:
        return "Suspicious"
    return "Safe"


def _frontend_level(score: int) -> str:
    if score >= 65:
        return "High Risk"
    if score >= 30:
        return "Suspicious"
    return "Safe"


def _result(score: int, reasons: list[str], mode: str = "Rule-based analysis"):
    score = min(score, 100)
    if not reasons:
        reasons = ["No suspicious patterns found by our rules."]
    return {
        "risk_score": score,
        "risk_level": _frontend_level(score),
        "reasons": reasons,
        "mode": mode,
    }


def _scan_collection(request: Request):
    return request.app.state.mongo_database["scans"]


async def _save_scan(request: Request, user: PublicUser | None, scan_type: str, input_ref: str, result: dict):
    doc = {
        "user_id": user.user_id if user else None,
        "scan_type": scan_type,
        "input": input_ref,
        "result": result,
        "created_at": datetime.now(timezone.utc),
    }
    await _scan_collection(request).insert_one(doc)


@router.post("/url")
async def scan_url(
    body: UrlIn,
    request: Request,
    user: Annotated[PublicUser | None, Depends(require_user, use_cache=False)],
):
    raw = body.url.strip()
    url = raw if "://" in raw else "http://" + raw
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    score, reasons = 0, []

    if parsed.scheme != "https":
        score += 20
        reasons.append("Link does not use HTTPS (not encrypted).")
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", host):
        score += 30
        reasons.append("Uses an IP address instead of a website name.")
    if "@" in raw:
        score += 20
        reasons.append("Contains '@', which can hide the real destination.")
    if len(raw) > 75:
        score += 10
        reasons.append("Very long link.")
    if host.count(".") >= 4:
        score += 10
        reasons.append("Too many subdomains.")
    if host.count("-") >= 3:
        score += 10
        reasons.append("Many hyphens in the domain name.")
    if "xn--" in host:
        score += 20
        reasons.append("Look-alike characters in the domain.")
    if host.endswith(tuple(RISKY_TLDS)):
        score += 15
        reasons.append("Domain ending is often used in scams.")
    if host in SHORTENERS:
        score += 15
        reasons.append("URL shortener hides the real destination.")
    for brand in LOOKALIKE_BRANDS:
        if brand in host:
            score += 30
            reasons.append(f"Lookalike brand name detected: {brand}.")
            break
    found = [w for w in URL_KEYWORDS if w in raw.lower()]
    if found:
        score += min(10 * len(found), 30)
        reasons.append("Suspicious words in link: " + ", ".join(found))
    result = _result(score, reasons)
    await _save_scan(request, user, "url", raw, result)
    return {"data": result}


@router.post("/message")
async def scan_message(
    body: MessageIn,
    request: Request,
    user: Annotated[PublicUser | None, Depends(require_user, use_cache=False)],
):
    text = body.message.lower()
    score, reasons = 0, []

    checks = [
        (["otp", "pin", "cvv", "password"], 30, "Asks for OTP, PIN, CVV or password."),
        (["urgent", "immediately", "within 24", "last chance", "act now", "expire"], 20, "Creates false urgency."),
        (["blocked", "suspended", "kyc", "verify your account"], 20, "Threatens account block or asks for KYC update."),
        (["won", "prize", "lottery", "reward", "gift", "cashback", "free"], 20, "Promises prize or free money."),
        (["anydesk", "teamviewer", "quicksupport", "install app", ".apk"], 25, "Asks to install an app or remote-control tool."),
        (["sbi", "hdfc", "icici", "paytm", "phonepe", "upi", "bank"], 10, "Pretends to be a bank or payment app."),
    ]
    for words, points, reason in checks:
        if any(w in text for w in words):
            score += points
            reasons.append(reason)
    if re.search(r"https?://|www\.", text):
        score += 15
        reasons.append("Contains a link. Do not click unknown links.")
    result = _result(score, reasons)
    await _save_scan(request, user, "message", body.message[:200], result)
    return {"data": result}


@router.post("/website")
async def scan_website(
    body: WebsiteIn,
    request: Request,
    user: Annotated[PublicUser | None, Depends(require_user, use_cache=False)],
):
    raw = body.url.strip()
    url = raw if "://" in raw else "http://" + raw
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    path = (parsed.pathname + parsed.query).lower()
    labels = host.split(".")
    tld = ("." + labels[-1]) if labels and labels[-1] else ""
    subdomain_depth = max(0, len(labels) - 2)
    score, reasons = 0, []

    if parsed.scheme != "https":
        score += 18
        reasons.append("No HTTPS — the connection is not encrypted.")
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", host):
        score += 25
        reasons.append("Uses a raw IP address instead of a domain name.")
    if subdomain_depth >= 3:
        score += 15
        reasons.append("Deeply nested subdomains hide the real domain.")
    elif subdomain_depth == 2:
        score += 8
        reasons.append("Extra subdomain level present.")
    if host.count("-") >= 2:
        score += 12
        reasons.append("Multiple hyphens in the domain (lookalike technique).")
    if tld in RISKY_TLDS:
        score += 14
        reasons.append(f"{tld} is frequently abused for scam sites.")
    for brand in LOOKALIKE_BRANDS:
        if brand in host:
            score += 30
            reasons.append(f"Lookalike brand name detected: {brand}.")
            break
    matched_kw = [w for w in URL_KEYWORDS if w in host or w in path]
    if matched_kw:
        score += min(18, len(matched_kw) * 6)
        reasons.append("Suspicious keywords: " + ", ".join(matched_kw[:5]))
    if len(raw) > 90:
        score += 6
        reasons.append("URL is unusually long.")
    score = max(4, min(97, score))
    result = _result(score, reasons, mode="Website reputation heuristic")
    await _save_scan(request, user, "website", raw, result)
    return {"data": result}


@router.post("/file")
async def scan_file(
    request: Request,
    user: Annotated[PublicUser | None, Depends(require_user, use_cache=False)],
    file: UploadFile = File(...),
):
    raw_name = (file.filename or "").lower()
    parts = raw_name.split(".")
    ext = parts[-1] if len(parts) > 1 else ""
    content = await file.read()
    size = len(content)

    score, reasons = 0, []

    if len(parts) > 2 and ext in {"exe", "scr", "bat", "cmd", "js", "vbs", "apk", "msi"}:
        score += 35
        reasons.append("Double extension pattern — the file hides an executable extension.")
    if ext in {"exe", "scr", "bat", "cmd", "msi", "dll"}:
        score += 25
        reasons.append("Executable file type — can run code on your device.")
    if ext == "apk":
        score += 20
        reasons.append("Android app package — install only from trusted sources.")
    if ext in {"js", "vbs"}:
        score += 20
        reasons.append("Script file type — can execute arbitrary code.")
    if size > 5 * 1024 * 1024:
        score += 10
        reasons.append("Large file size — extra caution recommended.")
    # Heuristic content checks on the raw bytes
    try:
        text_sample = content[:8192].decode("utf-8", errors="ignore").lower()
    except Exception:
        text_sample = ""
    if "powershell" in text_sample or "cmd /c" in text_sample:
        score += 25
        reasons.append("Contains shell command execution patterns.")
    if "http://" in text_sample or "https://" in text_sample:
        score += 10
        reasons.append("Contains URLs that may be used for outbound connections.")
    if re.search(rb"PK\x03\x04", content) and ext not in {"zip", "jar"}:
        score += 15
        reasons.append("Embedded ZIP archive detected inside a non-archive file.")
    if not reasons:
        reasons = ["No obvious malicious patterns detected by our rules."]
    result = _result(score, reasons, mode="Static file heuristic")
    await _save_scan(request, user, "file", raw_name, result)
    return {"data": result}


@router.post("/password")
async def scan_password(
    body: PasswordIn,
    request: Request,
    user: Annotated[PublicUser | None, Depends(require_user, use_cache=False)],
):
    pw = body.password
    lower = pw.lower()
    score, checks = 0, []

    common = [
        "password", "password1", "password123", "123456", "1234567",
        "12345678", "123456789", "qwerty", "qwerty123", "abc123",
        "111111", "iloveyou", "admin", "admin123", "welcome",
        "welcome123", "letmein", "monkey", "dragon", "football",
        "sunshine", "princess", "master", "login", "passw0rd",
    ]
    sequences = ["abcdef", "qwerty", "asdfgh", "zxcvbn", "123456", "098765"]

    is_common = lower in common or any(c in lower for c in common if len(c) >= 6)
    has_upper = bool(re.search(r"[A-Z]", pw))
    has_lower = bool(re.search(r"[a-z]", pw))
    has_number = bool(re.search(r"\d", pw))
    has_special = bool(re.search(r"[^A-Za-z0-9]", pw))
    has_repeats = bool(re.search(r"(.)\1{2,}", pw))
    has_sequence = any(seq in lower for seq in sequences)

    score += min(len(pw), 20) * 2.5
    if has_upper:
        score += 10
    if has_lower:
        score += 8
    if has_number:
        score += 10
    if has_special:
        score += 14
    if len(pw) >= 16:
        score += 8
    if is_common:
        score -= 45
    if has_repeats:
        score -= 10
    if has_sequence:
        score -= 12
    score = max(0, min(100, round(score)))

    if score < 25:
        level = "Very Weak"
    elif score < 45:
        level = "Weak"
    elif score < 65:
        level = "Medium"
    elif score < 85:
        level = "Strong"
    else:
        level = "Very Strong"

    checks_list = [
        {"id": "length", "label": "At least 12 characters", "passed": len(pw) >= 12},
        {"id": "upper", "label": "Contains uppercase letters", "passed": has_upper},
        {"id": "lower", "label": "Contains lowercase letters", "passed": has_lower},
        {"id": "number", "label": "Contains numbers", "passed": has_number},
        {"id": "special", "label": "Contains special characters", "passed": has_special},
        {"id": "common", "label": "Not a common or leaked password", "passed": len(pw) > 0 and not is_common},
    ]

    suggestions = []
    if len(pw) < 12:
        suggestions.append("Extend the password to at least 12 characters.")
    if not has_upper or not has_lower:
        suggestions.append("Mix uppercase and lowercase letters throughout.")
    if not has_number:
        suggestions.append("Add numbers somewhere in the middle of the password.")
    if not has_special:
        suggestions.append("Include special characters such as ! ? @ # % or -.")
    if is_common:
        suggestions.append("This resembles a widely leaked password. Choose something entirely different.")
    if has_repeats:
        suggestions.append("Avoid repeating the same character three or more times.")
    if has_sequence:
        suggestions.append("Avoid keyboard or number sequences like 'qwerty' or '123456'.")
    if not suggestions:
        suggestions.append("This password looks strong. Store it in a password manager and enable two-factor authentication.")

    result = {
        "score": score,
        "level": level,
        "checks": checks_list,
        "suggestions": suggestions,
        "is_common": is_common,
    }
    # Do not save the password itself — only the score metadata.
    await _save_scan(request, user, "password", f"score={score}", result)
    return {"data": result}
