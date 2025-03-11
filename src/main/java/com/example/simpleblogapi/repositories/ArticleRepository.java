package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.ArticleEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {

    @Query("SELECT a FROM ArticleEntity a JOIN a.tags t WHERE t.name = :tagName")
    List<ArticleEntity> findArticlesByTagName(@Param("tagName") String tagName);
}
