package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.article.id = :articleId")
    List<Comment> findCommentsByArticleId(@Param("articleId") Long articleId);

    @Query(value = "SELECT * FROM comments WHERE article_id = :articleId", nativeQuery = true)
    List<Comment> findCommentsByArticleIdNative(@Param("articleId") Long articleId);
}
