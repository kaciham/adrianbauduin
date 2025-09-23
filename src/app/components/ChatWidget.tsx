"use client";

import React, { useEffect, useRef, useState } from "react";

const ChatWidget: React.FC = () => {
    // open by default (no onclick required to show chat)
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [messages, setMessages] = useState<
        { type: "user" | "bot" | "waiting"; content: string | React.ReactNode }[]
    >([{ type: "bot", content: '<strong>Bonjour, comment puis-je vous aider dans la réalisation de votre devis ?</strong>' }]);
    const [inputValue, setInputValue] = useState("");
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

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
                ((typeof window !== "undefined" && (window as any).NEXT_PUBLIC_WEBHOOK_URL) || "");
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
                    <div className="flex h-[60vh] min-h-[300px] flex-col px-4 py-3 sm:h-[65vh]">
                        <div ref={chatBodyRef} className="custom-scrollbar mb-3 flex-1 overflow-y-auto pr-2">
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
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
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex w-full items-center gap-2 border-t pt-3">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Tapez votre message..."
                                className="w-full rounded-md border px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-black"
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


