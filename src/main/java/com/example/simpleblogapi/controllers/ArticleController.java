package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.CommentRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
                new ResourceNotFoundException("Article not found"));
    }

    @GetMapping("/all")
    public List<ArticleEntity> getAllArticles() {
        return articleRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
    }

    @PutMapping("/{articleId}/tags/{tagId}")
    public ArticleEntity addTagToArticle(@PathVariable Long articleId, @PathVariable Long tagId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        Optional<TagEntity> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            ArticleEntity article = optionalArticle.get();
            TagEntity tag = optionalTag.get();
            article.getTags().add(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }

    @DeleteMapping("/{articleId}/tags/{tagId}")
    public ArticleEntity removeTagFromArticle(@PathVariable Long articleId,
                                              @PathVariable Long tagId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        Optional<TagEntity> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            ArticleEntity article = optionalArticle.get();
            TagEntity tag = optionalTag.get();
            article.getTags().remove(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }
}