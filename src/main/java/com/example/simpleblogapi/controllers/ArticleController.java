package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.service.ArticleService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/{id}/like")
    public ArticleEntity likeArticle(@PathVariable Long id) {
        return articleService.likeArticle(id);
    }

    @PostMapping("/{id}/dislike")
    public ArticleEntity dislikeArticle(@PathVariable Long id) {
        return articleService.dislikeArticle(id);
    }

    @DeleteMapping("/{id}/like")
    public ArticleEntity removeLike(@PathVariable Long id) {
        return articleService.removeLike(id);
    }

    @DeleteMapping("/{id}/dislike")
    public ArticleEntity removeDislike(@PathVariable Long id) {
        return articleService.removeDislike(id);
    }
}
