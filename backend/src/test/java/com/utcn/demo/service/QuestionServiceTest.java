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
        // Arrange
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

        // Act
        QuestionDTO result = questionService.getQuestionById("q123");

        // Assert
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
        // Arrange
        Mockito.when(questionRepository.findById("invalidId")).thenReturn(Optional.empty());

        // Act
        QuestionDTO result = questionService.getQuestionById("invalidId");

        // Assert
        assertNull(result);
    }
}
