package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;

    public ArticleService(ArticleRepository articleRepository, TagRepository tagRepository) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
    }

    public List<ArticleEntity> getAllArticles() {
        return articleRepository.findAll();
    }

    public ArticleEntity getArticleById(Long id) {
        return articleRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Article not found"));
    }

    public ArticleEntity createArticle(ArticleEntity article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    public List<ArticleEntity> getArticlesByTagName(String tagName) {
        return articleRepository.findArticlesByTagName(tagName);
    }

    public ArticleEntity addTagToArticle(Long articleId, Long tagId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        Optional<TagEntity> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            ArticleEntity article = optionalArticle.get();
            TagEntity tag = optionalTag.get();
            article.getTags().add(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }

    public ArticleEntity removeTagFromArticle(Long articleId, Long tagId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        Optional<TagEntity> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            ArticleEntity article = optionalArticle.get();
            TagEntity tag = optionalTag.get();
            article.getTags().remove(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }

    // Методы для управления лайками и дизлайками

    public ArticleEntity likeArticle(Long id) {
        ArticleEntity article = getArticleById(id);
        article.setLikes(article.getLikes() + 1);
        return articleRepository.save(article);
    }

    public ArticleEntity dislikeArticle(Long id) {
        ArticleEntity article = getArticleById(id);
        article.setDislikes(article.getDislikes() + 1);
        return articleRepository.save(article);
    }

    public ArticleEntity removeLike(Long id) {
        ArticleEntity article = getArticleById(id);
        if (article.getLikes() > 0) {
            article.setLikes(article.getLikes() - 1);
        }
        return articleRepository.save(article);
    }

    public ArticleEntity removeDislike(Long id) {
        ArticleEntity article = getArticleById(id);
        if (article.getDislikes() > 0) {
            article.setDislikes(article.getDislikes() - 1);
        }
        return articleRepository.save(article);
    }
}
