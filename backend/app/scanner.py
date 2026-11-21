import re
from urllib.parse import urlparse

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/scan", tags=["scan"])


class UrlIn(BaseModel):
    url: str


class MessageIn(BaseModel):
    message: str


def _result(score, reasons):
    score = min(score, 100)
    level = "Low" if score < 25 else "Medium" if score < 55 else "High"
    if not reasons:
        reasons = ["No suspicious patterns found by our rules."]
    return {
        "data": {
            "risk_score": score,
            "risk_level": level,
            "reasons": reasons,
            "mode": "Rule-based analysis (no AI model connected)",
        }
    }


@router.post("/url")
async def scan_url(body: UrlIn):
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
    if host.endswith((".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".zip")):
        score += 15
        reasons.append("Domain ending is often used in scams.")
    if host in {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly"}:
        score += 15
        reasons.append("URL shortener hides the real destination.")
    words = ["login", "verify", "secure", "update", "bank", "account",
             "password", "free", "gift", "win", "kyc", "otp", "reward"]
    found = [w for w in words if w in raw.lower()]
    if found:
        score += min(10 * len(found), 30)
        reasons.append("Suspicious words in link: " + ", ".join(found))
    return _result(score, reasons)


@router.post("/message")
async def scan_message(body: MessageIn):
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
    return _result(score, reasons)