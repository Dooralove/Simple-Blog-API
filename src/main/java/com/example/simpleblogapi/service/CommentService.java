package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.Comment;
import com.example.simpleblogapi.repositories.CommentRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final Map<Long, List<Comment>> commentCache = new HashMap<>();

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Cacheable(value = "commentsByArticle", key = "#articleId")
    public List<Comment> getCommentsByArticle(Long articleId) {
        return commentRepository.findCommentsByArticleId(articleId);
    }

    public void clearCache(Long articleId) {
        commentCache.remove(articleId);
    }

    public void clearAllCache() {
        commentCache.clear();
    }

    @CacheEvict(value = "commentsByArticle", key = "#comment.article.id")
    public Comment createComment(Comment commentEntity) {
        return commentRepository.save(commentEntity);
    }
}
