package com.silverguide.backend.repository;

import com.silverguide.backend.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByPublishedTrue();
    List<Article> findByAuthorId(String authorId);
    List<Article> findByTopicId(Long topicId);
}
