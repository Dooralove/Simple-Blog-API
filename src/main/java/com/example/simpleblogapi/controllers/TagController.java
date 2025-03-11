package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.service.TagService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/create")
    public TagEntity createTag(@RequestBody TagEntity tag) {
        return tagService.createTag(tag);
    }

    @GetMapping("/{id}")
    public TagEntity getTagById(@PathVariable Long id) {
        return tagService.getTagById(id);
    }

    @GetMapping("/all")
    public List<TagEntity> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/search")
    public List<TagEntity> getTagsByNameContaining(@RequestParam String namePart) {
        return tagService.getTagsByNameContaining(namePart);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
    }
}
