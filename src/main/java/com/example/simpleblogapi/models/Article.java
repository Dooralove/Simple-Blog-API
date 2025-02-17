package com.example.simpleblogapi.models;


import java.time.LocalDate;
import java.util.List;

public class Article {
    private String title;
    private LocalDate date;
    private int likes;
    private int dislikes;
    private String content;
    private List<String> comments;
    private String tag;

    public Article(String title, LocalDate date, int likes, int dislikes, String content, List<String> comments, String tag) {
        this.title = title;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.content = content;
        this.comments = comments;
        this.tag = tag;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getLikes() {
        return likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public String getContent() {
        return content;
    }

    public List<String> getComments() {
        return comments;
    }

    public String getTag() {
        return tag;
    }
}
