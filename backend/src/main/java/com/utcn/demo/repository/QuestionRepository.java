package com.utcn.demo.repository;

import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionRepository extends CrudRepository<Question, String> {
    Optional<Question> findById(String id);
    Page<Question> findAllByAuthor (User user, Pageable paging);
    Page<Question> findAllByTagsContainingOrderByCreatedAtDesc (String tag, Pageable paging);
    Page<Question> findAllByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title, Pageable pageable);
}
