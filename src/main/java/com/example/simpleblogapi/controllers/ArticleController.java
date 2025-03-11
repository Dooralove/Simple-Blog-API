package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.service.ArticleService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping("/create")
    public ArticleEntity createArticle(@RequestBody ArticleEntity article) {
        article.setCreatedAt(LocalDateTime.now());
        return articleService.createArticle(article);
    }

    @GetMapping("/{id}")
    public ArticleEntity getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    @GetMapping("/all")
    public List<ArticleEntity> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/by-tag")
    public List<ArticleEntity> getArticlesByTagName(@RequestParam String tagName) {
        return articleService.getArticlesByTagName(tagName);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @PutMapping("/{articleId}/tags/{tagId}")
    public ArticleEntity addTagToArticle(@PathVariable Long articleId, @PathVariable Long tagId) {
        return articleService.addTagToArticle(articleId, tagId);
    }

    @DeleteMapping("/{articleId}/tags/{tagId}")
    public ArticleEntity removeTagFromArticle(@PathVariable Long articleId,
                                              @PathVariable Long tagId) {
        return articleService.removeTagFromArticle(articleId, tagId);
    }
}
