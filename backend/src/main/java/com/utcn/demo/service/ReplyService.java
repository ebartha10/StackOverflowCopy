package com.utcn.demo.service;

import com.utcn.demo.dto.ReplyDTO;
import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.Reply;
import com.utcn.demo.entity.User;
import com.utcn.demo.repository.QuestionRepository;
import com.utcn.demo.repository.ReplyRepository;
import com.utcn.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReplyService {
    public static final int SEARCH_RESULT_PER_PAGE = 5;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public ReplyDTO createReply(ReplyDTO replyDTO) {
        Optional<User> optionalUser = userRepository.findById(replyDTO.getAuthor().getId());
        Optional<Question> optionalQuestion = questionRepository.findById(replyDTO.getQuestionId());
        
        if (optionalUser.isPresent() && optionalQuestion.isPresent()) {
            Reply reply = new Reply();
            reply.setBody(replyDTO.getBody());
            reply.setAuthor(optionalUser.get());
            reply.setQuestion(optionalQuestion.get());
            reply.setCreated_at(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            reply.setLikedBy(new HashSet<>());
            reply.setDislikedBy(new HashSet<>());
            reply.setVoteCount(0L);

            Reply createdReply = replyRepository.save(reply);

            ReplyDTO createdReplyDTO = new ReplyDTO(
                createdReply.getId(),
                createdReply.getBody(),
                createdReply.getAuthor(),
                createdReply.getQuestion().getId(),
                createdReply.getCreated_at(),
                createdReply.getVoteCount(),
                createdReply.isAccepted(),
                createdReply.getLikedBy().stream().map(User::getId).collect(Collectors.toSet()),
                createdReply.getDislikedBy().stream().map(User::getId).collect(Collectors.toSet())
            );
            return createdReplyDTO;
        }
        return null;
    }

    public ReplyDTO getReplyById(String id) {
        Optional<Reply> reply = replyRepository.findById(id);
        if (reply.isPresent()) {
            Reply r = reply.get();
            return new ReplyDTO(
                r.getId(),
                r.getBody(),
                r.getAuthor(),
                r.getQuestion().getId(),
                r.getCreated_at(),
                r.getVoteCount(),
                r.isAccepted(),
                r.getLikedBy().stream().map(User::getId).collect(Collectors.toSet()),
                r.getDislikedBy().stream().map(User::getId).collect(Collectors.toSet())
            );
        }
        return null;
    }

    public List<ReplyDTO> getRepliesByQuestionId(String questionId, int pageNumber) {
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isPresent()) {
            Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
            Page<Reply> repliesPage = replyRepository.findAllByQuestionOrderByVoteCountDesc(question.get(), paging);
            
            return repliesPage.getContent().stream()
                .map(reply -> new ReplyDTO(
                    reply.getId(),
                    reply.getBody(),
                    reply.getAuthor(),
                    reply.getQuestion().getId(),
                    reply.getCreated_at(),
                    reply.getVoteCount(),
                    reply.isAccepted(),
                    reply.getLikedBy().stream().map(User::getId).collect(Collectors.toSet()),
                    reply.getDislikedBy().stream().map(User::getId).collect(Collectors.toSet())
                )).sorted(Comparator.comparing(ReplyDTO::getVoteCount).reversed())
                .collect(Collectors.toList());
        }
        return null;
    }

    public ReplyDTO updateReply(ReplyDTO replyDTO) {
        Optional<Reply> optionalReply = replyRepository.findById(replyDTO.getId());
        if (optionalReply.isPresent()) {
            Reply reply = optionalReply.get();
            reply.setBody(replyDTO.getBody());
            reply.setAccepted(replyDTO.isAccepted());
            reply.setVoteCount(replyDTO.getVoteCount());

            Reply updatedReply = replyRepository.save(reply);
            return new ReplyDTO(
                updatedReply.getId(),
                updatedReply.getBody(),
                updatedReply.getAuthor(),
                updatedReply.getQuestion().getId(),
                updatedReply.getCreated_at(),
                updatedReply.getVoteCount(),
                updatedReply.isAccepted(),
                updatedReply.getLikedBy().stream().map(User::getId).collect(Collectors.toSet()),
                    updatedReply.getDislikedBy().stream().map(User::getId).collect(Collectors.toSet())
                    );
        }
        return null;
    }

    public String deleteReply(String id) {
        try {
            replyRepository.deleteById(id);
            return "Reply successfully deleted!";
        } catch (Exception e) {
            return null;
        }
    }

    public String upvoteReply(String replyId, String userId) {
        Optional<Reply> reply = replyRepository.findById(replyId);
        Optional<User> user = userRepository.findById(userId);
        
        if (reply.isPresent() && user.isPresent()) {
            Reply r = reply.get();
            if (r.getLikedBy().contains(user.get())) {
                return "Reply already upvoted!";
            }
            if (r.getDislikedBy().contains(user.get())) {
                r.getDislikedBy().remove(user.get());
                r.setVoteCount(r.getVoteCount() + 1);
            }
            r.getLikedBy().add(user.get());
            r.setVoteCount(r.getVoteCount() + 1);
            replyRepository.save(r);

            User author = r.getAuthor();
            author.setScore(author.getScore() + 2.5);
            userRepository.save(author);
            return "Reply upvoted!";
        }
        return null;
    }

    public String downvoteReply(String replyId, String userId) {
        Optional<Reply> reply = replyRepository.findById(replyId);
        Optional<User> user = userRepository.findById(userId);
        
        if (reply.isPresent() && user.isPresent()) {
            Reply r = reply.get();
            if (r.getDislikedBy().contains(user.get())) {
                return "Reply already downvoted!";
            }
            if (r.getLikedBy().contains(user.get())) {
                r.getLikedBy().remove(user.get());
                r.setVoteCount(r.getVoteCount() - 1);
            }
            r.getDislikedBy().add(user.get());
            r.setVoteCount(r.getVoteCount() - 1);
            replyRepository.save(r);

            User author = r.getAuthor();
            author.setScore(author.getScore() - 1.5);
            userRepository.save(author);
            return "Reply downvoted!";
        }
        return null;
    }

    public List<ReplyDTO> getRepliesByUserId(String userId, int pageNumber) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
            Page<Reply> repliesPage = replyRepository.findAllByAuthorIdOrderByVoteCountDesc(user.get().getId(), paging);

            return repliesPage.getContent().stream()
                .map(reply -> new ReplyDTO(
                    reply.getId(),
                    reply.getBody(),
                    reply.getAuthor(),
                    reply.getQuestion().getId(),
                    reply.getCreated_at(),
                    reply.getVoteCount(),
                    reply.isAccepted()
                    , reply.getLikedBy().stream().map(User::getId).collect(Collectors.toSet()),
                    reply.getDislikedBy().stream().map(User::getId).collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
        }
        return null;
    }
    public Integer getNumberOfRepliesForUser(String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> replyRepository.countAllByAuthor(value)).orElse(0);
    }
}