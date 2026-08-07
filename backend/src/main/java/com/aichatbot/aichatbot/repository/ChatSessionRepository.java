package com.aichatbot.aichatbot.repository;

import com.aichatbot.aichatbot.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(String userId);
}
