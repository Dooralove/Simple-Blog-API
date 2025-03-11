package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.CommentEntity;
import com.example.simpleblogapi.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/by-article/{articleId}")
    public List<CommentEntity> getCommentsByArticle(@PathVariable Long articleId) {
        return commentService.getCommentsByArticle(articleId);
    }

    @DeleteMapping("/clear-cache/{articleId}")
    public void clearCache(@PathVariable Long articleId) {
        commentService.clearCache(articleId);
    }

    @DeleteMapping("/clear-cache-all")
    public void clearAllCache() {
        commentService.clearAllCache();
    }
}
