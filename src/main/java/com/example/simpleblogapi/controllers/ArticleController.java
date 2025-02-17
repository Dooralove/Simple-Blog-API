package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.models.Article;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArticleController {

    private static final SecureRandom random = new SecureRandom();

    @GetMapping("/articles")
    public Article getArticle(@RequestParam(name = "Name", defaultValue = "TEST_NAM") String name) {
        int randLikes = random.nextInt(500);
        int randomDislikes = random.nextInt(100);
        String randomCont = "This is article))))))))))))))))))))))))))))))))))lol.";
        List<String> randCom = Arrays.asList("Great!",  "Not bad.", "Could be better.");

        return new Article(name, LocalDate.now(), randLikes, randomDislikes, randomCont, randCom);
    }
}
