package com.silverguide.backend.dto.engagement;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequestDTO {
    @NotBlank(message = "Comment cannot be empty")
    private String text;
}
