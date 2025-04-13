package com.example.simpleblogapi.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class VisitCounterService {

    private final ConcurrentHashMap<String, AtomicLong> visitCounts = new ConcurrentHashMap<>();

    public long incrementVisit(String url) {
        return visitCounts.computeIfAbsent(url, k -> new AtomicLong(0)).incrementAndGet();
    }

    public long getVisitCount(String url) {
        return visitCounts.getOrDefault(url, new AtomicLong(0)).get();
    }

}
