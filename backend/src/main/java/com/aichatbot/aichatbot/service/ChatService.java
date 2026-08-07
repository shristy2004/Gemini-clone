package com.aichatbot.aichatbot.service;

import com.aichatbot.aichatbot.model.ChatMessage;
import com.aichatbot.aichatbot.model.ChatSession;
import com.aichatbot.aichatbot.model.User;
import com.aichatbot.aichatbot.repository.ChatRepository;
import com.aichatbot.aichatbot.repository.ChatSessionRepository;
import com.aichatbot.aichatbot.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public ChatService(ChatRepository chatRepository,
                       ChatSessionRepository sessionRepository,
                       UserRepository userRepository,
                       GeminiService geminiService) {
        this.chatRepository = chatRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    public List<ChatSession> getUserSessions(String email) {
        User user = getUser(email);
        return sessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
    }

    public List<ChatMessage> getSessionMessages(String sessionId) {
        return chatRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    public record ChatResult(String sessionId, String response) {}

    public ChatResult sendMessage(String email, String prompt, String sessionId) {
        User user = getUser(email);

        // Create or retrieve session
        ChatSession session;
        if (sessionId == null || sessionId.isBlank()) {
            // New session: use first 50 chars of prompt as title
            String title = prompt.length() > 50 ? prompt.substring(0, 50) + "..." : prompt;
            session = new ChatSession(user.getId(), title);
            session = sessionRepository.save(session);
        } else {
            session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
        }

        // Fetch existing history for context
        List<ChatMessage> history = chatRepository.findBySessionIdOrderByCreatedAtAsc(session.getId());

        // Get AI response with context
        String aiResponse = geminiService.chat(prompt, history);

        // Save user message
        ChatMessage userMsg = new ChatMessage(session.getId(), user.getId(), "user", prompt);
        chatRepository.save(userMsg);

        // Save assistant message
        ChatMessage assistantMsg = new ChatMessage(session.getId(), user.getId(), "assistant", aiResponse);
        chatRepository.save(assistantMsg);

        // Update session timestamp
        session.setUpdatedAt(Instant.now());
        sessionRepository.save(session);

        return new ChatResult(session.getId(), aiResponse);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
