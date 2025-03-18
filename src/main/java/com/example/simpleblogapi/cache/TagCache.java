package com.example.simpleblogapi.cache;

import com.example.simpleblogapi.entities.Tag;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Logger;
import org.springframework.stereotype.Component;

@Component
public class TagCache {

    private static final int MAX_CACHE_SIZE = 100;

    private static final Logger logger = Logger.getLogger(TagCache.class.getName());

    private final Map<Long, Tag> tagEntityCache = new LinkedHashMap<>(MAX_CACHE_SIZE, 0.75f, true) {

        @Override
        protected boolean removeEldestEntry(Map.Entry<Long, Tag> eldest) {
            boolean remove = super.size() > MAX_CACHE_SIZE;  
            if (remove) {
                logger.info("Removed eldest entry: " + eldest.getKey() + " from cache.");
            }
            return remove;
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

    public int size() {
        return tagEntityCache.size();
    }

    public void printCache() {
        // Заменим System.out.println() на логирование
        tagEntityCache.forEach((key, value) ->
                logger.info("Key: " + key + ", Tag: " + value));
    }
}
