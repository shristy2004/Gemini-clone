import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';
import SettingsModal from '../Settings/SettingsModal';

const Sidebar = () => {
    const { sessions, loadSessions, loadSession, newChat, currentSessionId, user, handleLogout, setIsSettingsOpen } = useContext(Context);
    const [extended, setExtended] = useState(true);

    useEffect(() => {
        if (user) loadSessions();
    }, [user, loadSessions]);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const diff = Date.now() - date.getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className={`sidebar ${extended ? '' : 'collapsed'}`}>

            {/* Header */}
            <div className="sidebar-header">
                <button className="icon-btn" onClick={() => setExtended(e => !e)} title="Toggle sidebar">
                    ☰
                </button>
                {extended && <span className="sidebar-brand">AI Chat</span>}
            </div>

            {/* New Chat */}
            <div className="sidebar-section">
                <button className="new-chat-btn" onClick={newChat} id="new-chat-btn" title="New Chat">
                    <span className="plus-icon">＋</span>
                    {extended && <span className="new-chat-text">New Chat</span>}
                </button>
            </div>

            {/* History */}
            {extended && (
                <div className="sidebar-section history-section">
                    <p className="section-label">Recent</p>
                    <div className="sessions-scroll">
                        {sessions.length === 0 ? (
                            <p className="empty-msg">No conversations yet.<br/>Start a new chat!</p>
                        ) : (
                            sessions.map(session => (
                                <button
                                    key={session.id}
                                    className={`session-btn ${currentSessionId === session.id ? 'active' : ''}`}
                                    onClick={() => loadSession(session.id)}
                                    title={session.title}
                                    id={`session-${session.id}`}
                                >
                                    <span className="s-icon">💬</span>
                                    <span className="s-title">{session.title}</span>
                                    <span className="s-date">{formatDate(session.updatedAt)}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Profile — only here, not in the nav */}
            <div className="sidebar-footer">
                <div className="profile-row" onClick={() => setIsSettingsOpen(true)} title="Settings">
                    <div className="avatar">{initials}</div>
                    {extended && (
                        <div className="profile-text">
                            <span className="profile-name">{user?.username}</span>
                            <span className="profile-email">{user?.email}</span>
                        </div>
                    )}
                    {extended && (
                        <button className="logout-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Sign out" id="logout-btn">
                            Sign out
                        </button>
                    )}
                </div>
            </div>
            
            <SettingsModal />
        </div>
    );
};

export default Sidebar;
