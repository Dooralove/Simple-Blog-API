package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.name = :tagName")
    List<Article> findArticlesByTagName(@Param("tagName") String tagName);
}
