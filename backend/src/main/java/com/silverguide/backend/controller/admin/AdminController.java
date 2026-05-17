package com.silverguide.backend.controller.admin;

import com.silverguide.backend.dto.admin.AdminArticleDTO;
import com.silverguide.backend.dto.admin.AdminMetricsDTO;
import com.silverguide.backend.dto.admin.UserAdminDTO;
import com.silverguide.backend.entity.ArticleStatus;
import com.silverguide.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    public ResponseEntity<AdminMetricsDTO> getMetrics() {
        return ResponseEntity.ok(adminService.getMetrics());
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    public ResponseEntity<List<UserAdminDTO>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsersWithEngagement());
    }

    @GetMapping("/articles")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    public ResponseEntity<Page<AdminArticleDTO>> getArticles(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllArticles(pageable));
    }

    @PatchMapping("/articles/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    public ResponseEntity<Void> updateArticleStatus(@PathVariable Long id, @RequestParam ArticleStatus status) {
        adminService.updateArticleStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/articles/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERUSER')")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        adminService.deleteArticle(id);
        return ResponseEntity.ok().build();
    }
}
