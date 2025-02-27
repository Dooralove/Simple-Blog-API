package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.CommentEntity;
import com.example.simpleblogapi.repositories.CommentRepository;
import java.util.List;
import org.springframework.stereotype.Service;


@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<CommentEntity> getAllComments() {
        return commentRepository.findAll();
    }

    public CommentEntity getCommentById(Long id) {
        return commentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Comment not found"));
    }

    public CommentEntity createComment(CommentEntity comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
