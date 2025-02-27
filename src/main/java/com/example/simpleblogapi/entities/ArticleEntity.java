package com.example.simpleblogapi.entities;

import java.time.LocalDate;
import java.util.List;

public class ArticleEntity {
    private int id;
    private String title;
    private LocalDate date;
    private int likes;
    private int dislikes;
    private String content;
    private List<String> comments;
    private String tag;

    public ArticleEntity(int id, String title, LocalDate date, int likes, int dislikes,
                         String content, List<String> comments, String tag) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.content = content;
        this.comments = comments;
        this.tag = tag;
    }

    public int getId() {
        return id;
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
