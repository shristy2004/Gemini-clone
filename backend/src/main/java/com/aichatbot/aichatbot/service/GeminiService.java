package com.aichatbot.aichatbot.service;

import com.aichatbot.aichatbot.model.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Send a prompt with full conversation history for context memory.
     */
    public String chat(String prompt, List<ChatMessage> history) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        // Build messages array from history + new prompt
        List<Map<String, String>> messages = new ArrayList<>();

        // Add system message
        messages.add(Map.of(
                "role", "system",
                "content", "You are a helpful AI assistant. Answer clearly and concisely."
        ));

        // Add conversation history
        for (ChatMessage msg : history) {
            messages.add(Map.of(
                    "role", msg.getRole(),
                    "content", msg.getContent()
            ));
        }

        // Add current user prompt
        messages.add(Map.of(
                "role", "user",
                "content", prompt
        ));

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", messages,
                "max_tokens", 2048
        );

        Map response = webClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + groqApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) return "No response from AI.";

        List choices = (List) response.get("choices");
        if (choices == null || choices.isEmpty()) return "Empty response from AI.";

        Map choice = (Map) choices.get(0);
        Map message = (Map) choice.get("message");
        return (String) message.get("content");
    }
}