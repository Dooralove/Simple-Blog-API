package com.example.simpleblogapi.service;

import com.example.simpleblogapi.cache.TagCache;
import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.repositories.TagRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final TagCache tagCache;

    public TagService(TagRepository tagRepository, TagCache tagCache) {
        this.tagRepository = tagRepository;
        this.tagCache = tagCache;
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag getTagById(Long id) {
        if (tagCache.contains(id)) {
            System.out.println("Fetching tag from cache: ID = " + id);
            return tagCache.getTag(id);
        }

        Tag tag = tagRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Tag not found"));

        tagCache.putTag(id, tag);
        System.out.println("Caching tag: ID = " + id);

        return tag;
    }

    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
        tagCache.removeTag(id);
        System.out.println("Removed tag from cache: ID = " + id);
    }

    public Tag getOrCreateTag(String tagName) {
        return tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(new Tag(null, tagName, null)));
    }

    public Tag updateTag(Long id, Tag tag) {
        Tag existingTag = tagRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Tag not found"));

        existingTag.setName(tag.getName());

        Tag updatedTag = tagRepository.save(existingTag);

        tagCache.putTag(id, updatedTag);
        System.out.println("Updated tag in cache: ID = " + id);

        return updatedTag;
    }

    public List<Tag> searchTagsByName(String name) {
        return tagRepository.searchTagsByName(name);
    }
}
