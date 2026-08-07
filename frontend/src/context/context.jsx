import { createContext, useState, useCallback } from "react";
import { apiChat, apiGetSessions, apiGetMessages, getUser, logout } from "../config/api";

export const Context = createContext();

// Convert markdown-like text to HTML
function formatMarkdown(text) {
    if (!text) return "";
    return text
        // Bold: **text**
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Italic: *text*
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        // Newlines to <br>
        .replace(/\n/g, "<br/>");
}

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(getUser());
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showResult, setShowResult] = useState(false);

    const onSent = async (prompt) => {
        const currentPrompt = prompt !== undefined ? prompt : input;
        if (!currentPrompt.trim()) return;

        setInput("");
        setShowResult(true);
        setLoading(true);

        // Append user message and loading AI placeholder
        const userMsg = { role: "user", content: currentPrompt };
        const aiPlaceholder = { role: "assistant", content: "", isLoading: true };
        setMessages(prev => [...prev, userMsg, aiPlaceholder]);

        try {
            const data = await apiChat(currentPrompt, currentSessionId);
            const formatted = formatMarkdown(data.response);

            // Replace loading placeholder with real response
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: formatted, isLoading: false };
                return updated;
            });

            if (!currentSessionId) {
                setCurrentSessionId(data.sessionId);
                loadSessions();
            }
        } catch (err) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: "⚠️ Error: " + err.message, isLoading: false };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const loadSessions = useCallback(async () => {
        try {
            const data = await apiGetSessions();
            setSessions(data);
        } catch (e) {
            console.error("Failed to load sessions", e);
        }
    }, []);

    const loadSession = async (sessionId) => {
        setCurrentSessionId(sessionId);
        setShowResult(true);
        setLoading(true);
        try {
            const msgs = await apiGetMessages(sessionId);
            setMessages(msgs.map(m => ({ role: m.role, content: formatMarkdown(m.content), isLoading: false })));
        } catch (e) {
            console.error("Failed to load session", e);
        } finally {
            setLoading(false);
        }
    };

    const newChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setShowResult(false);
        setInput("");
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        newChat();
        setSessions([]);
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <Context.Provider value={{
            input, setInput,
            loading,
            messages,
            showResult,
            sessions,
            currentSessionId,
            user, setUser,
            isSettingsOpen, setIsSettingsOpen,
            onSent,
            loadSessions,
            loadSession,
            newChat,
            handleLogout,
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
