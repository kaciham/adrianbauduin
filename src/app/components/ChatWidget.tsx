'use client';

import { useState, useEffect, useRef } from 'react';


const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ type: 'user' | 'bot' | 'waiting'; content: string | React.ReactNode }[]>([
        { type: 'bot', content: '<strong>Bonjour, comment puis-je vous aider ?</strong>' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const getChatId = () => {
        let sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = "chat_" + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        const userMessage = { type: 'user' as const, content: inputValue };
        const waitingMessage = { type: 'waiting' as const, content: (
            <div className="waiting-animation">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        )};
        
        setMessages(prevMessages => [...prevMessages, userMessage, waitingMessage]);
        setInputValue('');

        const sessionId = getChatId();
        const webhookUrl: string = (typeof window !== "undefined" && (window as any).NEXT_PUBLIC_WEBHOOK_URL) || "";
        fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId: sessionId,
                chatInput: inputValue,
            })
        })
        .then(response => response.json())
        .then(data => {
            setMessages(prevMessages => {
                const newMessages = prevMessages.filter(msg => msg.type !== 'waiting');
                const botMessage = { type: 'bot' as const, content: data.output || "Sorry, I couldn't understand that." };
                return [...newMessages, botMessage];
            });
        })
        .catch(error => {
            console.error("Error:", error);
            setMessages(prevMessages => {
                const newMessages = prevMessages.filter(msg => msg.type !== 'waiting');
                const errorMessage = { type: 'bot' as const, content: "Sorry, something went wrong." };
                return [...newMessages, errorMessage];
            });
        });
    };

    return (
        <>
            <button id="chat-widget-button" onClick={() => setIsOpen(true)} style={{ display: isOpen ? 'none' : 'flex' }}>
                💬
            </button>

            <div id="chat-widget-container" style={{ display: isOpen ? 'flex' : 'none' }}>
                <div id="chat-widget-header">
                    <span>Chat</span>
                    <button onClick={() => setIsOpen(false)}>✖</button>
                </div>
                <div id="chat-widget-body" ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.type === 'user' ? 'user-message' : msg.type === 'bot' ? 'bot-message' : ''}>
                            {typeof msg.content === 'string' ? <p dangerouslySetInnerHTML={{ __html: msg.content }} /> : msg.content}
                        </div>
                    ))}
                </div>
                <div id="chat-widget-footer">
                    <input
                        type="text"
                        id="chat-widget-input"
                        placeholder="Veuillez saisir votre message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button id="chat-widget-send" onClick={handleSendMessage}>Envoyer</button>
                </div>
            </div>

            
        </>
    );
};

export default ChatWidget;
