package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.Comment;
import com.example.simpleblogapi.repositories.CommentRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final Map<Long, List<Comment>> commentCache = new HashMap<>();

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> getCommentsByArticle(Long articleId) {
        if (commentCache.containsKey(articleId)) {
            return commentCache.get(articleId);
        }

        List<Comment> comments = commentRepository.findCommentsByArticleId(articleId);
        commentCache.put(articleId, comments);
        return comments;
    }

    public void clearCache(Long articleId) {
        commentCache.remove(articleId);
    }

    public void clearAllCache() {
        commentCache.clear();
    }

    public Comment createComment(Comment commentEntity) {
        return commentRepository.save(commentEntity);
    }
}
