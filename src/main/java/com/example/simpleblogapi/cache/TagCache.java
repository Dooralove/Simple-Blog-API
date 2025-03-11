package com.example.simpleblogapi.cache;

import com.example.simpleblogapi.entities.TagEntity;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;


@Component
public class TagCache {

    private final Map<Long, TagEntity> tagCache = new HashMap<>();

    public TagEntity getTag(Long id) {
        return tagCache.get(id);
    }

    public void putTag(Long id, TagEntity tag) {
        tagCache.put(id, tag);
    }

    public boolean contains(Long id) {
        return tagCache.containsKey(id);
    }

    public void clear() {
        tagCache.clear();
    }
}
