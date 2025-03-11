package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.CommentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Query("SELECT c FROM CommentEntity c WHERE c.article.id = :articleId")
    List<CommentEntity> findCommentsByArticleId(@Param("articleId") Long articleId);

    @Query(value = "SELECT * FROM comments WHERE article_id = :articleId", nativeQuery = true)
    List<CommentEntity> findCommentsByArticleIdNative(@Param("articleId") Long articleId);
}
