package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.Article;
import com.example.simpleblogapi.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @Operation(summary = "Создание статьи", description = "Создает новую статью с указанием текущей даты создания.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статья успешно создана"),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации данных", content = @Content)
    })
    @PostMapping("/create")
    public Article createArticle(@RequestBody Article article) {
        article.setCreatedAt(LocalDateTime.now());
        return articleService.createArticle(article);
    }

    @Operation(summary = "Получение статьи", description = "Возвращает статью по заданному идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статья найдена"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @GetMapping("/{id}")
    public Article getArticleById(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                                  @PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    @Operation(summary = "Получение всех статей", description = "Возвращает список всех статей.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статьи успешно получены")
    })
    @GetMapping("/all")
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @Operation(summary = "Получение статей по тегу", description = "Возвращает список статей, имеющих заданный тег.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статьи успешно получены"),
            @ApiResponse(responseCode = "404", description = "Статьи с указанным тегом не найдены", content = @Content)
    })
    @GetMapping("/by-tag")
    public List<Article> getArticlesByTagName(@Parameter(in = ParameterIn.QUERY, description = "Имя тега", required = true)
                                              @RequestParam String tagName) {
        return articleService.getArticlesByTagName(tagName);
    }

    @Operation(summary = "Удаление статьи", description = "Удаляет статью по заданному идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статья успешно удалена"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}")
    public void deleteArticle(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                              @PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @Operation(summary = "Добавление тега к статье", description = "Добавляет тег к указанной статье по их идентификаторам.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег успешно добавлен к статье"),
            @ApiResponse(responseCode = "404", description = "Статья или тег не найдены", content = @Content)
    })
    @PutMapping("/{articleId}/tags/{tagId}")
    public Article addTagToArticle(
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
            @PathVariable Long articleId,
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор тега", required = true)
            @PathVariable Long tagId) {
        return articleService.addTagToArticle(articleId, tagId);
    }

    @Operation(summary = "Удаление тега из статьи", description = "Удаляет тег из указанной статьи по их идентификаторам.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег успешно удален из статьи"),
            @ApiResponse(responseCode = "404", description = "Статья или тег не найдены", content = @Content)
    })
    @DeleteMapping("/{articleId}/tags/{tagId}")
    public Article removeTagFromArticle(
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
            @PathVariable Long articleId,
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор тега", required = true)
            @PathVariable Long tagId) {
        return articleService.removeTagFromArticle(articleId, tagId);
    }

    @Operation(summary = "Лайк статьи", description = "Добавляет лайк к статье по её идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Лайк успешно добавлен"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @PostMapping("/{id}/like")
    public Article likeArticle(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                               @PathVariable Long id) {
        return articleService.likeArticle(id);
    }

    @Operation(summary = "Дизлайк статьи", description = "Добавляет дизлайк к статье по её идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Дизлайк успешно добавлен"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @PostMapping("/{id}/dislike")
    public Article dislikeArticle(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                                  @PathVariable Long id) {
        return articleService.dislikeArticle(id);
    }

    @Operation(summary = "Удаление лайка", description = "Удаляет лайк у статьи по её идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Лайк успешно удален"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}/like")
    public Article removeLike(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                              @PathVariable Long id) {
        return articleService.removeLike(id);
    }

    @Operation(summary = "Удаление дизлайка", description = "Удаляет дизлайк у статьи по её идентификатору.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Дизлайк успешно удален"),
            @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}/dislike")
    public Article removeDislike(@Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
                                 @PathVariable Long id) {
        return articleService.removeDislike(id);
    }
}
