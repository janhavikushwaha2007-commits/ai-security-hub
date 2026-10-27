// Frontend-only, rule-based security assistant content.
// NOTE: This is NOT a connected AI model. Responses come from a fixed set of
// rule-based educational answers matched by keywords. Nothing is sent to any
// service, and chat history is kept in memory for the current page session only.

export interface AssistantLink {
  label: string;
  to: string;
}

export interface AssistantAnswer {
  text: string;
  links?: AssistantLink[] | undefined;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  links?: AssistantLink[] | undefined;
  time: string;
}

export const suggestedQuestions = [
  "How can I spot a phishing email?",
  "How do I check if a URL is safe?",
  "What makes a password strong?",
  "How do I know if a file is malicious?",
  "Is it safe to use public Wi-Fi?",
  "What should I do if I clicked a suspicious link?",
];

const PHISHING: AssistantAnswer = {
  text:
    "Phishing messages try to trick you into clicking a link, sharing a code, or paying someone. Common warning signs:\n" +
    "• Urgency or threats — \"your account will be closed in 24 hours\".\n" +
    "• A sender name you recognise but an address or number that doesn't match.\n" +
    "• Links whose real domain differs from the brand shown (hover before tapping).\n" +
    "• Requests for OTPs, passwords, or card details — no legitimate service asks for these.\n" +
    "• Too-good-to-be-true offers, unexpected refunds, or prize claims.\n" +
    "If a message shows any of these, don't tap, don't reply, and don't pay — verify with the company through its official app or website instead.",
  links: [
    { label: "Open Scam Message Scanner", to: "/scan-message" },
    { label: "Check a URL", to: "/scan-url" },
  ],
};

const URL: AssistantAnswer = {
  text:
    "To judge a link before opening it:\n" +
    "• Check the domain itself, not the words around it — \"paypa1.com\" and \"secure-login-paypal.example.net\" are not PayPal.\n" +
    "• Prefer https, but remember https only means the connection is encrypted, not that the site is honest.\n" +
    "• Watch for hyphens, odd endings, and shortened links (bit.ly and similar hide the real target).\n" +
    "• Be extra careful with login, payment, and OTP pages reached from messages rather than by typing the address yourself.\n" +
    "A structured check against known patterns and page signals catches most fakes.",
  links: [
    { label: "Open Phishing URL Scanner", to: "/scan-url" },
    { label: "Open Fake Website Detection", to: "/fake-website" },
  ],
};

const PASSWORD: AssistantAnswer = {
  text:
    "A strong password is long, unique, and hard to guess:\n" +
    "• Length beats complexity — aim for 12–16+ characters.\n" +
    "• Mix upper case, lower case, numbers, and symbols.\n" +
    "• Never reuse a password across accounts; one leak then unlocks everything.\n" +
    "• Avoid names, birthdays, and common patterns like \"Password123\" — checkers flag these instantly.\n" +
    "• A passphrase of 4 random words (\"copper-lantern-tide-map\") is both strong and memorable.\n" +
    "• Use a password manager to generate and store unique passwords, and turn on 2FA wherever it's offered.",
  links: [{ label: "Open Password Strength Checker", to: "/password-check" }],
};

const FILE: AssistantAnswer = {
  text:
    "Treat unexpected files as guilty until checked:\n" +
    "• Double extensions are a classic trap — \"invoice.pdf.exe\" is a program, not a PDF.\n" +
    "• Be careful with macro-enabled Office files (.docm, .xlsm) and archives (.zip, .rar) from unknown senders.\n" +
    "• Never run .exe, .bat, .apk, or .scr attachments you didn't expect.\n" +
    "• Real invoices and statements come from portals you log into, not surprise attachments.\n" +
    "• Keep your OS and antivirus updated, and scan any file before opening it.",
  links: [{ label: "Open Malicious File Detection", to: "/scan-file" }],
};

