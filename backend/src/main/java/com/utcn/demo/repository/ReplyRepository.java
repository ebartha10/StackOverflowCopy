package com.utcn.demo.repository;

import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.Reply;
import com.utcn.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends CrudRepository<Reply, String> {
    Page<Reply> findAllByQuestionOrderByVoteCountDesc(Question question, Pageable paging);
    Page<Reply> findAllByAuthorIdOrderByVoteCountDesc(String authorId, Pageable paging);

    int countAllByAuthor(User author);
}
