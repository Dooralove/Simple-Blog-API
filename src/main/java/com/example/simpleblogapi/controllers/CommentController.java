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

    @Operation(summary = "Получение комментариев статьи",
            description = "Возвращает список комментариев для указанной"
                    + " статьи по идентификатору статьи.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Комментарии успешно получены"),
        @ApiResponse(responseCode = "404", description =
                "Комментарии не найдены", content = @Content)
    })
    @GetMapping("/by-article/{articleId}")
    public List<Comment> getCommentsByArticle(
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
            @PathVariable Long articleId) {
        return commentService.getCommentsByArticle(articleId);
    }

    @Operation(summary = "Очистка кэша комментариев для статьи",
            description = "Очищает кэш комментариев для статьи по её идентификатору.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Кэш успешно очищен"),
        @ApiResponse(responseCode = "404", description =
                    "Статья не найдена", content = @Content)
    })
    @DeleteMapping("/clear-cache/{articleId}")
    public void clearCache(
            @Parameter(in = ParameterIn.PATH, description = "Идентификатор статьи", required = true)
            @PathVariable Long articleId) {
        commentService.clearCache(articleId);
    }

    @Operation(summary = "Очистка всего кэша комментариев",
            description = "Очищает весь кэш комментариев для всех статей.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Весь кэш успешно очищен")
    })
    @DeleteMapping("/clear-cache-all")
    public void clearAllCache() {
        commentService.clearAllCache();
    }

    @Operation(summary = "Создание комментария",
            description = "Создает новый комментарий и сохраняет его в базе данных.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Комментарий успешно создан"),
        @ApiResponse(responseCode = "400", description =
                    "Неверные входные данные", content = @Content)
    })
    @PostMapping("/create")
    public Comment createComment(
            @Parameter(in = ParameterIn.DEFAULT, description =
                    "Объект комментария для создания", required = true)
            @RequestBody Comment commentEntity) {
        return commentService.createComment(commentEntity);
    }
}
