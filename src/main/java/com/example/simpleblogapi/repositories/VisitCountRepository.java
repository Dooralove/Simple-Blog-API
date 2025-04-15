package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.VisitCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface VisitCountRepository extends JpaRepository<VisitCount, Long> {

    @Modifying
    @Query("UPDATE VisitCount v SET v.count = v.count + 1 WHERE v.url = :url")
    int updateVisitCount(@Param("url") String url);

    @Query("SELECT v.count FROM VisitCount v WHERE v.url = :url")
    Long findCountByUrl(@Param("url") String url);
}
