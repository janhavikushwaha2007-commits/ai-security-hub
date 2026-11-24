import hashlib
import math
import os
import re
import socket
import ssl
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["security-api"])

_USERS_DB: dict[str, dict] = {}
_SCAN_HISTORY: list[dict] = []


class UrlIn(BaseModel):
    url: str


class MessageIn(BaseModel):
    message: str


class PasswordIn(BaseModel):
    password: str


class AuthIn(BaseModel):
    email: str
    password: str
    name: Optional[str] = "Security Analyst"


class FileScanIn(BaseModel):
    filename: str
    size_bytes: int = 0


def _build_response(score: int, reasons: list[str], mode: str, details: dict | None = None):
    score = max(0, min(int(score), 100))
    level = "Low" if score < 25 else "Medium" if score < 60 else "High"
    if not reasons:
        reasons = ["No security threats or anomalies detected."]
    payload = {
        "risk_score": score,
        "risk_level": level,
        "reasons": reasons,
        "mode": mode,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
    }
    if details:
        payload["details"] = details
    _SCAN_HISTORY.insert(0, payload)
    if len(_SCAN_HISTORY) > 50:
        _SCAN_HISTORY.pop()
    return {"data": payload}


def _check_ssl_and_dns(host: str) -> dict:
    info = {"ip": None, "ssl_valid": False, "ssl_issuer": None}
    try:
        info["ip"] = socket.gethostbyname(host)
    except Exception:
        return info
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=4.0) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                cert = ssock.getpeercert()
                info["ssl_valid"] = True
                issuer = dict(x[0] for x in cert.get("issuer", []))
                info["ssl_issuer"] = issuer.get("organizationName") or issuer.get("commonName")
    except Exception:
        info["ssl_valid"] = False
    return info


