package com.silverguide.backend.repository;

import com.silverguide.backend.entity.EngagementComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EngagementCommentRepository extends JpaRepository<EngagementComment, String> {
    List<EngagementComment> findByArticleId(Long articleId);
    List<EngagementComment> findByUserId(String userId);
}
