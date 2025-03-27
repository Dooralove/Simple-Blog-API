package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.service.TagService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "Создание тега", description = "Создает новый тег")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег успешно создан"),
            @ApiResponse(responseCode = "400", description = "Неверные входные данные", content = @Content)
    })
    @PostMapping("/create")
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.createTag(tag);
    }

    @Operation(summary = "Получение тега по ID", description = "Возвращает тег по его идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег найден"),
            @ApiResponse(responseCode = "404", description = "Тег не найден", content = @Content)
    })
    @GetMapping("/{id}")
    public Tag getTagById(@Parameter(in = ParameterIn.PATH, description = "Идентификатор тега", required = true)
                          @PathVariable Long id) {
        return tagService.getTagById(id);
    }

    @Operation(summary = "Получение всех тегов", description = "Возвращает список всех тегов")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список тегов успешно получен")
    })
    @GetMapping("/all")
    public List<Tag> getAllTags() {
        return tagService.getAllTags();
    }

    @Operation(summary = "Удаление тега", description = "Удаляет тег по его идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег успешно удалён"),
            @ApiResponse(responseCode = "404", description = "Тег не найден", content = @Content)
    })
    @DeleteMapping("/{id}")
    public void deleteTag(@Parameter(in = ParameterIn.PATH, description = "Идентификатор тега", required = true)
                          @PathVariable Long id) {
        tagService.deleteTag(id);
    }

    @Operation(summary = "Обновление тега", description = "Обновляет данные тега по его идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Тег успешно обновлён"),
            @ApiResponse(responseCode = "404", description = "Тег не найден", content = @Content)
    })
    @PutMapping("/{id}")
    public Tag updateTag(@Parameter(in = ParameterIn.PATH, description = "Идентификатор тега", required = true)
                         @PathVariable Long id, @RequestBody Tag tag) {
        return tagService.updateTag(id, tag);
    }

    @Operation(summary = "Поиск тегов", description = "Возвращает список тегов, имя которых содержит указанную подстроку")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список тегов успешно получен")
    })
    @GetMapping("/search")
    public List<Tag> searchTags(@Parameter(in = ParameterIn.QUERY, description = "Часть имени тега для поиска", required = true)
                                @RequestParam String name) {
        return tagService.searchTagsByName(name);
    }
}