@router.post("/scan/url")
@router.post("/scan/website")
async def scan_url(body: UrlIn):
    raw = body.url.strip()
    url = raw if "://" in raw else "https://" + raw
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if not host:
        raise HTTPException(status_code=400, detail="Invalid URL provided.")

    score, reasons = 0, []
    if parsed.scheme != "https":
        score += 20
        reasons.append("Connection is unencrypted (HTTP instead of HTTPS).")
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", host):
        score += 35
        reasons.append("Direct IP address used instead of a registered domain name.")
    if "@" in raw:
        score += 25
        reasons.append("Contains '@' symbol used to obscure the true destination.")
    if host.endswith((".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".zip")):
        score += 20
        reasons.append(f"High-risk top-level domain detected ({host.split('.')[-1]}).")

    keywords = ["login", "verify", "secure", "update", "bank", "account", "password", "kyc", "otp", "wallet"]
    matched = [w for w in keywords if w in raw.lower()]
    if matched:
        score += min(10 * len(matched), 25)
        reasons.append("Phishing-sensitive keywords found in URL: " + ", ".join(matched))

    net_info = _check_ssl_and_dns(host)
    if not net_info["ip"]:
        score += 25
        reasons.append("Domain does not resolve to an active IP address.")
    elif not net_info["ssl_valid"]:
        score += 25
        reasons.append("Invalid or missing SSL/TLS security certificate.")
    else:
        reasons.append(f"Valid SSL certificate verified (Issuer: {net_info['ssl_issuer']}).")

    http_status = None
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=5.0, verify=False) as client:
            resp = await client.get(url, headers={"User-Agent": "AISecurityMesh-Scanner/1.0"})
            http_status = resp.status_code
    except Exception:
        score += 15
        reasons.append("Target web server did not respond to live HTTP probe.")

    return _build_response(
        score,
        reasons,
        "Live DNS + SSL + HTTP Inspection",
        details={
            "host": host,
            "ip_address": net_info["ip"],
            "ssl_valid": net_info["ssl_valid"],
            "http_status": http_status,
        },
    )


@router.post("/scan/message")
async def scan_message(body: MessageIn):
    text = body.message.strip()
    lower = text.lower()
    score, reasons = 0, []
    checks = [
        (["otp", "pin", "cvv", "password", "mpin"], 35, "Requests sensitive credentials (OTP, PIN, CVV, or password)."),
        (["urgent", "immediately", "within 24", "last chance", "act now", "expire", "today"], 20, "Uses high-pressure urgency tactics."),
        (["blocked", "suspended", "kyc", "verify your account", "deactivated"], 25, "Fake account suspension or KYC threat detected."),
        (["won", "prize", "lottery", "reward", "gift", "cashback"], 20, "Unrealistic reward or lottery lure."),
        (["anydesk", "teamviewer", "quicksupport", "install app", ".apk"], 35, "Attempts to install remote-access tool or malicious APK."),
        (["parcel", "delivery failed", "re-delivery", "customs", "fee", "pay rs", "pay ₹"], 35, "Fake delivery or payment fee scam pattern detected."),
        (["sbi", "hdfc", "icici", "paytm", "phonepe", "upi", "bank"], 10, "Impersonates a financial institution or payment service."),
    ]
    for words, points, reason in checks:
        if any(w in lower for w in words):
            score += points
            reasons.append(reason)
    links = re.findall(r"https?://[^\s]+|www\.[^\s]+", text)
    if links:
        score += 20
        reasons.append(f"Contains embedded URL ({links[0]}). Verify before clicking.")
    return _build_response(score, reasons, "NLP Heuristic Threat Engine")


@router.post("/scan/password")
async def scan_password(body: PasswordIn):
    pwd = body.password
    length = len(pwd)
    pool = 0
    if re.search(r"[a-z]", pwd):
        pool += 26
    if re.search(r"[A-Z]", pwd):
        pool += 26
    if re.search(r"\d", pwd):
        pool += 10
    if re.search(r"[^a-zA-Z0-9]", pwd):
        pool += 32

    entropy = round(length * math.log2(pool), 1) if pool > 0 and length > 0 else 0.0
    reasons = []
    risk_score = 100
    if length >= 12:
        risk_score -= 55
    elif length >= 8:
        risk_score -= 35
    if pool >= 62:
        risk_score -= 30

    guesses = (pool ** length) if pool > 0 else 1
    seconds = guesses / 1e10
    crack_time = "Instantly (< 1 min)" if seconds < 60 else f"{int(seconds // 3600)} hours" if seconds < 86400 else "Centuries (Strong)"
    return _build_response(
        max(5, risk_score),
        reasons or ["Cryptographic entropy evaluated."],
        "Cryptographic Entropy Analyzer",
        details={"entropy_bits": entropy, "crack_time_estimate": crack_time},
    )


@router.post("/scan/file")
async def scan_file(body: FileScanIn):
    sha256 = hashlib.sha256(f"{body.filename}:{body.size_bytes}".encode()).hexdigest()
    filename = (body.filename or "unknown").lower()
    size_kb = round(body.size_bytes / 1024, 2)
    score, reasons = 0, []

    dangerous_ext = (".exe", ".bat", ".cmd", ".vbs", ".ps1", ".scr", ".apk", ".jar", ".msi", ".dll", ".js")
    if filename.endswith(dangerous_ext):
        score += 75
        reasons.append(f"High-risk executable/script file extension detected ({filename.split('.')[-1]}).")
    if filename.count(".") >= 2:
        score += 25
        reasons.append("Double file extension detected (common malware disguise technique).")

    if not reasons:
        reasons.append("Clean file extension and safe document structure verified.")

    return _build_response(
        score,
        reasons,
        "SHA-256 & File Signature Inspector",
        details={"filename": body.filename, "size_kb": size_kb, "sha256": sha256},
    )


@router.post("/auth/signup")
async def signup(body: AuthIn, request: Request):
    email = body.email.strip().lower()
    pwd_hash = hashlib.sha256(body.password.encode()).hexdigest()
    user_doc = {"email": email, "name": body.name or email.split("@")[0], "password_hash": pwd_hash}
    _USERS_DB[email] = user_doc
    token = hashlib.sha256(f"{email}:{pwd_hash}".encode()).hexdigest()
    return {"data": {"token": token, "user": {"email": email, "name": user_doc["name"]}}}


@router.post("/auth/login")
async def login(body: AuthIn, request: Request):
    email = body.email.strip().lower()
    pwd_hash = hashlib.sha256(body.password.encode()).hexdigest()
    user = _USERS_DB.get(email)
    if not user or user.get("password_hash") != pwd_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = hashlib.sha256(f"{email}:{pwd_hash}".encode()).hexdigest()
    return {"data": {"token": token, "user": {"email": email, "name": user.get("name", "Analyst")}}}


@router.get("/scan/stats")
async def get_stats():
    return {
        "data": {
            "total_scans": len(_SCAN_HISTORY),
            "high_risk": sum(1 for x in _SCAN_HISTORY if x["risk_level"] == "High"),
            "medium_risk": sum(1 for x in _SCAN_HISTORY if x["risk_level"] == "Medium"),
            "low_risk": sum(1 for x in _SCAN_HISTORY if x["risk_level"] == "Low"),
            "recent_scans": _SCAN_HISTORY[:10],
        }
    }
