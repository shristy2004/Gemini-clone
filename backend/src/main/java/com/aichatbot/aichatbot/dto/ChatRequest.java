package com.aichatbot.aichatbot.dto;

public class ChatRequest {
    private String prompt;
    private String sessionId; // optional — null means new session

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}