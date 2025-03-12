package com.example.simpleblogapi.service;

import com.example.simpleblogapi.cache.TagCache;
import com.example.simpleblogapi.entities.TagEntity;
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

    public List<TagEntity> getAllTags() {
        return tagRepository.findAll();
    }

    public TagEntity getTagById(Long id) {
        if (tagCache.contains(id)) {
            return tagCache.getTag(id);
        }

        TagEntity tag = tagRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Tag not found"));
        tagCache.putTag(id, tag);
        return tag;
    }

    public TagEntity createTag(TagEntity tag) {
        return tagRepository.save(tag);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
        tagCache.clear();
    }

    public List<TagEntity> getTagsByNameContaining(String namePart) {
        return tagRepository.findByNameContaining(namePart);
    }

    public TagEntity updateTag(Long id, TagEntity tag) {
        TagEntity existingTag = tagRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Tag not found"));

        existingTag.setName(tag.getName());

        TagEntity updatedTag = tagRepository.save(existingTag);

        tagCache.putTag(id, updatedTag);

        return updatedTag;
    }
}
