package com.example.simpleblogapi.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.example.simpleblogapi.service.TagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.simpleblogapi.entities.Tag;
import com.example.simpleblogapi.repositories.TagRepository;
import com.example.simpleblogapi.cache.TagCache;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @Mock
    private TagCache tagCache;

    @InjectMocks
    private TagService tagService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTags() {
        List<Tag> tags = Arrays.asList(new Tag(), new Tag());
        when(tagRepository.findAll()).thenReturn(tags);
        List<Tag> result = tagService.getAllTags();
        assertEquals(2, result.size());
    }

    @Test
    void testGetTagById_FromCache() {
        Long id = 1L;
        Tag tag = new Tag();
        when(tagCache.contains(id)).thenReturn(true);
        when(tagCache.getTag(id)).thenReturn(tag);
        Tag result = tagService.getTagById(id);
        assertEquals(tag, result);
        verify(tagRepository, never()).findById(id);
    }

    @Test
    void testGetTagById_FromRepository() {
        Long id = 1L;
        Tag tag = new Tag();
        when(tagCache.contains(id)).thenReturn(false);
        when(tagRepository.findById(id)).thenReturn(Optional.of(tag));
        Tag result = tagService.getTagById(id);
        assertEquals(tag, result);
        verify(tagCache).putTag(id, tag);
    }

    @Test
    void testGetTagById_NotFound() {
        Long id = 1L;
        when(tagCache.contains(id)).thenReturn(false);
        when(tagRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> tagService.getTagById(id));
    }

    @Test
    void testCreateTag() {
        Tag tag = new Tag();
        when(tagRepository.save(tag)).thenReturn(tag);
        Tag result = tagService.createTag(tag);
        assertEquals(tag, result);
    }

    @Test
    void testDeleteTag() {
        Long id = 1L;
        tagService.deleteTag(id);
        verify(tagRepository).deleteById(id);
        verify(tagCache).removeTag(id);
    }

    @Test
    void testGetOrCreateTag_Existing() {
        String name = "tech";
        Tag tag = new Tag();
        when(tagRepository.findByName(name)).thenReturn(Optional.of(tag));
        Tag result = tagService.getOrCreateTag(name);
        assertEquals(tag, result);
        verify(tagRepository, never()).save(any(Tag.class));
    }

    @Test
    void testGetOrCreateTag_New() {
        String name = "tech";
        when(tagRepository.findByName(name)).thenReturn(Optional.empty());
        Tag savedTag = new Tag(1L, name, null);
        when(tagRepository.save(any(Tag.class))).thenReturn(savedTag);
        Tag result = tagService.getOrCreateTag(name);
        assertEquals(name, result.getName());
        assertEquals(1L, result.getId());
        verify(tagRepository).save(argThat(t -> t.getName().equals(name) && t.getId() == null));
    }

    @Test
    void testUpdateTag_Success() {
        Long id = 1L;
        Tag existingTag = new Tag(id, "old", null);
        when(tagRepository.findById(id)).thenReturn(Optional.of(existingTag));
        Tag updateData = new Tag();
        updateData.setName("new");
        when(tagRepository.save(existingTag)).thenReturn(existingTag);
        Tag result = tagService.updateTag(id, updateData);
        assertEquals("new", result.getName());
        verify(tagCache).putTag(id, existingTag);
    }

    @Test
    void testUpdateTag_NotFound() {
        Long id = 1L;
        when(tagRepository.findById(id)).thenReturn(Optional.empty());
        Tag updateData = new Tag();
        assertThrows(RuntimeException.class, () -> tagService.updateTag(id, updateData));
    }

    @Test
    void testSearchTagsByName() {
        String name = "tech";
        List<Tag> tags = Arrays.asList(new Tag(), new Tag());
        when(tagRepository.searchTagsByName(name)).thenReturn(tags);
        List<Tag> result = tagService.searchTagsByName(name);
        assertEquals(2, result.size());
    }
}