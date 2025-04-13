package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.VisitCount;
import com.example.simpleblogapi.repositories.VisitCountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitCounterService {

    private final VisitCountRepository visitCountRepository;

    public VisitCounterService(VisitCountRepository visitCountRepository) {
        this.visitCountRepository = visitCountRepository;
    }

    @Transactional
    public long incrementVisit(String url) {
        VisitCount visitCount = visitCountRepository.findByUrl(url)
                .orElseGet(() -> {
                    VisitCount newVisitCount = new VisitCount();
                    newVisitCount.setUrl(url);
                    newVisitCount.setCount(0L);
                    return newVisitCount;
                });
        visitCount.setCount(visitCount.getCount() + 1);
        visitCountRepository.save(visitCount);
        return visitCount.getCount();
    }

    public long getVisitCount(String url) {
        return visitCountRepository.findByUrl(url)
                .map(VisitCount::getCount)
                .orElse(0L);
    }
}
