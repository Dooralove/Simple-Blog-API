package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.VisitCount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitCountRepository extends JpaRepository<VisitCount, Long> {
    Optional<VisitCount> findByUrl(String url);
}
