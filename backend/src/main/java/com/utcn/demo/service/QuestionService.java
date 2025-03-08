package com.utcn.demo.service;

import com.utcn.demo.dto.QuestionDTO;
import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import com.utcn.demo.repository.QuestionRepository;
import com.utcn.demo.repository.ReplyRepository;
import com.utcn.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    public static final int SEARCH_RESULT_PER_PAGE = 5;

    @Autowired
    ReplyRepository replyRepository;

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    UserRepository userRepository;

    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Optional<User> optionalUser = userRepository.findById(questionDTO.getAuthorId());
        if (optionalUser.isPresent()) {
            Question question = new Question();
            question.setTitle(questionDTO.getTitle());
            question.setBody(questionDTO.getBody());
            question.setCreatedAt(new Date());
            question.setTags(questionDTO.getTags());
            question.setAuthor(optionalUser.get());

            Question createdQuestion = questionRepository.save(question);

            QuestionDTO createdQuestionDTO = new QuestionDTO();
            createdQuestionDTO.setId(createdQuestion.getId());
            createdQuestionDTO.setTitle(createdQuestion.getTitle());
            return createdQuestionDTO;
        }
        return null;
    }
    public QuestionDTO getQuestionById(String id) {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isPresent()) {
            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(question.get().getId());
            questionDTO.setTitle(question.get().getTitle());
            questionDTO.setBody(question.get().getBody());
            questionDTO.setTags(question.get().getTags());
            questionDTO.setAuthorId(question.get().getAuthor().getId());
            questionDTO.setVoteCount(question.get().getVoteCount());
            return questionDTO;
        }
        return null;
    }
    public List<QuestionDTO> getQuestionByUserId(String userId, int pageNumber) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
            Page<Question> questionsPage =  questionRepository.findAllByAuthor(user.get(), paging);

            List<QuestionDTO> questionDTOList = new ArrayList<>();
            for (Question question : questionsPage.getContent()) {
                QuestionDTO questionDTO = new QuestionDTO();
                questionDTO.setId(question.getId());
                questionDTO.setTitle(question.getTitle());
                questionDTO.setBody(question.getBody());
                questionDTO.setTags(question.getTags());
                questionDTO.setAuthorId(question.getAuthor().getId());
                questionDTO.setVoteCount(question.getVoteCount());
                questionDTOList.add(questionDTO);
            }
        }
        return null;
    }
}
