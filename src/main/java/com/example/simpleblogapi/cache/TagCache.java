package com.example.simpleblogapi.cache;

import com.example.simpleblogapi.entities.Tag;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;


@Component
public class TagCache {

    private final Map<Long, Tag> tagEntityCache = new HashMap<>();

    public Tag getTag(Long id) {
        return tagEntityCache.get(id);
    }

    public void putTag(Long id, Tag tag) {
        tagEntityCache.put(id, tag);
    }

    public boolean contains(Long id) {
        return tagEntityCache.containsKey(id);
    }

    public void clear() {
        tagEntityCache.clear();
    }
}
