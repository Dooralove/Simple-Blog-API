package com.example.Simple_Blog_API.controllers;

import com.example.Simple_Blog_API.models.Article;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Random;

@RestController
public class ArticleController {

    @GetMapping("/articles")
    public Article getArticle(@RequestParam(name = "Name", defaultValue = "TEST_NAME") String name) {
        Random random = new Random();
        int randomLikes = random.nextInt(500);

        return new Article(name , LocalDate.now(), randomLikes);
    }
}
