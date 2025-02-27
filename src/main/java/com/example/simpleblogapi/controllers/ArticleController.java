package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.CommentRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;

    public ArticleController(ArticleRepository articleRepository,
                             CommentRepository commentRepository, TagRepository tagRepository) {
        this.articleRepository = articleRepository;
        this.commentRepository = commentRepository;
        this.tagRepository = tagRepository;
    }

    @PostMapping("/create")
    public ArticleEntity createArticle(@RequestBody ArticleEntity article) {
        return articleRepository.save(article);
    }

    @GetMapping("/{id}")
    public ArticleEntity getArticleById(@PathVariable Long id) {
        return articleRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Article not found"));
    }

    @GetMapping("/all")
    public List<ArticleEntity> getAllArticles() {
        return articleRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
    }
}
