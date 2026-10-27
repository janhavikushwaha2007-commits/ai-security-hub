import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Bot, Eraser, Info, UserRound } from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import {
  assistantDisclaimer,
  formatMessageTime,
  getAssistantAnswer,
  nextMessageId,
  suggestedQuestions,
  type AssistantMessage,
} from "./assistant-data";

function welcomeMessage(): AssistantMessage {
  return {
    id: nextMessageId(),
    role: "assistant",
    text:
      "Hello! I'm the AI Security Mesh demo assistant — a rule-based helper for everyday security questions, not a connected AI model. Ask me about phishing, suspicious links, password safety, malicious files, or public Wi-Fi, or pick a suggested question below.",
    time: formatMessageTime(new Date()),
  };
}

export function AssistantChat() {
  const [messages, setMessages] = useState<AssistantMessage[]>([welcomeMessage()]);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) {
      setInputError(true);
      return;
    }
    setInputError(false);
    const now = new Date();
    const userMessage: AssistantMessage = {
      id: nextMessageId(),
      role: "user",
      text,
      time: formatMessageTime(now),
    };
    const answer = getAssistantAnswer(text);
    const botMessage: AssistantMessage = {
      id: nextMessageId(),
      role: "assistant",
      text: answer.text,
      links: answer.links,
      time: formatMessageTime(now),
    };
    // Rule-based response is computed locally — appended immediately, with no
    // simulated "AI thinking" delay.
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const clearChat = () => {
    setMessages([welcomeMessage()]);
    setInput("");
    setInputError(false);
  };

  return (
    <section
      aria-labelledby="assistant-chat-heading"
      className="surface-card flex flex-col overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/40 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]">
            <Bot className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <div>
            <h2 id="assistant-chat-heading" className="text-sm font-semibold sm:text-base">
              Security Assistant
            </h2>
            <p className="text-xs text-muted-foreground">Rule-based demo — session history only</p>
          </div>
        </div>
        <MeshButton variant="ghost" size="sm" onClick={clearChat}>
          <Eraser className="size-4" aria-hidden="true" />
          Clear chat
        </MeshButton>
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
        role="log"
        aria-live="polite"
        aria-label="Assistant conversation"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
          >
            <span
              className={cn(
                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg shadow-[var(--shadow-soft)]",
                message.role === "user"
                  ? "border border-primary/40 bg-primary/15 text-primary"
                  : "bg-[image:var(--gradient-brand)] text-primary-foreground",
              )}
            >
              {message.role === "user" ? (
                <UserRound className="size-4" aria-hidden="true" />
              ) : (
                <Bot className="size-4" aria-hidden="true" />
              )}
            </span>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-soft)] sm:max-w-[75%]",
                message.role === "user"
                  ? "rounded-tr-sm bg-[image:var(--gradient-brand)] text-primary-foreground"
                  : "rounded-tl-sm border border-border bg-surface/60 text-foreground",
              )}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              {message.links?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.links.map((link) => (
                    <Link
                      key={link.to + link.label}
                      to={link.to}
                      className="press-3d inline-flex items-center gap-1.5 rounded-lg border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              <p
                className={cn(
                  "mt-1.5 text-[11px]",
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-surface/40 px-4 py-4 sm:px-6">
        <p className="mb-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
          {assistantDisclaimer}
        </p>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => send(question)}
              className="press-3d shrink-0 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-accent/60 hover:text-foreground"
            >
              {question}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="assistant-input" className="sr-only">
              Ask a security question
            </label>
            <input
              id="assistant-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (inputError) setInputError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about phishing, passwords, files, links..."
              aria-invalid={inputError}
              aria-describedby={inputError ? "assistant-input-error" : undefined}
              autoComplete="off"
              className={cn(
                "w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
                inputError ? "border-destructive" : "border-border focus:border-accent",
              )}
            />
            {inputError ? (
              <p id="assistant-input-error" className="mt-1.5 text-xs text-destructive">
                Please type a question before sending.
              </p>
            ) : null}
          </div>
          <MeshButton type="submit" size="lg" aria-label="Send message">
            <ArrowUp className="size-4" aria-hidden="true" />
            Send
          </MeshButton>
        </form>
      </div>
    </section>
  );
}
