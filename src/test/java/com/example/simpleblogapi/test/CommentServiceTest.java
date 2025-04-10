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

public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        commentService.clearAllCache(); // Ensure cache is clear
    }

    @Test
    public void testGetCommentsByArticle_FromCache() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        // First call to populate cache
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        List<Comment> firstCallResult = commentService.getCommentsByArticle(articleId);
        assertEquals(2, firstCallResult.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        // Second call should return from cache
        List<Comment> secondCallResult = commentService.getCommentsByArticle(articleId);
        assertEquals(2, secondCallResult.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Still only called once
    }

    @Test
    public void testGetCommentsByArticle_FromRepository() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        List<Comment> result = commentService.getCommentsByArticle(articleId);
        assertEquals(2, result.size());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        // Check cache by calling again
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Still only called once
    }

    @Test
    public void testGetCommentsByArticle_EmptyList() {
        Long articleId = 1L;
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(Arrays.asList());
        List<Comment> result = commentService.getCommentsByArticle(articleId);
        assertTrue(result.isEmpty());
        // Check cache
        List<Comment> cached = commentService.getCommentsByArticle(articleId);
        assertTrue(cached.isEmpty());
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId); // Only called once
    }

    @Test
    public void testClearCache() {
        Long articleId = 1L;
        List<Comment> comments = Arrays.asList(new Comment());
        // Populate cache
        when(commentRepository.findCommentsByArticleId(articleId)).thenReturn(comments);
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId);
        // Clear cache
        commentService.clearCache(articleId);
        // Now, calling again should call repository
        commentService.getCommentsByArticle(articleId);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId);
    }

    @Test
    public void testClearAllCache() {
        Long articleId1 = 1L;
        Long articleId2 = 2L;
        List<Comment> comments1 = Arrays.asList(new Comment());
        List<Comment> comments2 = Arrays.asList(new Comment(), new Comment());
        when(commentRepository.findCommentsByArticleId(articleId1)).thenReturn(comments1);
        when(commentRepository.findCommentsByArticleId(articleId2)).thenReturn(comments2);
        // Populate cache
        commentService.getCommentsByArticle(articleId1);
        commentService.getCommentsByArticle(articleId2);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId1);
        verify(commentRepository, times(1)).findCommentsByArticleId(articleId2);
        // Clear all cache
        commentService.clearAllCache();
        // Now, calling again should call repository
        commentService.getCommentsByArticle(articleId1);
        commentService.getCommentsByArticle(articleId2);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId1);
        verify(commentRepository, times(2)).findCommentsByArticleId(articleId2);
    }

    @Test
    public void testCreateComment() {
        Comment comment = new Comment();
        when(commentRepository.save(comment)).thenReturn(comment);
        Comment result = commentService.createComment(comment);
        assertEquals(comment, result);
        verify(commentRepository, times(1)).save(comment);
    }
}