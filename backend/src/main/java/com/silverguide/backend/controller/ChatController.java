package com.silverguide.backend.controller;

import com.silverguide.backend.dto.ChatRequest;
import com.silverguide.backend.dto.ChatResponse;
import com.silverguide.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j // Lombok annotation to automatically create a logger field 'log'
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            return ResponseEntity.ok(chatService.chat(request));
        } catch (Exception e) {
            log.error("Chat service error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ChatResponse("The tutor service is temporarily unavailable. Please try again."));
        }
    }
}
