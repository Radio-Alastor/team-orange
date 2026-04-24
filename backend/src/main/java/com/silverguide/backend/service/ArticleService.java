package com.silverguide.backend.service;

import com.silverguide.backend.dto.ArticleRequest;
import com.silverguide.backend.dto.ArticleResponse;
import com.silverguide.backend.entity.Article;
import com.silverguide.backend.entity.Topic;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.repository.ArticleRepository;
import com.silverguide.backend.repository.TopicRepository;
import com.silverguide.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;

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
