package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.Comment;
import com.example.simpleblogapi.service.CommentService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/by-article/{articleId}")
    public List<Comment> getCommentsByArticle(@PathVariable Long articleId) {
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

    @PostMapping("/create")
    public Comment createComment(@RequestBody Comment commentEntity) {
        return commentService.createComment(commentEntity);
    }
}
