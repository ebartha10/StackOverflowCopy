package com.utcn.demo.service;

import com.utcn.demo.dto.QuestionDTO;
import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import com.utcn.demo.exception.UserBannedException;
import com.utcn.demo.repository.QuestionRepository;
import com.utcn.demo.repository.ReplyRepository;
import com.utcn.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
            User user = optionalUser.get();
            if (user.isBanned()) {
                throw new UserBannedException("Your account has been banned. You cannot create questions.");
            }

            Question question = new Question();
            question.setTitle(questionDTO.getTitle());
            question.setBody(questionDTO.getBody());
            question.setCreatedAt(new Date());
            question.setTags(questionDTO.getTags());
            question.setAuthor(user);
            question.setVoteCount(0L);
            question.setLikedBy(new HashSet<>());
            question.setDislikedBy(new HashSet<>());

            Question createdQuestion = questionRepository.save(question);

            QuestionDTO createdQuestionDTO = new QuestionDTO();
            createdQuestionDTO.setId(createdQuestion.getId());
            createdQuestionDTO.setTitle(createdQuestion.getTitle());
            createdQuestionDTO.setBody(createdQuestion.getBody());
            createdQuestionDTO.setCreatedAt(createdQuestion.getCreatedAt());
            createdQuestionDTO.setAuthorId(user.getId());
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
            questionDTO.setCreatedAt(question.get().getCreatedAt());
            questionDTO.setLikedById(
                question.get().getLikedBy().stream()
                    .map(User::getId)
                    .collect(Collectors.toSet())
            );
            questionDTO.setDislikedById(
                question.get().getDislikedBy().stream()
                    .map(User::getId)
                    .collect(Collectors.toSet())
            );
            questionDTO.setAuthor(question.get().getAuthor());
            return questionDTO;
        }
        return null;
    }
    public List<QuestionDTO> getQuestionByUserId(String userId, int pageNumber) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
            Page<Question> questionsPage =  questionRepository.findAllByAuthor(user.get(), paging);

            return getQuestionDTOS(questionsPage);
        }
        return null;
    }

    private List<QuestionDTO> getQuestionDTOS(Page<Question> questionsPage) {
        List<QuestionDTO> questionDTOList = new ArrayList<>();
        for (Question question : questionsPage.getContent()) {
            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(question.getId());
            questionDTO.setTitle(question.getTitle());
            questionDTO.setBody(question.getBody());
            questionDTO.setTags(question.getTags());
            questionDTO.setAuthorId(question.getAuthor().getId());
            questionDTO.setAuthor(question.getAuthor());
            questionDTO.setVoteCount(question.getVoteCount());
            questionDTOList.add(questionDTO);
        }
        return questionDTOList;
    }

    public List<QuestionDTO> getQuestionByTag(String tag, int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Question> questionsPage =  questionRepository.findAllByTagsContainingOrderByCreatedAtDesc(tag, paging);

        return getQuestionDTOS(questionsPage);
    }
    public List<QuestionDTO> getQuestionByTitle(String title, int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Question> questionsPage =  questionRepository.findAllByTitleContainingIgnoreCaseOrderByCreatedAtDesc(title, paging);

        return getQuestionDTOS(questionsPage);
    }
    public List<QuestionDTO> getAllQuestions(int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Question> questionsPage =  questionRepository.findAll(paging);

        return getQuestionDTOS(questionsPage);
    }
    public int getNumberOfQuestionsForUser(String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> questionRepository.countAllByAuthor(value)).orElse(0);
    }
    public QuestionDTO updateQuestion(QuestionDTO questionDTO, String userId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionDTO.getId());
        User requestingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            User user = question.getAuthor();

            if (!user.getId().equals(userId) && !requestingUser.isAdmin()) {
                throw new RuntimeException("You do not have permission to update this question.");
            }

            if (user.isBanned()) {
                throw new UserBannedException("Your account has been banned. You cannot update questions.");
            }
            if(questionDTO.getTitle() != null && !questionDTO.getTitle().isEmpty()){
                question.setTitle(questionDTO.getTitle());
            }
            if(questionDTO.getBody() != null && !questionDTO.getBody().isEmpty()){
                question.setBody(questionDTO.getBody());

            }
            if(questionDTO.getTags() != null && !questionDTO.getTags().isEmpty()) {
                question.setTags(questionDTO.getTags());
            }

            // Initialize sets if they're null
            if (question.getLikedBy() == null) {
                question.setLikedBy(new HashSet<>());
            }
            if (question.getDislikedBy() == null) {
                question.setDislikedBy(new HashSet<>());
            }

            // Update liked users if the DTO has them
            if (questionDTO.getLikedById() != null) {
                Set<User> likedByUsers = questionDTO.getLikedById().stream()
                    .map(k -> userRepository.findById(k)
                            .orElseThrow(() -> new RuntimeException("User not found with ID: " + k)))
                    .collect(Collectors.toSet());
                question.setLikedBy(likedByUsers);
            }

            // Update disliked users if the DTO has them
            if (questionDTO.getDislikedById() != null) {
                Set<User> dislikedByUsers = questionDTO.getDislikedById().stream()
                    .map(k -> userRepository.findById(k)
                            .orElseThrow(() -> new RuntimeException("User not found with ID: " + k)))
                    .collect(Collectors.toSet());
                question.setDislikedBy(dislikedByUsers);
            }

            question.setVoteCount(questionDTO.getVoteCount());

            Question updatedQuestion = questionRepository.save(question);

            QuestionDTO updatedQuestionDTO = new QuestionDTO();
            updatedQuestionDTO.setId(updatedQuestion.getId());
            updatedQuestionDTO.setTitle(updatedQuestion.getTitle());
            updatedQuestionDTO.setBody(updatedQuestion.getBody());
            updatedQuestionDTO.setTags(updatedQuestion.getTags());
            updatedQuestionDTO.setAuthorId(updatedQuestion.getAuthor().getId());
            updatedQuestionDTO.setVoteCount(updatedQuestion.getVoteCount());
            
            // Set the liked and disliked user IDs in the response DTO
            if (updatedQuestion.getLikedBy() != null) {
                updatedQuestionDTO.setLikedById(
                    updatedQuestion.getLikedBy().stream()
                        .map(User::getId)
                        .collect(Collectors.toSet())
                );
            }
            
            if (updatedQuestion.getDislikedBy() != null) {
                updatedQuestionDTO.setDislikedById(
                    updatedQuestion.getDislikedBy().stream()
                        .map(User::getId)
                        .collect(Collectors.toSet())
                );
            }
            
            return updatedQuestionDTO;
        }
        return null;
    }
    public String deleteQuestion(String id, String userId) {
        Optional<Question> question = questionRepository.findById(id);
        User requestingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (question.isPresent()) {
            User user = question.get().getAuthor();
            if (!user.getId().equals(userId) && !requestingUser.isAdmin()) {
                throw new RuntimeException("You do not have permission to delete this question.");
            }
            if (user.isBanned()) {
                throw new UserBannedException("Your account has been banned. You cannot delete questions.");
            }
            try {
                questionRepository.deleteById(id);
                return "Entry successfully deleted!";
            } catch (Exception e) {
                return null;
            }
        }
        else{
            throw new RuntimeException("Question not found with ID: " + id);
        }
    }

    public String upvoteQuestion(String questionId, String userId) {
        Optional<Question> question = questionRepository.findById(questionId);
        Optional<User> user = userRepository.findById(userId);
        if (question.isPresent() && user.isPresent()) {
            User votingUser = user.get();
            if (votingUser.isBanned()) {
                throw new UserBannedException("Your account has been banned. You cannot vote on questions.");
            }

            Question q = question.get();
            if (q.getLikedBy().contains(votingUser)) {
                return "Question already upvoted!";
            }
            if (q.getDislikedBy().contains(user.get())) {
                q.getDislikedBy().remove(user.get());
                q.setVoteCount(q.getVoteCount() + 1);
            }
            q.getLikedBy().add(votingUser);
            q.setVoteCount(q.getVoteCount() + 1);
            questionRepository.save(q);

            User author = q.getAuthor();
            author.setScore(author.getScore() + 2.5);
            userRepository.save(author);
            return "Question upvoted!";
        }
        return null;
    }
    public String downvoteQuestion(String questionId, String userId){
        Optional<Question> question = questionRepository.findById(questionId);
        Optional<User> user = userRepository.findById(userId);
        if (question.isPresent() && user.isPresent()) {
            User votingUser = user.get();
            if (votingUser.isBanned()) {
                throw new UserBannedException("Your account has been banned. You cannot vote on questions.");
            }

            Question q = question.get();
            if (q.getDislikedBy().contains(votingUser)) {
                return "Question already downvoted!";
            }
            if (q.getLikedBy().contains(votingUser)) {
                q.getLikedBy().remove(votingUser);
                q.setVoteCount(q.getVoteCount() - 1);
            }
            q.getDislikedBy().add(votingUser);
            q.setVoteCount(q.getVoteCount() - 1);
            questionRepository.save(q);

            User author = q.getAuthor();
            author.setScore(author.getScore() - 1.5);
            userRepository.save(author);
            return "Question downvoted!";
        }
        return null;
    }
}
