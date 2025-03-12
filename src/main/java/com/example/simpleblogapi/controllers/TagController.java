package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.service.TagService;
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

    @PutMapping("/{id}")
    public TagEntity updateTag(@PathVariable Long id, @RequestBody TagEntity tag) {
        return tagService.updateTag(id, tag);
    }
}
