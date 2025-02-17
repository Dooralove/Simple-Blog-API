package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.models.Article;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Random;

@RestController
public class ArticleController {

    private static final Random random = new Random();

    @GetMapping("/articles")
    public Article getArticle(@RequestParam(name = "Name", defaultValue = "TEST_NAME") String name) {
        int randomLikes = random.nextInt(500);
        return new Article(name, LocalDate.now(), randomLikes);
    }
}



