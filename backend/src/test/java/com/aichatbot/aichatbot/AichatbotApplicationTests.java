package com.aichatbot.aichatbot;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"GEMINI_API_KEY=test-key",
		"MONGODB_URI=mongodb://localhost:27017/chatbot_test"
})
class AichatbotApplicationTests {

	@Test
	void contextLoads() {
	}

}
