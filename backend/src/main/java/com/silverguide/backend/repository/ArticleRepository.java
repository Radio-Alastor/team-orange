package com.silverguide.backend.repository;

import com.silverguide.backend.entity.Article;
import org.springframework.data.domain.Page;
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

    @Query("SELECT a FROM Article a WHERE a.topic.id = :topicId AND a.status = 'PUBLISHED'")
    Page<Article> findPublishedByTopic(@Param("topicId") Long topicId, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.subtitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND a.status = 'PUBLISHED'")
    Page<Article> searchPublishedArticles(@Param("keyword") String keyword, Pageable pageable);
}
