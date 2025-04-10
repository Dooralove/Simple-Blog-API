package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.Article;
import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;

    public ArticleService(ArticleRepository articleRepository, TagRepository tagRepository) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }



    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Article not found"));
    }

    public List<Article> bulkCreateArticles(List<Article> articles) {
        return articles.stream()
                .map(article -> {
                    article.setCreatedAt(LocalDateTime.now());
                    return createArticle(article);
                })
                .toList();
    }

    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Статья с id " + id + " не найдена");
        }
        articleRepository.deleteById(id);
    }


    public List<Article> getArticlesByTagName(String tagName) {
        return articleRepository.findArticlesByTagName(tagName);
    }

    public Article addTagToArticle(Long articleId, Long tagId) {
        Optional<Article> optionalArticle = articleRepository.findById(articleId);
        Optional<Tag> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            Article article = optionalArticle.get();
            Tag tag = optionalTag.get();
            article.getTags().add(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }

    public Article removeTagFromArticle(Long articleId, Long tagId) {
        Optional<Article> optionalArticle = articleRepository.findById(articleId);
        Optional<Tag> optionalTag = tagRepository.findById(tagId);

        if (optionalArticle.isPresent() && optionalTag.isPresent()) {
            Article article = optionalArticle.get();
            Tag tag = optionalTag.get();
            article.getTags().remove(tag);
            return articleRepository.save(article);
        } else {
            throw new ResourceNotFoundException("Article or Tag not found");
        }
    }

    public Article likeArticle(Long id) {
        Article article = getArticleById(id);
        article.setLikes(article.getLikes() + 1);
        return articleRepository.save(article);
    }

    public Article dislikeArticle(Long id) {
        Article article = getArticleById(id);
        article.setDislikes(article.getDislikes() + 1);
        return articleRepository.save(article);
    }

    public Article removeLike(Long id) {
        Article article = getArticleById(id);
        if (article.getLikes() > 0) {
            article.setLikes(article.getLikes() - 1);
        }
        return articleRepository.save(article);
    }

    public Article removeDislike(Long id) {
        Article article = getArticleById(id);
        if (article.getDislikes() > 0) {
            article.setDislikes(article.getDislikes() - 1);
        }
        return articleRepository.save(article);
    }
}

