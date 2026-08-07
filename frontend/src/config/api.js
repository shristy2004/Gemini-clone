/* ===================== */
/* Global API helpers    */
/* ===================== */

const BASE_URL = "http://localhost:8080/api";

function getToken() {
    return localStorage.getItem("token");
}

export function getUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

/* Auth */
export async function apiRegister(email, username, password) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username }));
    return data;
}

export async function apiLogin(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username }));
    return data;
}

/* User Settings */
export async function apiUpdateProfile(username, email) {
    const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ username, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    // Update local storage
    localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username }));
    return data;
}

export async function apiUpdatePassword(oldPassword, newPassword) {
    const res = await fetch(`${BASE_URL}/user/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    return data;
}

/* Chat */
export async function apiChat(prompt, sessionId) {
    const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ prompt, sessionId: sessionId || null }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(body);
    }
    return res.json(); // { response, sessionId }
}

export async function apiGetSessions() {
    const res = await fetch(`${BASE_URL}/sessions`, {
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
}

export async function apiGetMessages(sessionId) {
    const res = await fetch(`${BASE_URL}/sessions/${sessionId}/messages`, {
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
}
