package com.silverguide.backend.service;

import com.silverguide.backend.dto.engagement.CommentDTO;
import com.silverguide.backend.dto.engagement.LikeStatusDTO;
import com.silverguide.backend.entity.Article;
import com.silverguide.backend.entity.EngagementComment;
import com.silverguide.backend.entity.EngagementLike;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.repository.ArticleRepository;
import com.silverguide.backend.repository.EngagementCommentRepository;
import com.silverguide.backend.repository.EngagementLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final EngagementLikeRepository likeRepository;
    private final EngagementCommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public LikeStatusDTO getArticleLikeStatus(Long articleId, User currentUser) {
        Article article = getActiveArticle(articleId);
        long totalLikes = likeRepository.countByArticleId(article.getId());
        boolean hasLiked = false;
        
        if (currentUser != null) {
            hasLiked = likeRepository.existsByUserIdAndArticleId(currentUser.getId(), article.getId());
        }
        return new LikeStatusDTO(totalLikes, hasLiked);
    }

    @Transactional
    public LikeStatusDTO toggleLike(Long articleId, User user) {
        Article article = getActiveArticle(articleId);
        
        boolean hasLiked = likeRepository.existsByUserIdAndArticleId(user.getId(), article.getId());
        if (hasLiked) {
            likeRepository.findByUserIdAndArticleId(user.getId(), article.getId())
                    .ifPresent(likeRepository::delete);
            hasLiked = false;
        } else {
            EngagementLike like = EngagementLike.builder()
                    .user(user)
                    .article(article)
                    .build();
            likeRepository.save(like);
            hasLiked = true;
        }
        
        long totalLikes = likeRepository.countByArticleId(article.getId());
        return new LikeStatusDTO(totalLikes, hasLiked);
    }

    @Transactional(readOnly = true)
    public Page<CommentDTO> getArticleComments(Long articleId, int page, int size) {
        Article article = getActiveArticle(articleId);
        Page<EngagementComment> comments = commentRepository.findByArticleIdOrderByCreatedAtDesc(article.getId(), PageRequest.of(page, size));
        
        return comments.map(c -> new CommentDTO(
                c.getId(),
                c.getComment(),
                c.getUser().getName(),
                c.getUser().getId(),
                c.getCreatedAt()
        ));
    }

    @Transactional
    public CommentDTO addComment(Long articleId, User user, String text) {
        Article article = getActiveArticle(articleId);
        
        EngagementComment comment = EngagementComment.builder()
                .article(article)
                .user(user)
                .comment(text)
                .build();
                
        comment = commentRepository.save(comment);
        
        return new CommentDTO(
                comment.getId(),
                comment.getComment(),
                user.getName(),
                user.getId(),
                comment.getCreatedAt()
        );
    }

    @Transactional
    public void deleteComment(String commentId, User user) {
        EngagementComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
                
        if (!comment.getUser().getId().equals(user.getId()) && !user.isStaff()) {
            throw new IllegalArgumentException("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
    }

    private Article getActiveArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));
        if (article.getDeletedAt() != null) {
            throw new IllegalArgumentException("Article not found or deleted");
        }
        return article;
    }
}
