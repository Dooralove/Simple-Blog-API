package com.example.Simple_Blog_API.controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArticleController {

    @GetMapping("/articles")
    public String getArticle(@RequestParam(name = "Name", defaultValue = "Sasha") String name) {
        return "{ \"Hello\": \"" + name + "\" }";
    }
}
