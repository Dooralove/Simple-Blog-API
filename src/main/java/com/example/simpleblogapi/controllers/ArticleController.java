package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.models.Article;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArticleController {

    private static final SecureRandom random = new SecureRandom();

    @GetMapping("/articles/{tag}")
    public Article getArticleByTag(
            @PathVariable String tag,
            @RequestParam(name = "Name", defaultValue = "TEST_NAME") String name
    ) {
        int ranLike = random.nextInt(500);
        int ranDislike = random.nextInt(100);
        String ranContent = "This is an article content for article with tag " + tag;
        List<String> ranComment = Arrays.asList("Great!", "Very helpful, thanks!", "Not bad.");

        return new Article(name, LocalDate.now(), ranLike, ranDislike, ranContent, ranComment, tag);
    }
}
