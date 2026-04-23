package com.silverguide.backend.repository;

import com.silverguide.backend.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByUserId(String userId);
    List<Article> findByTopicId(Long topicId);
}
