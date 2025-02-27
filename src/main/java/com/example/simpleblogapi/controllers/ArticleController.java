package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArticleController {

    private final ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/articles/{id}")
    public ArticleEntity getArticleById(
            @PathVariable int id
    ) {
        return articleService.getArticleById(id);
    }

    @GetMapping("/articles")
    public ArticleEntity getArticleByName(
            @RequestParam(name = "Name", required = false, defaultValue = "DefaultArticle") String name,
            @RequestParam(name = "Tag", required = false, defaultValue = "General") String tag
    ) {
        return articleService.getArticleByNameAndTag(name, tag);
    }
}
