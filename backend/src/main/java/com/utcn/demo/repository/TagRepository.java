package com.utcn.demo.repository;

import com.utcn.demo.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.Optional;
@Repository
public interface TagRepository extends CrudRepository<Tag, String> {
    Page<Tag> findAllByNameContainingIgnoreCase(String tagName, Pageable paging);
}
