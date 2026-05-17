package com.silverguide.backend.dto.admin;

import com.silverguide.backend.entity.ArticleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminArticleDTO {
    private Long id;
    private String title;
    private String authorName;
    private LocalDateTime dateCreated;
    private ArticleStatus status;
}
