package com.silverguide.backend.repository;

import com.silverguide.backend.entity.EngagementLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EngagementLikeRepository extends JpaRepository<EngagementLike, Long> {
    List<EngagementLike> findByArticleId(Long articleId);
    Optional<EngagementLike> findByUserIdAndArticleId(String userId, Long articleId);
    boolean existsByUserIdAndArticleId(String userId, Long articleId);
}
