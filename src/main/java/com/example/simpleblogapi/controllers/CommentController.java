package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.Comment;
import com.example.simpleblogapi.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @Operation(
            summary = "Получение комментариев к статье",
            description = "Возвращает список всех комментариев, оставленных к статье, "
                    + "идентифицированной по её уникальному идентификатору. "
                    + "Этот endpoint используется для отображения отзывов или обсуждений, "
                    + "связанных с конкретной статьёй."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Комментарии успешно получены"),
        @ApiResponse(responseCode = "404", description =
                "Комментарии не найдены для данной статьи", content = @Content)
    })
    @GetMapping("/by-article/{articleId}")
    public List<Comment> getCommentsByArticle(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи,"
                            + " для которой необходимо получить комментарии",
                    required = true
            )
            @PathVariable Long articleId) {
        return commentService.getCommentsByArticle(articleId);
    }

    @Operation(
            summary = "Очистка кэша комментариев для статьи",
            description = "Очищает кэш комментариев, связанных с конкретной статьёй, "
                    + "идентифицированной по её уникальному идентификатору. "
                    + "Эта операция позволяет обновить данные,"
                    + " если произошли изменения в комментариях."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Кэш комментариев успешно очищен"),
        @ApiResponse(responseCode = "404", description =
                "Статья с указанным идентификатором не найдена", content = @Content)
    })
    @DeleteMapping("/clear-cache/{articleId}")
    public void clearCache(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор статьи,"
                            + " для которой требуется очистка кэша комментариев",
                    required = true
            )
            @PathVariable Long articleId) {
        commentService.clearCache(articleId);
    }

    @Operation(
            summary = "Очистка кэша всех комментариев",
            description = "Полностью очищает кэш всех комментариев для всех статей. "
                    + "Данный endpoint применяется для сброса кэшированных данных, "
                    + "что позволяет загрузить актуальную информацию из базы данных."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Кэш всех комментариев успешно очищен")
    })
    @DeleteMapping("/clear-cache-all")
    public void clearAllCache() {
        commentService.clearAllCache();
    }

    @Operation(
            summary = "Создание нового комментария",
            description = "Создает и сохраняет новый комментарий в базе данных. "
                    + "Для успешного создания необходимо передать"
                    + " корректно заполненный объект комментария, "
                    + "содержащий все обязательные поля,"
                    + " такие как текст комментария, идентификатор статьи и пользователя."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Комментарий успешно создан"),
        @ApiResponse(responseCode = "400", description =
                "Неверные входные данные для создания комментария", content = @Content)
    })
    @PostMapping("/create")
    public Comment createComment(
            @Parameter(
                    in = ParameterIn.DEFAULT,
                    description = "Объект комментария с данными для создания."
                            + " Должен включать все необходимые атрибуты.",
                    required = true
            )
            @RequestBody Comment commentEntity) {
        return commentService.createComment(commentEntity);
    }
}
