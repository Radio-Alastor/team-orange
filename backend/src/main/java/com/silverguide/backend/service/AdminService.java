package com.silverguide.backend.service;

import com.silverguide.backend.dto.admin.AdminArticleDTO;
import com.silverguide.backend.dto.admin.AdminMetricsDTO;
import com.silverguide.backend.dto.admin.UserAdminDTO;
import com.silverguide.backend.entity.Article;
import com.silverguide.backend.entity.ArticleStatus;
import com.silverguide.backend.repository.ArticleRepository;
import com.silverguide.backend.repository.EngagementCommentRepository;
import com.silverguide.backend.repository.EngagementLikeRepository;
import com.silverguide.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final EngagementCommentRepository commentRepository;
    private final EngagementLikeRepository likeRepository;
    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public AdminMetricsDTO getMetrics() {
        long totalUsers = userRepository.count();
        long totalComments = commentRepository.count();
        long totalLikes = likeRepository.count();

        return AdminMetricsDTO.builder()
                .totalUsers(totalUsers)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<UserAdminDTO> getAllUsersWithEngagement() {
        return userRepository.findAllUsersWithEngagementCounts();
    }

    @Transactional(readOnly = true)
    public Page<AdminArticleDTO> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable).map(a -> 
            AdminArticleDTO.builder()
                .id(a.getId())
                .title(a.getTitle())
                .authorName(a.getUser() != null ? a.getUser().getName() : "Unknown")
                .dateCreated(a.getCreatedAt())
                .status(a.getStatus())
                .build()
        );
    }

    @Transactional
    public void updateArticleStatus(Long id, ArticleStatus status) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setStatus(status);
        articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setStatus(ArticleStatus.DELETED);
        article.setDeletedAt(LocalDateTime.now());
        articleRepository.save(article);
    }
}
