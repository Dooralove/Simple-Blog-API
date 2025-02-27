package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.ArticleEntity;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class ArticleService {

    private static final SecureRandom random = new SecureRandom();

    public ArticleEntity getArticleById(int id) {
        int ranLike = random.nextInt(500);
        int ranDislike = random.nextInt(100);
        String ranContent = "This is an article content for article with ID " + id;
        List<String> ranComment = Arrays.asList("Great!", "Very helpful, thanks!", "Not bad.");
        String tag = "General";

        return new ArticleEntity(id, "TechArticle", LocalDate.now(), ranLike, ranDislike, ranContent, ranComment, tag);
    }

    public ArticleEntity getArticleByNameAndTag(String name, String tag) {
        int ranLike = random.nextInt(500);
        int ranDislike = random.nextInt(100);
        String ranContent = "This is an article content for article with name " + name;
        List<String> ranComment = Arrays.asList("Great!", "Very helpful, thanks!", "Not bad.");
        int id = random.nextInt(1000);

        return new ArticleEntity(id, name, LocalDate.now(), ranLike, ranDislike, ranContent, ranComment, tag);
    }
}
