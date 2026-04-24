package com.silverguide.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ArticleResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String content;
    private String imgUrl;
    private Long topicId;
    private String topicName;
    private String createdAt;  // ISO_LOCAL_DATE_TIME string
}
