package com.example.simpleblogapi.service;

import com.example.simpleblogapi.entities.VisitCount;
import com.example.simpleblogapi.repositories.VisitCountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
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
        try {
            int updatedRows = visitCountRepository.updateVisitCount(url);

            if (updatedRows > 0) {
                Long count = visitCountRepository.findCountByUrl(url);
                if (count == null) {
                    throw new IllegalStateException("Счетчик не найден после "
                            + "успешного обновления для URL: " + url);
                }
                return count;
            } else {
                try {
                    VisitCount newVisitCount = new VisitCount();
                    newVisitCount.setUrl(url);
                    newVisitCount.setCount(1L);
                    visitCountRepository.saveAndFlush(newVisitCount);
                    return 1L;
                } catch (DataIntegrityViolationException e) {

                    int retryUpdatedRows = visitCountRepository.updateVisitCount(url);

                    if (retryUpdatedRows > 0) {
                        Long count = visitCountRepository.findCountByUrl(url);
                        if (count == null) {
                            throw new IllegalStateException("Счетчик не найден"
                                    + " после успешного повторного обновления для URL: " + url);
                        }
                        return count;
                    } else {
                        Long finalCount = visitCountRepository.findCountByUrl(url);
                        if (finalCount != null) {
                            return finalCount;
                        }
                        throw new RuntimeException("Не удалось инкрементировать "
                                + "счетчик для URL: " + url + " после обработки конфликта.");
                    }
                }
            }
        } finally {
            log.trace("Exiting synchronized incrementVisit for URL: {}", url);
        }
    }

    public long getVisitCount(String url) {
        Long count = visitCountRepository.findCountByUrl(url);
        return (count != null ? count : 0L);
    }
}