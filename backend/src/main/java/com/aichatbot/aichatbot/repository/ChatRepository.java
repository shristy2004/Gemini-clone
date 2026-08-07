package com.aichatbot.aichatbot.repository;

import com.aichatbot.aichatbot.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    List<ChatMessage> findTop20BySessionIdOrderByCreatedAtAsc(String sessionId);
}