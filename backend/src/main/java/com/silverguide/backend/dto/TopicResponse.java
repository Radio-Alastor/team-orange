package com.silverguide.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopicResponse {
    private Long id;
    private String topicName;
    private String description;
}
