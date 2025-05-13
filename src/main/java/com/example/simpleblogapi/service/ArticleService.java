package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.Article;
import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.exceptions.ResourceNotFoundException;
import com.example.simpleblogapi.repositories.ArticleRepository;
import com.example.simpleblogapi.repositories.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;

    public ArticleService(ArticleRepository articleRepository, TagRepository tagRepository, TagService tagService) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.tagService = tagService; // Используем TagService для управления тегами
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Article not found with id: " + id));
    }

    @Transactional
    public List<Article> bulkCreateArticles(List<Article> articles) {
        List<Article> savedArticles = new ArrayList<>();
        for (Article article : articles) {
            savedArticles.add(createArticle(article));
        }
        return savedArticles;
    }

    @Transactional
    public Article createArticle(Article article) {
        if (article.getCreatedAt() == null) {
            article.setCreatedAt(LocalDateTime.now());
        }

        if (article.getTags() != null && !article.getTags().isEmpty()) {
            List<Tag> managedTags = new ArrayList<>();
            for (Tag submittedTag : article.getTags()) {
                if (submittedTag.getId() == null && submittedTag.getName() != null) {
                    managedTags.add(tagService.getOrCreateTag(submittedTag.getName()));
                } else if (submittedTag.getId() != null) {
                    Tag existingTag = tagRepository.findById(submittedTag.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Tag with id " + submittedTag.getId() + " not found during article creation."));
                    managedTags.add(existingTag);
                }
            }
            article.setTags(managedTags);
        } else {
            article.setTags(new ArrayList<>());
        }
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

    @Transactional
    public Article addTagToArticle(Long articleId, Long tagId) {
        Article article = getArticleById(articleId);
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + tagId));

        if (article.getTags() == null) {
            article.setTags(new ArrayList<>());
        }
        if (!article.getTags().stream().anyMatch(t -> t.getId().equals(tag.getId()))) {
            article.getTags().add(tag);
        }
        return articleRepository.save(article);
    }

    @Transactional
    public Article removeTagFromArticle(Long articleId, Long tagId) {
        Article article = getArticleById(articleId);
        article.getTags().removeIf(tag -> tag.getId().equals(tagId));
        return articleRepository.save(article);
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

    public List<Tag> getTagsByArticleId(Long articleId) {
        Article article = getArticleById(articleId);
        return new ArrayList<>(article.getTags());
    }


    @Transactional
    public Article updateArticle(Long id, Article updatedArticleData) {
        Article existingArticle = getArticleById(id);
        existingArticle.setTitle(updatedArticleData.getTitle());
        existingArticle.setContent(updatedArticleData.getContent());

        List<Tag> managedTagsForArticle = new ArrayList<>();
        if (updatedArticleData.getTags() != null && !updatedArticleData.getTags().isEmpty()) {
            for (Tag submittedTag : updatedArticleData.getTags()) {
                if (submittedTag.getId() != null) {
                    Tag managedTag = tagRepository.findById(submittedTag.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Tag with id " + submittedTag.getId() +
                                    " not found. Cannot update article with non-existent tag."));
                    managedTagsForArticle.add(managedTag);
                }
            }
        }

        existingArticle.getTags().clear();
        if (!managedTagsForArticle.isEmpty()) {
            existingArticle.getTags().addAll(managedTagsForArticle);
        }

        return articleRepository.save(existingArticle);
    }
}