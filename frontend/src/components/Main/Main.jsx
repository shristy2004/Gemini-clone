import React, { useContext, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';

const Main = () => {
    const { onSent, showResult, loading, messages, setInput, input, user } = useContext(Context);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSent();
        }
    };

    const suggestions = [
        { text: "Suggest beautiful places to see on an upcoming road trip", emoji: "🧭" },
        { text: "Briefly summarize this concept: urban planning", emoji: "💡" },
        { text: "Brainstorm team bonding activities for our work retreat", emoji: "💬" },
        { text: "Improve the readability of the following code", emoji: "💻" },
    ];

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : "?";

    return (
        <div className="main">
            {/* Slim Top Bar — no profile, just branding */}
            <div className="nav">
                <div className="nav-brand">
                    <img src={assets.gemini_icon} alt="logo" className="nav-logo" />
                    <span className="nav-title">AI Chat</span>
                </div>
            </div>

            {/* Scrollable Chat Area */}
            <div className="chat-area">
                {!showResult ? (
                    <div className="welcome-screen">
                        <div className="greet">
                            <h1>Hello, <span>{user?.username || 'there'} 👋</span></h1>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            {suggestions.map((s, i) => (
                                <div className="card" key={i} onClick={() => onSent(s.text)} id={`suggestion-${i}`}>
                                    <p>{s.text}</p>
                                    <span className="card-emoji">{s.emoji}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-row ${msg.role}`}>
                                {msg.role === 'user' ? (
                                    <div className="user-message">
                                        <div className="user-bubble">
                                            <p>{msg.content}</p>
                                        </div>
                                        <div className="user-avatar">{initials}</div>
                                    </div>
                                ) : (
                                    <div className="ai-message">
                                        <img src={assets.gemini_icon} alt="AI" className="ai-avatar" />
                                        <div className="ai-bubble">
                                            {msg.isLoading ? (
                                                <div className="loader">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            ) : (
                                                <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="input-wrapper">
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Message AI Chat..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        id="chat-input"
                    />
                    <button
                        className={`send-btn ${input.trim() && !loading ? 'active' : ''}`}
                        onClick={() => onSent()}
                        disabled={!input.trim() || loading}
                        id="send-btn"
                    >
                        ➤
                    </button>
                </div>
                <p className="input-hint">AI Chat can make mistakes. Consider checking important information.</p>
            </div>
        </div>
    );
};

export default Main;
