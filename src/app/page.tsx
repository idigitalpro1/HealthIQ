"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What are common symptoms of dehydration?",
  "How many hours of sleep do adults need?",
  "What foods are good for heart health?",
  "How can I manage stress naturally?",
];

function HealthIcon() {
  return (
    <svg
      className="w-8 h-8 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center space-x-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-3 mt-1 shadow-sm">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 mt-1 shadow-sm">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get a response.");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <HealthIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              HealthIQ
            </h1>
            <p className="text-emerald-100 text-xs">
              AI Health Assistant · Powered by Google Gemini
            </p>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {!hasMessages ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to HealthIQ
              </h2>
              <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
                Your AI-powered health companion. Ask me anything about
                symptoms, nutrition, fitness, mental health, and general
                wellness.
              </p>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-md mb-8 text-left">
                <p className="text-amber-800 text-xs leading-relaxed">
                  <span className="font-semibold">⚠️ Disclaimer:</span>{" "}
                  HealthIQ provides general health information only. It is not a
                  substitute for professional medical advice, diagnosis, or
                  treatment. Always consult a qualified healthcare provider for
                  medical concerns.
                </p>
              </div>

              {/* Suggested questions */}
              <div className="w-full max-w-md">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Try asking
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => sendMessage(question)}
                      className="text-left px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm hover:border-emerald-400 hover:bg-emerald-50 transition-colors shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat messages */
            <div>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-3 mt-1 shadow-sm">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <LoadingDots />
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
                  <span className="font-semibold">Error: </span>
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question… (Press Enter to send)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
              style={{ maxHeight: "120px", overflowY: "auto" }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-2">
            Not medical advice · For emergencies, call 911 or your local
            emergency number
          </p>
        </div>
      </footer>
    </div>
  );
}
