package com.example.simpleblogapi.cache;

import com.example.simpleblogapi.entities.Tag;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class TagCache {

    private static final int MAX_CACHE_SIZE = 100;

    private final Map<Long, Tag> tagEntityCache = new LinkedHashMap<>(MAX_CACHE_SIZE, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<Long, Tag> eldest) {
            return size() > MAX_CACHE_SIZE;
        }
    };

    public Tag getTag(Long id) {
        return tagEntityCache.get(id);
    }

    public void putTag(Long id, Tag tag) {
        tagEntityCache.put(id, tag);
    }

    public boolean contains(Long id) {
        return tagEntityCache.containsKey(id);
    }

    public void removeTag(Long id) {
        tagEntityCache.remove(id);
    }

    public void clear() {
        tagEntityCache.clear();
    }
}
