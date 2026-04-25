package com.silverguide.backend.service;

import com.silverguide.backend.dto.ChatRequest;
import com.silverguide.backend.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ChatService {

    private final RestClient restClient;

    public ChatService(@Value("${app.chat.api-url}") String chatApiUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(chatApiUrl)
                .build();
    }

    public ChatResponse chat(ChatRequest request) {
        return restClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChatResponse.class);
    }
}
