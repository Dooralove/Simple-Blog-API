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

    @Operation(
            summary = "Создание новой статьи",
            description = "Создает новую статью и автоматически"
                    + " устанавливает текущую дату создания. "
                    + "Используйте этот эндпоинт для добавления нового контента в блог."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Статья успешно создана"),
        @ApiResponse(responseCode = "400", description =
                "Ошибка валидации данных", content = @Content)
    })
    @PostMapping("/create")
    public Article createArticle(@RequestBody Article article) {
        article.setCreatedAt(LocalDateTime.now());
        return articleService.createArticle(article);
    }

    @Operation(
            summary = "Получение статьи по ID",
            description = "Возвращает статью, найденную по уникальному идентификатору. "
                    + "Используйте этот эндпоинт для получения детальной информации о статье."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Статья успешно найдена"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @GetMapping("/{id}")
    public Article getArticleById(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи",
                    required = true
            ) @PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    @Operation(
            summary = "Получение всех статей",
            description = "Возвращает список всех статей, доступных в системе. "
                    + "Этот эндпоинт полезен для отображения всего контента блога."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список статей успешно получен")
    })
    @GetMapping("/all")
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @Operation(
            summary = "Получение статей по тегу",
            description = "Возвращает список статей, содержащих указанный тег. "
                    + "Эндпоинт принимает имя тега через query-параметр и осуществляет"
                    + " поиск статей по этому критерию."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description =
                "Статьи успешно получены"),
        @ApiResponse(responseCode = "404", description =
                "Статьи с указанным тегом не найдены", content = @Content)
    })
    @GetMapping("/by-tag")
    public List<Article> getArticlesByTagName(
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Название тега для фильтрации статей",
                    required = true
            ) @RequestParam String tagName) {
        return articleService.getArticlesByTagName(tagName);
    }

    @Operation(
            summary = "Удаление статьи",
            description = "Удаляет статью из системы по её уникальному идентификатору. "
                    + "Используйте этот эндпоинт для удаления ненужного или устаревшего контента."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Статья успешно удалена"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}")
    public void deleteArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи для удаления",
                    required = true
            ) @PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @Operation(
            summary = "Добавление тега к статье",
            description = "Добавляет тег к статье, используя уникальные"
                    + " идентификаторы статьи и тега. "
                    + "Эта операция упрощает классификацию и поиск контента."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тег успешно добавлен к статье"),
        @ApiResponse(responseCode = "404", description =
                "Статья или тег не найдены", content = @Content)
    })
    @PutMapping("/{articleId}/tags/{tagId}")
    public Article addTagToArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи",
                    required = true
            ) @PathVariable Long articleId,
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор тега",
                    required = true
            ) @PathVariable Long tagId) {
        return articleService.addTagToArticle(articleId, tagId);
    }

    @Operation(
            summary = "Удаление тега из статьи",
            description =
                    "Удаляет связь между статьёй и тегом, используя их уникальные идентификаторы. "
                    + "Применяйте данный эндпоинт для удаления некорректных или устаревших меток."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Тег успешно удалён из статьи"),
        @ApiResponse(responseCode = "404", description =
                "Статья или тег не найдены", content = @Content)
    })
    @DeleteMapping("/{articleId}/tags/{tagId}")
    public Article removeTagFromArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи",
                    required = true
            ) @PathVariable Long articleId,
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор тега",
                    required = true
            ) @PathVariable Long tagId) {
        return articleService.removeTagFromArticle(articleId, tagId);
    }

    @Operation(
            summary = "Добавление лайка к статье",
            description = "Увеличивает количество лайков статьи,"
                    + " используя её уникальный идентификатор. "
                    + "Эта операция позволяет пользователям выразить своё одобрение контента."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Лайк успешно добавлен"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @PostMapping("/{id}/like")
    public Article likeArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи для добавления лайка",
                    required = true
            ) @PathVariable Long id) {
        return articleService.likeArticle(id);
    }

    @Operation(
            summary = "Добавление дизлайка к статье",
            description = "Увеличивает количество дизлайков статьи,"
                    + " используя её уникальный идентификатор. "
                    + "Этот эндпоинт позволяет пользователям выразить несогласие с контентом."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Дизлайк успешно добавлен"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @PostMapping("/{id}/dislike")
    public Article dislikeArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи для добавления дизлайка",
                    required = true
            ) @PathVariable Long id) {
        return articleService.dislikeArticle(id);
    }

    @Operation(
            summary = "Удаление лайка",
            description = "Удаляет ранее добавленный лайк у статьи,"
                    + " используя её уникальный идентификатор. "
                    + "Используйте этот эндпоинт для корректировки"
                    + " количества лайков в случае ошибки."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Лайк успешно удалён"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}/like")
    public Article removeLike(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи для удаления лайка",
                    required = true
            ) @PathVariable Long id) {
        return articleService.removeLike(id);
    }

    @Operation(
            summary = "Удаление дизлайка",
            description = "Удаляет ранее добавленный дизлайк у статьи,"
                    + " используя её уникальный идентификатор. "
                    + "Данный эндпоинт позволяет скорректировать рейтинг статьи."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Дизлайк успешно удалён"),
        @ApiResponse(responseCode = "404", description = "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/{id}/dislike")
    public Article removeDislike(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи для удаления дизлайка",
                    required = true
            ) @PathVariable Long id) {
        return articleService.removeDislike(id);
    }
}
