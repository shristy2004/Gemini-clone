async function runChat(prompt) {
    const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: prompt,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(body);
    }

    const data = await response.json();

    // Adjust this if your ChatResponse uses a different field name
    return data.response;
}

export default runChat;