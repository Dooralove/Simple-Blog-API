package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.ArticleEntity;
import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;
    private final Map<String, List<ArticleEntity>> articleCache;

    public ArticleService(ArticleRepository articleRepository,
                          TagRepository tagRepository,
                          Map<String, List<ArticleEntity>> articleCache) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.articleCache = articleCache;
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
        if (articleCache.containsKey(tagName)) {
            return articleCache.get(tagName);
        }

        List<ArticleEntity> articles = articleRepository.findArticlesByTagName(tagName);
        articleCache.put(tagName, articles);
        return articles;
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
}
