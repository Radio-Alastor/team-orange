package com.silverguide.backend.dto;

import lombok.Data;

@Data
public class ArticleRequest {
    private String title;
    private Long topicId;
    private String subtitle;
    private String summary;   // maps to Article.description
    private String imageUrl;  // maps to Article.imgUrl
    private String content;   // EditorJS JSON string
    private String status;    // Allows passing DRAFT or PUBLISHED
}
