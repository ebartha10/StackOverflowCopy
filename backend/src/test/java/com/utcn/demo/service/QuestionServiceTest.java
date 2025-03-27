package com.utcn.demo.service;

import com.utcn.demo.dto.QuestionDTO;
import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import com.utcn.demo.repository.QuestionRepository;
import com.utcn.demo.repository.ReplyRepository;
import com.utcn.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuestionServiceTest {

    @Autowired
    private QuestionService questionService;

    @MockBean
    private QuestionRepository questionRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ReplyRepository replyRepository;

    @Test
    public void testGetQuestionById_existingQuestion_returnsDTO() {
        User author = new User();
        author.setId("user123");

        Question question = new Question();
        question.setId("q123");
        question.setTitle("Test Title");
        question.setBody("Test Body");
        question.setTags(List.of("java", "spring"));
        question.setAuthor(author);
        question.setVoteCount(5L);

        Mockito.when(questionRepository.findById("q123")).thenReturn(Optional.of(question));

        QuestionDTO result = questionService.getQuestionById("q123");

        assertNotNull(result);
        assertEquals("q123", result.getId());
        assertEquals("Test Title", result.getTitle());
        assertEquals("Test Body", result.getBody());
        assertEquals("user123", result.getAuthorId());
        assertEquals(5L, result.getVoteCount());
        assertTrue(result.getTags().contains("java"));
        assertTrue(result.getTags().contains("spring"));
    }

    @Test
    public void testGetQuestionById_nonExistingQuestion_returnsNull() {
        Mockito.when(questionRepository.findById("invalidId")).thenReturn(Optional.empty());

        QuestionDTO result = questionService.getQuestionById("invalidId");

        assertNull(result);
    }

    @Test
    public void testGetAllQuestions_returnsPagedList() {
        Question q1 = new Question();
        q1.setId("q1");
        q1.setTitle("T1");
        q1.setBody("B1");
        q1.setTags(List.of("java"));
        q1.setVoteCount(3L);
        q1.setAuthor(new User());

        Question q2 = new Question();
        q2.setId("q2");
        q2.setTitle("T2");
        q2.setBody("B2");
        q2.setTags(List.of("spring"));
        q2.setVoteCount(1L);
        q2.setAuthor(new User());

        Page<Question> page = new PageImpl<>(List.of(q1, q2));
        Mockito.when(questionRepository.findAll(PageRequest.of(0, 5))).thenReturn(page);

        List<QuestionDTO> result = questionService.getAllQuestions(0);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("q1", result.get(0).getId());
        assertEquals("q2", result.get(1).getId());
    }

    @Test
    public void testGetQuestionByUserId_existingUser_returnsPagedList() {
        User user = new User();
        user.setId("u123");

        Question q = new Question();
        q.setId("q123");
        q.setTitle("Title");
        q.setBody("Body");
        q.setAuthor(user);
        q.setVoteCount(2L);
        q.setTags(List.of("tag1"));

        Page<Question> page = new PageImpl<>(List.of(q));
        Mockito.when(userRepository.findById("u123")).thenReturn(Optional.of(user));
        Mockito.when(questionRepository.findAllByAuthor(user, PageRequest.of(0, 5))).thenReturn(page);

        List<QuestionDTO> result = questionService.getQuestionByUserId("u123", 0);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("q123", result.get(0).getId());
    }

    @Test
    public void testGetQuestionByUserId_nonExistingUser_returnsNull() {
        Mockito.when(userRepository.findById("invalid")).thenReturn(Optional.empty());

        List<QuestionDTO> result = questionService.getQuestionByUserId("invalid", 0);

        assertNull(result);
    }

    @Test
    public void testGetQuestionByTag_returnsFilteredList() {
        Question q = new Question();
        q.setId("qTag");
        q.setTitle("Tagged Q");
        q.setTags(List.of("spring"));
        q.setAuthor(new User());
        q.setVoteCount(1L);

        Page<Question> page = new PageImpl<>(List.of(q));
        Mockito.when(questionRepository.findAllByTagsContainingOrderByCreatedAtDesc("spring", PageRequest.of(0, 5))).thenReturn(page);

        List<QuestionDTO> result = questionService.getQuestionByTag("spring", 0);

        assertEquals(1, result.size());
        assertEquals("qTag", result.get(0).getId());
    }

    @Test
    public void testGetQuestionByTitle_returnsMatchingResults() {
        Question q = new Question();
        q.setId("qTitle");
        q.setTitle("Spring Boot Guide");
        q.setTags(List.of("spring"));
        q.setAuthor(new User());
        q.setVoteCount(5L);

        Page<Question> page = new PageImpl<>(List.of(q));
        Mockito.when(questionRepository.findAllByTitleContainingIgnoreCaseOrderByCreatedAtDesc("spring", PageRequest.of(0, 5))).thenReturn(page);

        List<QuestionDTO> result = questionService.getQuestionByTitle("spring", 0);

        assertEquals(1, result.size());
        assertEquals("qTitle", result.get(0).getId());
    }

    @Test
    public void testCreateQuestion_validUser_createsQuestion() {
        User author = new User();
        author.setId("user123");
        author.setBanned(false);

        QuestionDTO inputDTO = new QuestionDTO();
        inputDTO.setTitle("New Question");
        inputDTO.setBody("Question body");
        inputDTO.setTags(List.of("java"));
        inputDTO.setAuthorId("user123");

        Question savedQuestion = new Question();
        savedQuestion.setId("q123");
        savedQuestion.setTitle("New Question");
        savedQuestion.setBody("Question body");
        savedQuestion.setTags(List.of("java"));
        savedQuestion.setAuthor(author);
        savedQuestion.setVoteCount(0L);

        Mockito.when(userRepository.findById("user123")).thenReturn(Optional.of(author));
        Mockito.when(questionRepository.save(Mockito.any(Question.class))).thenReturn(savedQuestion);

        QuestionDTO result = questionService.createQuestion(inputDTO);

        assertNotNull(result);
        assertEquals("q123", result.getId());
        assertEquals("New Question", result.getTitle());
        assertEquals("Question body", result.getBody());
        assertEquals("user123", result.getAuthorId());
    }

    @Test
    public void testUpdateQuestion_validUser_updatesQuestion() {
        User author = new User();
        author.setId("user123");
        author.setBanned(false);

        Question existingQuestion = new Question();
        existingQuestion.setId("q123");
        existingQuestion.setTitle("Old Title");
        existingQuestion.setBody("Old Body");
        existingQuestion.setAuthor(author);
        existingQuestion.setVoteCount(0L);
        existingQuestion.setLikedBy(new HashSet<>());
        existingQuestion.setDislikedBy(new HashSet<>());

        QuestionDTO inputDTO = new QuestionDTO();
        inputDTO.setId("q123");
        inputDTO.setTitle("New Title");
        inputDTO.setBody("New Body");
        inputDTO.setTags(List.of("java"));

        Question updatedQuestion = new Question();
        updatedQuestion.setId("q123");
        updatedQuestion.setTitle("New Title");
        updatedQuestion.setBody("New Body");
        updatedQuestion.setAuthor(author);
        updatedQuestion.setVoteCount(0L);

        Mockito.when(questionRepository.findById("q123")).thenReturn(Optional.of(existingQuestion));
        Mockito.when(questionRepository.save(Mockito.any(Question.class))).thenReturn(updatedQuestion);

        QuestionDTO result = questionService.updateQuestion(inputDTO, "user123");

        assertNotNull(result);
        assertEquals("q123", result.getId());
        assertEquals("New Title", result.getTitle());
        assertEquals("New Body", result.getBody());
    }

    @Test
    public void testDeleteQuestion_validUser_deletesQuestion() {
        User author = new User();
        author.setId("user123");
        author.setBanned(false);

        Question question = new Question();
        question.setId("q123");
        question.setAuthor(author);

        Mockito.when(questionRepository.findById("q123")).thenReturn(Optional.of(question));
        Mockito.doNothing().when(questionRepository).deleteById("q123");

        String result = questionService.deleteQuestion("q123", "user123");

        assertEquals("Entry successfully deleted!", result);
    }

    @Test
    public void testUpvoteQuestion_validUser_upvotesQuestion() {
        User votingUser = new User();
        votingUser.setId("voter123");
        votingUser.setBanned(false);

        User author = new User();
        author.setId("author123");
        author.setScore(0.0);

        Question question = new Question();
        question.setId("q123");
        question.setAuthor(author);
        question.setVoteCount(0L);
        question.setLikedBy(new HashSet<>());
        question.setDislikedBy(new HashSet<>());

        Mockito.when(questionRepository.findById("q123")).thenReturn(Optional.of(question));
        Mockito.when(userRepository.findById("voter123")).thenReturn(Optional.of(votingUser));
        Mockito.when(questionRepository.save(Mockito.any(Question.class))).thenReturn(question);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(author);

        String result = questionService.upvoteQuestion("q123", "voter123");

        assertEquals("Question upvoted!", result);
        assertEquals(1L, question.getVoteCount());
        assertEquals(2.5, author.getScore());
    }

    @Test
    public void testDownvoteQuestion_validUser_downvotesQuestion() {
        User votingUser = new User();
        votingUser.setId("voter123");
        votingUser.setBanned(false);

        User author = new User();
        author.setId("author123");
        author.setScore(10.0);

        Question question = new Question();
        question.setId("q123");
        question.setAuthor(author);
        question.setVoteCount(5L);
        question.setLikedBy(new HashSet<>());
        question.setDislikedBy(new HashSet<>());

        Mockito.when(questionRepository.findById("q123")).thenReturn(Optional.of(question));
        Mockito.when(userRepository.findById("voter123")).thenReturn(Optional.of(votingUser));
        Mockito.when(questionRepository.save(Mockito.any(Question.class))).thenReturn(question);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(author);

        String result = questionService.downvoteQuestion("q123", "voter123");

        assertEquals("Question downvoted!", result);
        assertEquals(4L, question.getVoteCount());
        assertEquals(8.5, author.getScore());
    }
}
