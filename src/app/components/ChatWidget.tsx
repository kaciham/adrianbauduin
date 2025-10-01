"use client";

import React, { useEffect, useRef, useState } from "react";

const ChatWidget: React.FC = () => {
    // open by default (no onclick required to show chat)
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [messages, setMessages] = useState<
        { type: "user" | "bot" | "waiting"; content: string | React.ReactNode }[]
    >([{ type: "bot", content: '<strong>Bonjour, comment puis-je vous aider dans la réalisation de votre devis ?</strong>' }]);
    const [inputValue, setInputValue] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getChatId = () => {
        let sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = "chat_" + Math.random().toString(36).slice(2, 11);
            sessionStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const handleCopyMessage = async (rawContent: string, index: number) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawContent;
        const textToCopy = tempDiv.textContent ?? tempDiv.innerText ?? rawContent;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = textToCopy;
                textarea.setAttribute("readonly", "");
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            setCopiedIndex(index);
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy message", err);
        }
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const userMessage = { type: "user" as const, content: inputValue };
        const waitingMessage = {
            type: "waiting" as const,
            content: (
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" />
                </div>
            ),
        };

        setMessages((p) => [...p, userMessage, waitingMessage]);
        const chatInput = inputValue;
        setInputValue("");

        try {
            const sessionId = getChatId();
            // Prefer Next.js public env injected at build-time, fall back to window global (for dev/testing)
            const webhookUrl: string = (process.env.NEXT_PUBLIC_WEBHOOK_URL as string) ||
                ((typeof window !== "undefined" && (window as unknown as Record<string, string>).NEXT_PUBLIC_WEBHOOK_URL) || "");
            console.log("Sending to webhook:", webhookUrl ? "[REDACTED]" : "(missing)", { sessionId, chatInput });
            if (!webhookUrl) {
                // Show user-friendly message instead of throwing raw error
                console.error("WEBHOOK URL is not set. Set NEXT_PUBLIC_WEBHOOK_URL in your .env.local or provide it on window.NEXT_PUBLIC_WEBHOOK_URL for testing.");
                setMessages((prev) => {
                    const withoutWaiting = prev.filter((m) => m.type !== "waiting");
                    const errMsg = { type: "bot" as const, content: "Le service de chat n'est pas configuré. Veuillez contacter l'administrateur." };
                    return [...withoutWaiting, errMsg];
                });
                return;
            }
            const res = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, chatInput }),
            });
            const data = await res.json();
            setMessages((prev) => {
                const withoutWaiting = prev.filter((m) => m.type !== "waiting");
                const botMsg = { type: "bot" as const, content: data.output || "Désolé, je n'ai pas compris." };
                return [...withoutWaiting, botMsg];
            });
        } catch (err) {
            console.error(err);
            setMessages((prev) => {
                const withoutWaiting = prev.filter((m) => m.type !== "waiting");
                const errMsg = { type: "bot" as const, content: "Une erreur est survenue." };
                return [...withoutWaiting, errMsg];
            });
        }
    };

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-3xl rounded-lg bg-white shadow sm:mt-6">
                {/* Header with collapse control */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gray-600 text-white flex items-center justify-center font-semibold">AI</div>
                        <div>
                            <div className="text-sm font-semibold">Adrian Bauduin</div>
                            <div className="text-xs text-gray-500">Devis IA</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen((v) => !v)}
                            className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                            aria-label="Toggle chat"
                        >
                            {isOpen ? "Réduire" : "Ouvrir"}
                        </button>
                    </div>
                </div>

                {/* Inline chat content */}
                <div className={`${isOpen ? "block" : "hidden"}`}>
                    <div className="flex h-[60vh] min-h-[300px] my-8 shadow-2xl flex-col px-4 py-3 sm:h-[65vh]">
                        <div ref={chatBodyRef} className="custom-scrollbar mb-3 flex-1 overflow-y-auto pr-2">
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.type === "bot" && typeof msg.content === "string" ? (
                                        <div className="flex items-start gap-2">
                                            <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-sm leading-relaxed text-gray-800">
                                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                            </div>
                                            <button
                                            title="Copier la réponse"
                                                type="button"
                                                onClick={() => typeof msg.content === "string" && handleCopyMessage(msg.content, i)}
                                                className="mt-1 text-gray-400 transition hover:text-gray-600 focus:outline-none cursor-pointer"
                                                aria-label={copiedIndex === i ? "Réponse copiée" : "Copier la réponse"}
                                            >
                                                {copiedIndex === i ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                                                msg.type === "user" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {typeof msg.content === "string" ? (
                                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex w-full items-center gap-2 border-t pt-3">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Tapez votre message..."
                                className="w-full rounded-md border px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                style={{ color: "black" }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-black cursor-pointer"
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;

