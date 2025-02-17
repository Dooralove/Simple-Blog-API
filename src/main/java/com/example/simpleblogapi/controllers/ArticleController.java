package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.models.Article;
import java.time.LocalDate;
import java.security.SecureRandom;
import java.util.Random;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class ArticleController {

    private static final SecureRandom random = new SecureRandom();

    @GetMapping("/articles")
    public Article getArticle(@RequestParam(name = "Name", defaultValue = "TEST_NAM") String name) {
        int randomLikes = random.nextInt(500);
        return new Article(name, LocalDate.now(), randomLikes);
    }
}



