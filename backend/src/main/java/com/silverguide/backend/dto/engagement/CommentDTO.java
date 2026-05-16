package com.silverguide.backend.dto.engagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String id;
    private String text;
    private String authorName;
    private String authorId;
    private LocalDateTime createdAt;
}
