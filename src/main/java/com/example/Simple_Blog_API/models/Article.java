package com.example.Simple_Blog_API.models;

import java.time.LocalDate;

public class Article {
    private String title;
    private LocalDate date;
    private int likes;

    public Article(String title, LocalDate date, int likes) {
        this.title = title;
        this.date = date;
        this.likes = likes;
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
}
