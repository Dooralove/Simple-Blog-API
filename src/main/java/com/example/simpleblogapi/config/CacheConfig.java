package com.example.simpleblogapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.simpleblogapi.entities.ArticleEntity;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class CacheConfig {

    @Bean
    public Map<String, List<ArticleEntity>> articleCache() {
        return new HashMap<>();
    }
}