const WIFI: AssistantAnswer = {
  text:
    "Public Wi-Fi is convenient but risky:\n" +
    "• Assume anyone nearby can try to watch unencrypted traffic.\n" +
    "• Confirm the network name with staff — fake hotspots imitate real ones.\n" +
    "• Avoid logging into banking or payment apps on public networks; use mobile data for those.\n" +
    "• Turn off automatic connection to open networks and forget networks after use.\n" +
    "• Look for https and padlock icons before entering anything, and consider a VPN for regular public-network use.",
};

const CLICKED: AssistantAnswer = {
  text:
    "If you already clicked a suspicious link:\n" +
    "1. Don't enter anything more and close the page.\n" +
    "2. If you typed a password, change it immediately — starting with the account it belongs to, then anywhere you reused it.\n" +
    "3. If you entered card details, call your bank and watch for unauthorised transactions.\n" +
    "4. If you shared an OTP, treat that account as compromised and change its password now.\n" +
    "5. Run a full device scan and keep an eye out for unusual sign-in alerts.\n" +
    "Acting within minutes matters far more than anything else.",
  links: [{ label: "Run a Security Score check", to: "/security-score" }],
};

const SCAM_MESSAGE: AssistantAnswer = {
  text:
    "Scam messages share a playbook: pressure, money, and secrecy.\n" +
    "• Small payment demands (\"₹35 parcel fee\") are probes — paying confirms your number is live.\n" +
    "• \"Your KYC is expired\", \"SIM will be blocked today\", and \"tax refund pending\" are common hooks.\n" +
    "• Unknown numbers with links are the biggest red flag; legitimate companies rarely ask via SMS.\n" +
    "• Verify by calling the company's official number, never one printed in the message.",
  links: [{ label: "Open Scam Message Scanner", to: "/scan-message" }],
};

const CAPABILITIES: AssistantAnswer = {
  text:
    "I'm the AI Security Mesh demo assistant — a rule-based helper, not a connected AI model. I can explain:\n" +
    "• Spotting phishing emails and scam messages\n" +
    "• Checking whether a URL or website looks safe\n" +
    "• Building strong passwords and using them safely\n" +
    "• Recognising malicious files and risky attachments\n" +
    "• Staying safe on public Wi-Fi\n" +
    "• What to do after clicking a suspicious link\n" +
    "Pick a suggested question or type your own.",
};

const FALLBACK: AssistantAnswer = {
  text:
    "I'm a rule-based demo assistant, so I only answer known security topics. I can help with phishing, suspicious URLs, password safety, malicious files, public Wi-Fi, scam messages, and what to do after clicking a bad link. Try one of the suggested questions below, or rephrase your question using those words.",
};

interface Rule {
  keywords: string[];
  answer: AssistantAnswer;
}

const RULES: Rule[] = [
  { keywords: ["phish", "fraud mail", "fake mail", "spoofed email", "email scam"], answer: PHISHING },
  {
    keywords: ["url", "link", "website safe", "fake website", "site safe", "shortened"],
    answer: URL,
  },
  {
    keywords: ["password", "passphrase", "2fa", "two-factor", "credential"],
    answer: PASSWORD,
  },
  {
    keywords: ["file", "attachment", "exe", "pdf.exe", "zip", "malware", "virus", "trojan", "macro"],
    answer: FILE,
  },
  { keywords: ["wi-fi", "wifi", "public network", "hotspot"], answer: WIFI },
  { keywords: ["clicked", "opened a link", "entered my password", "shared otp", "i tapped"], answer: CLICKED },
  { keywords: ["scam message", "sms", "text message", "otp", "parcel", "kyc", "refund"], answer: SCAM_MESSAGE },
  {
    keywords: ["help", "what can you do", "topics", "who are you", "what are you"],
    answer: CAPABILITIES,
  },
];

/** Match an input against the rule-based answer set. First match wins. */
export function getAssistantAnswer(input: string): AssistantAnswer {
  const text = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.answer;
    }
  }
  return FALLBACK;
}

export const assistantDisclaimer =
  "Frontend demo assistant — rule-based educational answers, not a connected AI model. Nothing you type is sent to a service or stored.";

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let counter = 0;
export function nextMessageId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}
