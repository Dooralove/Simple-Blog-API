package com.example.simpleblogapi.repositories;

import com.example.simpleblogapi.entities.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, Long> {

    List<TagEntity> findByNameContaining(String namePart);
}
