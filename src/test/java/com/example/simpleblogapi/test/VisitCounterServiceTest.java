package com.example.simpleblogapi.test;

import com.example.simpleblogapi.entities.VisitCount;
import com.example.simpleblogapi.repositories.VisitCountRepository;
import com.example.simpleblogapi.service.VisitCounterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class VisitCounterServiceTest {

    private VisitCountRepository visitCountRepository;
    private VisitCounterService visitCounterService;

    @BeforeEach
    void setUp() {
        visitCountRepository = mock(VisitCountRepository.class);
        visitCounterService = new VisitCounterService(visitCountRepository);
    }

    @Test
    void incrementVisit_WhenUrlExists_ShouldIncrementCount() {
        String url = "https://example.com";
        VisitCount existingVisitCount = new VisitCount();
        existingVisitCount.setUrl(url);
        existingVisitCount.setCount(5L);

        when(visitCountRepository.findByUrl(url)).thenReturn(Optional.of(existingVisitCount));

        long updatedCount = visitCounterService.incrementVisit(url);

        assertEquals(6L, updatedCount);
        verify(visitCountRepository).save(existingVisitCount);
    }

    @Test
    void incrementVisit_WhenUrlDoesNotExist_ShouldCreateNewVisitCount() {
        String url = "https://newsite.com";

        when(visitCountRepository.findByUrl(url)).thenReturn(Optional.empty());

        ArgumentCaptor<VisitCount> captor = ArgumentCaptor.forClass(VisitCount.class);

        long updatedCount = visitCounterService.incrementVisit(url);

        assertEquals(1L, updatedCount);
        verify(visitCountRepository).save(captor.capture());

        VisitCount savedVisitCount = captor.getValue();
        assertEquals(url, savedVisitCount.getUrl());
        assertEquals(1L, savedVisitCount.getCount());
    }

    @Test
    void getVisitCount_WhenUrlExists_ShouldReturnCount() {
        // given
        String url = "https://example.com";
        VisitCount existingVisitCount = new VisitCount();
        existingVisitCount.setUrl(url);
        existingVisitCount.setCount(10L);

        when(visitCountRepository.findByUrl(url)).thenReturn(Optional.of(existingVisitCount));

        long count = visitCounterService.getVisitCount(url);

        assertEquals(10L, count);
    }

    @Test
    void getVisitCount_WhenUrlDoesNotExist_ShouldReturnZero() {
        String url = "https://unknown.com";

        when(visitCountRepository.findByUrl(url)).thenReturn(Optional.empty());

        long count = visitCounterService.getVisitCount(url);

        assertEquals(0L, count);
    }
}
