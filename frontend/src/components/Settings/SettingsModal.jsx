import React, { useContext, useState } from 'react';
import './SettingsModal.css';
import { Context } from '../../context/context';
import { apiUpdateProfile, apiUpdatePassword } from '../../config/api';

const SettingsModal = () => {
    const { user, setUser, isSettingsOpen, setIsSettingsOpen } = useContext(Context);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileStatus, setProfileStatus] = useState('');

    // Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('');

    if (!isSettingsOpen) return null;

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileStatus('Updating...');
        try {
            const data = await apiUpdateProfile(username, email);
            setUser({ username: data.username, email: data.email });
            setProfileStatus('Profile updated successfully!');
            setTimeout(() => setProfileStatus(''), 3000);
        } catch (error) {
            setProfileStatus(`Error: ${error.message}`);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordStatus('Updating...');
        try {
            await apiUpdatePassword(oldPassword, newPassword);
            setPasswordStatus('Password updated successfully!');
            setOldPassword('');
            setNewPassword('');
            setTimeout(() => setPasswordStatus(''), 3000);
        } catch (error) {
            setPasswordStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="modal-sidebar">
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            👤 Profile
                        </button>
                        <button className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
                            🔒 Account
                        </button>
                    </div>
                    
                    <div className="modal-main">
                        {activeTab === 'profile' && (
                            <form className="settings-form" onSubmit={handleProfileSubmit}>
                                <h3>Edit Profile</h3>
                                {profileStatus && <div className={`status-msg ${profileStatus.includes('Error') ? 'error' : 'success'}`}>{profileStatus}</div>}
                                <div className="form-group">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </form>
                        )}

                        {activeTab === 'account' && (
                            <form className="settings-form" onSubmit={handlePasswordSubmit}>
                                <h3>Change Password</h3>
                                {passwordStatus && <div className={`status-msg ${passwordStatus.includes('Error') ? 'error' : 'success'}`}>{passwordStatus}</div>}
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" 
                                        value={oldPassword} 
                                        onChange={e => setOldPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        required 
                                        minLength={6}
                                    />
                                </div>
                                <button type="submit" className="save-btn">Update Password</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
