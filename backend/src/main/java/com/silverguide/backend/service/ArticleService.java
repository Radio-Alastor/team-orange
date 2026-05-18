package com.silverguide.backend.service;

import com.silverguide.backend.dto.ArticleRequest;
import com.silverguide.backend.dto.ArticleResponse;
import com.silverguide.backend.entity.Article;
import com.silverguide.backend.entity.ArticleStatus;
import com.silverguide.backend.entity.Topic;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.repository.ArticleRepository;
import com.silverguide.backend.repository.TopicRepository;
import com.silverguide.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    @Transactional
    public ArticleResponse createArticle(ArticleRequest req, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Topic topic = topicRepository.findById(req.getTopicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        Article article = Article.builder()
                .title(req.getTitle())
                .subtitle(req.getSubtitle())
                .description(req.getSummary())
                .imgUrl(req.getImageUrl())
                .content(req.getContent())
                .user(user)
                .topic(topic)
                .build();

        article = articleRepository.save(article);
        
        return toResponse(article);
    }

    @Transactional(readOnly = true)
    public List<ArticleResponse> getRecentByTopic(Long topicId) {
        return articleRepository
                .findRecentByTopic(topicId, PageRequest.of(0, 4))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<ArticleResponse> getPaginatedByTopic(Long topicId, org.springframework.data.domain.Pageable pageable) {
        return articleRepository
                .findPublishedByTopic(topicId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<ArticleResponse> searchArticles(String keyword, org.springframework.data.domain.Pageable pageable) {
        return articleRepository
                .searchPublishedArticles(keyword, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public ArticleResponse updateArticle(Long id, ArticleRequest req) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
        Topic topic = topicRepository.findById(req.getTopicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        article.setTitle(req.getTitle());
        article.setSubtitle(req.getSubtitle());
        article.setDescription(req.getSummary());
        article.setImgUrl(req.getImageUrl());
        article.setContent(req.getContent());
        article.setTopic(topic);

        return toResponse(articleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
        article.setDeletedAt(LocalDateTime.now());
        articleRepository.save(article);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
        return toResponse(article);
    }

    private ArticleResponse toResponse(Article a) {
        return ArticleResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .subtitle(a.getSubtitle())
                .description(a.getDescription())
                .content(a.getContent())
                .imgUrl(a.getImgUrl())
                .topicId(a.getTopic() != null ? a.getTopic().getId() : null)
                .topicName(a.getTopic() != null ? a.getTopic().getTopicName() : null)
                .createdAt(a.getCreatedAt() != null
                        ? a.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null)
                .build();
    }
}
