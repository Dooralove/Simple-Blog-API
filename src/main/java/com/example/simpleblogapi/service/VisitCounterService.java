package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.VisitCount;
import com.example.simpleblogapi.repositories.VisitCountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitCounterService {

    private static final Logger log = LoggerFactory.getLogger(VisitCounterService.class);
    private final VisitCountRepository visitCountRepository;

    public VisitCounterService(VisitCountRepository visitCountRepository) {
        this.visitCountRepository = visitCountRepository;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public synchronized long incrementVisit(String url) {
        if (visitCountRepository.updateVisitCount(url) > 0) {
            return getCountOrThrow(url, "Счетчик не найден после успешного обновления для URL.");
        }
        return saveNew(url);
    }

    private long getCountOrThrow(String url, String errorMessage) {
        Long count = visitCountRepository.findCountByUrl(url);
        if (count == null) {
            throw new IllegalStateException(errorMessage);
        }
        return count;
    }

    private long saveNew(String url) {
        VisitCount newVisitCount = new VisitCount();
        newVisitCount.setUrl(url);
        newVisitCount.setCount(1L);
        visitCountRepository.saveAndFlush(newVisitCount);
        return 1L;
    }

    public long getVisitCount(String url) {
        Long count = visitCountRepository.findCountByUrl(url);
        return (count != null ? count : 0L);
    }
}
