package com.silverguide.backend.controller;

import com.silverguide.backend.dto.ArticleRequest;
import com.silverguide.backend.dto.ArticleResponse;
import com.silverguide.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleResponse>> listByTopic(@RequestParam Long topicId) {
        return ResponseEntity.ok(articleService.getRecentByTopic(topicId));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    @PostMapping
    public ResponseEntity<ArticleResponse> createArticle(
            @RequestBody ArticleRequest req,
            Authentication authentication) {
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        ArticleResponse response = articleService.createArticle(req, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticle(id));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> updateArticle(
            @PathVariable Long id, @RequestBody ArticleRequest req) {
        return ResponseEntity.ok(articleService.updateArticle(id, req));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
