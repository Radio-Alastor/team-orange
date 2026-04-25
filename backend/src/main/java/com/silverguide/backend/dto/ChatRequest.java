package com.silverguide.backend.dto;

import java.util.List;

public record ChatRequest(
    String article_title,
    String article_content,
    List<ChatMessage> messages
) {}
