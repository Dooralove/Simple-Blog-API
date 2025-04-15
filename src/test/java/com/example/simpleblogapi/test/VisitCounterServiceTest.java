package com.example.simpleblogapi.test;

import com.example.simpleblogapi.entities.VisitCount;
import com.example.simpleblogapi.repositories.VisitCountRepository;
import com.example.simpleblogapi.service.VisitCounterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class VisitCounterServiceTest {

    private VisitCountRepository visitCountRepository;
    private VisitCounterService visitCounterService;

    @BeforeEach
    void setUp() {
        visitCountRepository = mock(VisitCountRepository.class);
        visitCounterService = new VisitCounterService(visitCountRepository);
    }

    @Test
    void testIncrementVisit_ExistingUrl() {
        String url = "https://example.com";

        when(visitCountRepository.updateVisitCount(url)).thenReturn(1);
        when(visitCountRepository.findCountByUrl(url)).thenReturn(5L);

        long result = visitCounterService.incrementVisit(url);

        assertEquals(5L, result);
        verify(visitCountRepository).updateVisitCount(url);
        verify(visitCountRepository).findCountByUrl(url);
    }

    @Test
    void testIncrementVisit_NewUrl() {
        String url = "https://new-url.com";

        when(visitCountRepository.updateVisitCount(url)).thenReturn(0);

        long result = visitCounterService.incrementVisit(url);

        assertEquals(1L, result);

        ArgumentCaptor<VisitCount> captor = ArgumentCaptor.forClass(VisitCount.class);
        verify(visitCountRepository).saveAndFlush(captor.capture());

        VisitCount saved = captor.getValue();
        assertEquals(url, saved.getUrl());
        assertEquals(1L, saved.getCount());
    }

    @Test
    void testIncrementVisit_ThrowsWhenCountMissingAfterUpdate() {
        String url = "https://example.com";

        when(visitCountRepository.updateVisitCount(url)).thenReturn(1);
        when(visitCountRepository.findCountByUrl(url)).thenReturn(null);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            visitCounterService.incrementVisit(url);
        });

        assertEquals("Счетчик не найден после успешного обновления для URL.", exception.getMessage());
    }

    @Test
    void testGetVisitCount_WhenExists() {
        String url = "https://exists.com";
        when(visitCountRepository.findCountByUrl(url)).thenReturn(10L);

        long count = visitCounterService.getVisitCount(url);

        assertEquals(10L, count);
    }

    @Test
    void testGetVisitCount_WhenNotExists() {
        String url = "https://not-exist.com";
        when(visitCountRepository.findCountByUrl(url)).thenReturn(null);

        long count = visitCounterService.getVisitCount(url);

        assertEquals(0L, count);
    }
}
