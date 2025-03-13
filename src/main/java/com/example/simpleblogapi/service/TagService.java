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
            return tagCache.getTag(id);
        }

        Tag tag = tagRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Tag not found"));
        tagCache.putTag(id, tag);
        return tag;
    }

    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
        tagCache.clear();
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

        return updatedTag;
    }
}
