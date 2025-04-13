package com.example.simpleblogapi.test;

import com.example.simpleblogapi.entities.Comment;
import com.example.simpleblogapi.repositories.CommentRepository;
import com.example.simpleblogapi.service.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        commentService.clearAllCache();
    }

    @Test
    void testGetCommentsByArticle_FromCache() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        List<Comment> firstCallResult = commentService.getCommentsByArticle(articleId);
        assertEquals(2, firstCallResult.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        List<Comment> secondCallResult = commentService.getCommentsByArticle(articleId);
        assertEquals(2, secondCallResult.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Still only called once
    }

    @Test
    void testGetCommentsByArticle_FromRepository() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        List<Comment> result = commentService.getCommentsByArticle(articleId);
        assertEquals(2, result.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Still only called once
    }

    @Test
    void testGetCommentsByArticle_EmptyList() {
        Long articleId = 1L;
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(Arrays.asList());
        List<Comment> result = commentService.getCommentsByArticle(articleId);
        assertTrue(result.isEmpty());
        List<Comment> cached = commentService.getCommentsByArticle(articleId);
        assertTrue(cached.isEmpty());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Only called once
    }

    @Test
    void testClearCache() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment());
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        commentService.clearCache(articleId);
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId);
    }

    @Test
    void testClearAllCache() {
        Long articleId1 = 1L;
        Long articleId2 = 2L;
        List<Comment> comments1 = Arrays.asList(new Comment());
        List<Comment> comments2 = Arrays.asList(new Comment(), new Comment());
        when(commentRepository.findCommentsByArticleId(articleId1)).thenReturn(comments1);
        when(commentRepository.findCommentsByArticleId(articleId2)).thenReturn(comments2);
        commentService.getCommentsByArticle(articleId1);
        commentService.getCommentsByArticle(articleId2);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId1);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId2);
        commentService.clearAllCache();
        commentService.getCommentsByArticle(articleId1);
        commentService.getCommentsByArticle(articleId2);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId1);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId2);
    }

    @Test
    void testCreateComment() {
        Comment comment = new Comment();
        when(commentRepository.save(comment)).thenReturn(comment);
        Comment result = commentService.createComment(comment);
        assertEquals(comment, result);
        verify(commentRepository, times(1)).save(comment);
    }
}