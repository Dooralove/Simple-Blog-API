package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.CommentEntity;
import com.example.simpleblogapi.repositories.CommentRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;


@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final Map<Long, List<CommentEntity>> commentCache = new HashMap<>();

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<CommentEntity> getCommentsByArticle(Long articleId) {
        if (commentCache.containsKey(articleId)) {
            return commentCache.get(articleId);
        }

        // Иначе загружаем из БД и сохраняем в кэш
        List<CommentEntity> comments = commentRepository.findCommentsByArticleId(articleId);
        commentCache.put(articleId, comments);
        return comments;
    }

    public void clearCache(Long articleId) {
        commentCache.remove(articleId);
    }


    public void clearAllCache() {
        commentCache.clear();
    }
}
