package com.silverguide.backend.repository;

import com.silverguide.backend.entity.Article;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByUserId(String userId);
    List<Article> findByTopicId(Long topicId);

    @Query("SELECT a FROM Article a WHERE a.topic.id = :topicId AND a.status = 'PUBLISHED' ORDER BY a.createdAt DESC")
    List<Article> findRecentByTopic(@Param("topicId") Long topicId, Pageable pageable);
}
