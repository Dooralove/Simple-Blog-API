package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.entities.TagEntity;
import com.example.simpleblogapi.repositories.TagRepository;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @PostMapping("/create")
    public TagEntity createTag(@RequestBody TagEntity tag) {
        return tagRepository.save(tag);
    }

    @GetMapping("/{id}")
    public TagEntity getTagById(@PathVariable Long id) {
        return tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    @GetMapping("/all")
    public List<TagEntity> getAllTags() {
        return tagRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id) {
        tagRepository.deleteById(id);
    }
}
