package com.example.simpleblogapi.test;

import com.example.simpleblogapi.service.VisitCounterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VisitCounterServiceTest {

    private VisitCounterService visitCounterService;

    @BeforeEach
    void setUp() {
        visitCounterService = new VisitCounterService();
    }

    @Test
    void incrementVisit_FirstTime_ShouldReturnOne() {
        String url = "/test-page";

        long count = visitCounterService.incrementVisit(url);

        assertEquals(1, count, "При первом вызове счетчик должен быть равен 1");
    }

    @Test
    void incrementVisit_MultipleTimes_ShouldIncrementCorrectly() {
        String url = "/test-page";

        visitCounterService.incrementVisit(url);
        visitCounterService.incrementVisit(url);
        long count = visitCounterService.incrementVisit(url);

        assertEquals(3, count, "После трёх инкрементов значение должно быть 3");
    }

    @Test
    void getVisitCount_WhenNoVisits_ShouldReturnZero() {
        String url = "/non-existent-page";

        long count = visitCounterService.getVisitCount(url);

        assertEquals(0, count, "Для нового URL количество посещений должно быть 0");
    }

    @Test
    void getVisitCount_AfterIncrements_ShouldReturnCorrectCount() {
        String url = "/test-page";

        visitCounterService.incrementVisit(url);
        visitCounterService.incrementVisit(url);
        long count = visitCounterService.getVisitCount(url);

        assertEquals(2, count, "После двух инкрементов значение должно быть 2");
    }
}
