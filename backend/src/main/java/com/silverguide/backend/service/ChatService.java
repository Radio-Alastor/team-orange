package com.silverguide.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.silverguide.backend.dto.ChatRequest;
import com.silverguide.backend.dto.ChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Slf4j // Lombok annotation to automatically create a logger field 'log'
@Service
public class ChatService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public ChatService(
            @Value("${app.chat.api-url}") String chatApiUrl,
            ObjectMapper objectMapper) {
        this.restClient = RestClient.builder()
                .baseUrl(chatApiUrl)
                // Use SimpleClientHttpRequestFactory to force HTTP/1.1 and avoid HTTP/2 upgrade issues with FastAPI/Uvicorn
                .requestFactory(new SimpleClientHttpRequestFactory())
                .build();
        this.objectMapper = objectMapper;
    }

    public ChatResponse chat(ChatRequest request) {
        try {
            String json = objectMapper.writeValueAsString(request);
            log.debug("Sending to FastAPI: {}", json);
            return restClient.post()
                    .uri("/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(json)
                    .retrieve()
                    .body(ChatResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to call chat service: " + e.getMessage(), e);
        }
    }
}
