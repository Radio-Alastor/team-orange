package com.silverguide.backend.controller;

import com.silverguide.backend.dto.engagement.CommentDTO;
import com.silverguide.backend.dto.engagement.CommentRequestDTO;
import com.silverguide.backend.dto.engagement.LikeStatusDTO;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.service.EngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class EngagementController {

    private final EngagementService engagementService;

    @GetMapping("/{id}/engagements/like-status")
    public ResponseEntity<LikeStatusDTO> getLikeStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        try {
            LikeStatusDTO status = engagementService.getArticleLikeStatus(id, currentUser);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{id}/engagements/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LikeStatusDTO> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        try {
            LikeStatusDTO status = engagementService.toggleLike(id, currentUser);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}/engagements/comments")
    public ResponseEntity<Page<CommentDTO>> getComments(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<CommentDTO> comments = engagementService.getArticleComments(id, page, size);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{id}/engagements/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO request,
            @AuthenticationPrincipal User currentUser) {
        try {
            CommentDTO comment = engagementService.addComment(id, currentUser, request.getText());
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/engagements/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal User currentUser) {
        try {
            engagementService.deleteComment(commentId, currentUser);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
