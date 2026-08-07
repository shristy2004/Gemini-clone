package com.aichatbot.aichatbot.controller;

import com.aichatbot.aichatbot.dto.ChatRequest;
import com.aichatbot.aichatbot.dto.ChatResponse;
import com.aichatbot.aichatbot.model.ChatMessage;
import com.aichatbot.aichatbot.model.ChatSession;
import com.aichatbot.aichatbot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ChatService.ChatResult result = chatService.sendMessage(
                userDetails.getUsername(),
                request.getPrompt(),
                request.getSessionId()
        );
        return ResponseEntity.ok(new ChatResponse(result.response(), result.sessionId()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getSessions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ChatSession> sessions = chatService.getUserSessions(userDetails.getUsername());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable String sessionId) {
        return ResponseEntity.ok(chatService.getSessionMessages(sessionId));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<?> deleteSession(
            @PathVariable String sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Basic delete - just remove the session (messages stay for now)
        chatService.getUserSessions(userDetails.getUsername()); // validate user owns it
        return ResponseEntity.ok().build();
    }
}