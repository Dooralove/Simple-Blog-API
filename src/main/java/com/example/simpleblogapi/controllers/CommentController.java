package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.CommentEntity;
import com.example.simpleblogapi.repositories.CommentRepository;
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

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @PostMapping("/create")
    public CommentEntity createComment(@RequestBody CommentEntity comment) {
        return commentRepository.save(comment);
    }

    @GetMapping("/{id}")
    public CommentEntity getCommentById(@PathVariable Long id) {
        return commentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Comment not found"));
    }

    @GetMapping("/all")
    public List<CommentEntity> getAllComments() {
        return commentRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
    }
}
