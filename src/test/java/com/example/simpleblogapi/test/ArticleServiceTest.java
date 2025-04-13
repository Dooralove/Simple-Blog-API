package com.example.simpleblogapi.test;

import com.example.simpleblogapi.entities.Article;
import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import com.example.simpleblogapi.service.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private ArticleService articleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllArticles() {
        List<Article> articles = Arrays.asList(new Article(), new Article());
        when(articleRepository.findAll()).thenReturn(articles);
        List<Article> result = articleService.getAllArticles();
        assertEquals(2, result.size());
    }

    @Test
    void testGetArticleById_Success() {
        Article article = new Article();
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        assertEquals(article, articleService.getArticleById(1L));
    }

    @Test
    void testGetArticleById_NotFound() {
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> articleService.getArticleById(1L));
    }

    @Test
    void testBulkCreateArticles() {
        List<Article> articles = Arrays.asList(new Article(), new Article());
        when(articleRepository.save(any(Article.class))).thenAnswer(invocation -> invocation.getArgument(0));
        List<Article> result = articleService.bulkCreateArticles(articles);
        assertEquals(2, result.size());
        result.forEach(article -> assertNotNull(article.getCreatedAt()));
    }

    @Test
    void testCreateArticle() {
        Article article = new Article();
        when(articleRepository.save(article)).thenReturn(article);
        assertEquals(article, articleService.createArticle(article));
    }

    @Test
    void testDeleteArticle_Success() {
        when(articleRepository.existsById(1L)).thenReturn(true);
        articleService.deleteArticle(1L);
        verify(articleRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteArticle_NotFound() {
        when(articleRepository.existsById(1L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> articleService.deleteArticle(1L));
    }

    @Test
    void testGetArticlesByTagName() {
        List<Article> articles = Arrays.asList(new Article());
        when(articleRepository.findArticlesByTagName("tech")).thenReturn(articles);
        assertEquals(1, articleService.getArticlesByTagName("tech").size());
    }

    @Test
    void testAddTagToArticle_Success() {
        Article article = new Article();
        Tag tag = new Tag();
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(tagRepository.findById(1L)).thenReturn(Optional.of(tag));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.addTagToArticle(1L, 1L);
        assertTrue(result.getTags().contains(tag));
    }

    @Test
    void testAddTagToArticle_NotFound() {
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> articleService.addTagToArticle(1L, 1L));
    }

    @Test
    void testRemoveTagFromArticle_Success() {
        Article article = new Article();
        Tag tag = new Tag();
        article.getTags().add(tag);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(tagRepository.findById(1L)).thenReturn(Optional.of(tag));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.removeTagFromArticle(1L, 1L);
        assertFalse(result.getTags().contains(tag));
    }

    @Test
    void testRemoveTagFromArticle_NotFound() {
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> articleService.removeTagFromArticle(1L, 1L));
    }

    @Test
    void testLikeArticle() {
        Article article = new Article();
        article.setLikes(0);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.likeArticle(1L);
        assertEquals(1, result.getLikes());
    }

    @Test
    void testDislikeArticle() {
        Article article = new Article();
        article.setDislikes(0);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.dislikeArticle(1L);
        assertEquals(1, result.getDislikes());
    }

    @Test
    void testRemoveLike() {
        Article article = new Article();
        article.setLikes(1);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.removeLike(1L);
        assertEquals(0, result.getLikes());
    }

    @Test
    void testRemoveLike_ZeroLikes() {
        Article article = new Article();
        article.setLikes(0);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.removeLike(1L);
        assertEquals(0, result.getLikes());
    }

    @Test
    void testRemoveDislike() {
        Article article = new Article();
        article.setDislikes(1);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.removeDislike(1L);
        assertEquals(0, result.getDislikes());
    }

    @Test
    void testRemoveDislike_ZeroDislikes() {
        Article article = new Article();
        article.setDislikes(0);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(article)).thenReturn(article);
        Article result = articleService.removeDislike(1L);
        assertEquals(0, result.getDislikes());
    }
}