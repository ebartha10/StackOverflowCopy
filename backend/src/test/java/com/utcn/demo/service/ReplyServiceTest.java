package com.utcn.demo.service;

import com.utcn.demo.dto.ReplyDTO;
import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.Reply;
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
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ReplyServiceTest {

    @Autowired
    private ReplyService replyService;

    @MockBean
    private ReplyRepository replyRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private QuestionRepository questionRepository;

    /*
     * Aici vom scrie testele pentru:
     *   1. getReplyById
     *   2. createReply
     *   3. getRepliesByQuestionId
     *   4. updateReply
     *   5. deleteReply
     *   6. upvoteReply
     *   7. downvoteReply
     */

    // ----------------------------------------------------
    // 1) TESTARE: getReplyById
    // ----------------------------------------------------
    @Test
    void testGetReplyById_existingReply_returnsReplyDTO() {
        // ARRANGE
        Reply reply = new Reply();
        reply.setId("r001");
        reply.setBody("Some reply body");

        User author = new User();
        author.setId("u123");
        reply.setAuthor(author);

        Question question = new Question();
        question.setId("q123");
        reply.setQuestion(question);

        reply.setCreated_at("2025-03-24T10:00:00");
        reply.setVoteCount(5L);
        reply.setAccepted(true);

        Mockito.when(replyRepository.findById("r001"))
                .thenReturn(Optional.of(reply));

        // ACT
        ReplyDTO result = replyService.getReplyById("r001");

        // ASSERT
        assertNotNull(result);
        assertEquals("r001", result.getId());
        assertEquals("Some reply body", result.getBody());
        assertEquals("u123", result.getAuthor().getId());
        assertEquals("q123", result.getQuestionId().getId());
        assertEquals("2025-03-24T10:00:00", result.getCreated_at());
        assertEquals(5L, result.getVoteCount());
        assertTrue(result.isAccepted());
    }

    @Test
    void testGetReplyById_nonExistingReply_returnsNull() {
        // ARRANGE
        Mockito.when(replyRepository.findById("notFound"))
                .thenReturn(Optional.empty());

        // ACT
        ReplyDTO result = replyService.getReplyById("notFound");

        // ASSERT
        assertNull(result);
    }

    // ----------------------------------------------------
    // 2) TESTARE: createReply
    // ----------------------------------------------------
    @Test
    void testCreateReply_validUserAndQuestion_createsReply() {
        // ARRANGE
        User user = new User();
        user.setId("u001");

        Question question = new Question();
        question.setId("q001");

        // DTO de intrare
        ReplyDTO inputDTO = new ReplyDTO(
                null,                  // ID
                "Hello world",         // Body
                user,                  // Author
                question,              // Question
                null,                  // created_at
                0L,                    // voteCount
                false,                 // isAccepted
                null,                  // likedBy
                null                   // dislikedBy
        );

        // Simulăm că user și question există
        Mockito.when(userRepository.findById("u001"))
                .thenReturn(Optional.of(user));

        Mockito.when(questionRepository.findById("q001"))
                .thenReturn(Optional.of(question));

        // Simulăm că atunci când salvăm, se generează un ID
        Reply savedReply = new Reply();
        savedReply.setId("generatedId");
        savedReply.setBody("Hello world");
        savedReply.setAuthor(user);
        savedReply.setQuestion(question);
        savedReply.setCreated_at("2025-03-24T10:00:00");
        savedReply.setVoteCount(0L);
        savedReply.setAccepted(false);
        savedReply.setLikedBy(new HashSet<>());
        savedReply.setDislikedBy(new HashSet<>());

        Mockito.when(replyRepository.save(Mockito.any(Reply.class)))
                .thenReturn(savedReply);

        // ACT
        ReplyDTO result = replyService.createReply(inputDTO);

        // ASSERT
        assertNotNull(result);
        assertEquals("generatedId", result.getId());
        assertEquals("Hello world", result.getBody());
        assertEquals("u001", result.getAuthor().getId());
        assertEquals("q001", result.getQuestionId().getId());
        assertEquals(0L, result.getVoteCount());
        assertFalse(result.isAccepted());
    }

    @Test
    void testCreateReply_missingUserOrQuestion_returnsNull() {
        // ARRANGE
        User user = new User();
        user.setId("uBad");

        Question question = new Question();
        question.setId("qBad");

        ReplyDTO inputDTO = new ReplyDTO(
                null,
                "No user or question found",
                user,
                question,
                null,
                0L,
                false,
                null,
                null
        );

        // Simulăm că userRepository și questionRepository returnează empty
        Mockito.when(userRepository.findById("uBad"))
                .thenReturn(Optional.empty());
        Mockito.when(questionRepository.findById("qBad"))
                .thenReturn(Optional.empty());

        // ACT
        ReplyDTO result = replyService.createReply(inputDTO);

        // ASSERT
        assertNull(result);
        // (Pentru ambele situații - user lipsă SAU question lipsă - metoda returnează null)
    }

    // ----------------------------------------------------
    // 3) TESTARE: getRepliesByQuestionId
    // ----------------------------------------------------
    @Test
    void testGetRepliesByQuestionId_existingQuestion_returnsList() {
        // ARRANGE
        Question q = new Question();
        q.setId("q123");

        Mockito.when(questionRepository.findById("q123"))
                .thenReturn(Optional.of(q));

        // Simulăm datele returnate de replyRepository
        Reply r1 = new Reply();
        r1.setId("r1");
        r1.setBody("Reply 1");
        r1.setVoteCount(10L);

        Reply r2 = new Reply();
        r2.setId("r2");
        r2.setBody("Reply 2");
        r2.setVoteCount(5L);

        List<Reply> replies = List.of(r1, r2);
        Page<Reply> page = new PageImpl<>(replies);

        // Când se apelează findAllByQuestionOrderByVoteCountDesc
        Mockito.when(replyRepository.findAllByQuestionOrderByVoteCountDesc(
                Mockito.eq(q),
                Mockito.any(Pageable.class))
        ).thenReturn(page);

        // ACT
        List<ReplyDTO> result = replyService.getRepliesByQuestionId("q123", 0);

        // ASSERT
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("r1", result.get(0).getId());
        assertEquals("r2", result.get(1).getId());
    }

    @Test
    void testGetRepliesByQuestionId_nonExistingQuestion_returnsNull() {
        // ARRANGE
        Mockito.when(questionRepository.findById("qX"))
                .thenReturn(Optional.empty());

        // ACT
        List<ReplyDTO> result = replyService.getRepliesByQuestionId("qX", 0);

        // ASSERT
        assertNull(result);
    }

    // ----------------------------------------------------
    // 4) TESTARE: updateReply
    // ----------------------------------------------------
    @Test
    void testUpdateReply_existingReply_returnsUpdated() {
        // ARRANGE
        Reply existing = new Reply();
        existing.setId("r999");
        existing.setBody("Old body");
        existing.setAccepted(false);
        existing.setLikedBy(new HashSet<>());
        existing.setDislikedBy(new HashSet<>());
        existing.setVoteCount(0L);

        Mockito.when(replyRepository.findById("r999"))
                .thenReturn(Optional.of(existing));

        // Rezultat simulat după salvare
        Reply updated = new Reply();
        updated.setId("r999");
        updated.setBody("New body");
        updated.setAccepted(true);
        updated.setVoteCount(5L);
        updated.setLikedBy(new HashSet<>());
        updated.setDislikedBy(new HashSet<>());

        Mockito.when(replyRepository.save(Mockito.any(Reply.class)))
                .thenReturn(updated);

        // Input
        ReplyDTO inputDTO = new ReplyDTO(
                "r999",
                "New body",
                null,
                null,
                null,
                5L,
                true,
                new HashSet<>(),
                new HashSet<>()
        );

        // ACT
        ReplyDTO result = replyService.updateReply(inputDTO);

        // ASSERT
        assertNotNull(result);
        assertEquals("r999", result.getId());
        assertEquals("New body", result.getBody());
        assertTrue(result.isAccepted());
        assertEquals(5L, result.getVoteCount());
    }

    @Test
    void testUpdateReply_nonExistingReply_returnsNull() {
        // ARRANGE
        Mockito.when(replyRepository.findById("nope"))
                .thenReturn(Optional.empty());

        ReplyDTO inputDTO = new ReplyDTO();
        inputDTO.setId("nope");


        // ACT
        ReplyDTO result = replyService.updateReply(inputDTO);

        // ASSERT
        assertNull(result);
    }

    // ----------------------------------------------------
    // 5) TESTARE: deleteReply
    // ----------------------------------------------------
    @Test
    void testDeleteReply_successfulDeletion_returnsMessage() {
        // ARRANGE
        Mockito.doNothing().when(replyRepository).deleteById("del1");

        // ACT
        String result = replyService.deleteReply("del1");

        // ASSERT
        assertEquals("Reply successfully deleted!", result);
    }

    @Test
    void testDeleteReply_exceptionThrown_returnsNull() {
        // ARRANGE
        Mockito.doThrow(new RuntimeException("DB error"))
                .when(replyRepository).deleteById("delX");

        // ACT
        String result = replyService.deleteReply("delX");

        // ASSERT
        assertNull(result);
    }

    // ----------------------------------------------------
    // 6) TESTARE: upvoteReply
    // ----------------------------------------------------
    @Test
    void testUpvoteReply_successfulUpvote_returnsMessage() {
        // ARRANGE
        Reply reply = new Reply();
        reply.setId("rUp");
        reply.setBody("Reply to be upvoted");
        reply.setVoteCount(0L);
        reply.setLikedBy(new HashSet<>());
        reply.setDislikedBy(new HashSet<>());

        User user = new User();
        user.setId("uUp");
        user.setScore(0.0);

        reply.setAuthor(new User());
        reply.getAuthor().setScore(100);

        Mockito.when(replyRepository.findById("rUp")).thenReturn(Optional.of(reply));
        Mockito.when(userRepository.findById("uUp")).thenReturn(Optional.of(user));

        // Salvarea Reply după update
        Mockito.when(replyRepository.save(Mockito.any(Reply.class))).thenAnswer(invocation -> invocation.getArgument(0));
        // Salvarea autorului
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        String result = replyService.upvoteReply("rUp", "uUp");

        // ASSERT
        assertEquals("Reply upvoted!", result);
        assertTrue(reply.getLikedBy().contains(user));
        assertFalse(reply.getDislikedBy().contains(user));
        assertEquals(1L, reply.getVoteCount());
        assertEquals(102.5, reply.getAuthor().getScore(), 0.0001);
    }

    @Test
    void testUpvoteReply_alreadyUpvoted_returnsMessage() {
        // ARRANGE
        User user = new User();
        user.setId("uUp");

        Reply reply = new Reply();
        reply.setId("rUp2");
        reply.setBody("Reply already upvoted");
        reply.setVoteCount(3L);
        Set<User> likedSet = new HashSet<>();
        likedSet.add(user);
        reply.setLikedBy(likedSet);
        reply.setDislikedBy(new HashSet<>());

        Mockito.when(replyRepository.findById("rUp2")).thenReturn(Optional.of(reply));
        Mockito.when(userRepository.findById("uUp")).thenReturn(Optional.of(user));

        // ACT
        String result = replyService.upvoteReply("rUp2", "uUp");

        // ASSERT
        assertEquals("Reply already upvoted!", result);
        assertEquals(3L, reply.getVoteCount()); // neschimbat
    }

    @Test
    void testUpvoteReply_missingReplyOrUser_returnsNull() {
        // ARRANGE
        Mockito.when(replyRepository.findById("rNone")).thenReturn(Optional.empty());
        Mockito.when(userRepository.findById("uNone")).thenReturn(Optional.empty());

        // ACT
        String result = replyService.upvoteReply("rNone", "uNone");

        // ASSERT
        assertNull(result);
    }

    // ----------------------------------------------------
    // 7) TESTARE: downvoteReply
    // ----------------------------------------------------
    @Test
    void testDownvoteReply_successfulDownvote_returnsMessage() {
        // ARRANGE
        Reply reply = new Reply();
        reply.setId("rDown");
        reply.setBody("Reply to be downvoted");
        reply.setVoteCount(10L);
        reply.setLikedBy(new HashSet<>());
        reply.setDislikedBy(new HashSet<>());

        User user = new User();
        user.setId("uDown");
        user.setScore(50);

        // setăm autor
        User author = new User();
        author.setScore(100.0);
        reply.setAuthor(author);

        Mockito.when(replyRepository.findById("rDown")).thenReturn(Optional.of(reply));
        Mockito.when(userRepository.findById("uDown")).thenReturn(Optional.of(user));

        Mockito.when(replyRepository.save(Mockito.any(Reply.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        String result = replyService.downvoteReply("rDown", "uDown");

        // ASSERT
        assertEquals("Reply downvoted!", result);
        assertTrue(reply.getDislikedBy().contains(user));
        assertFalse(reply.getLikedBy().contains(user));
        assertEquals(9L, reply.getVoteCount());
        assertEquals(98.5, reply.getAuthor().getScore(), 0.0001); // 100 - 1.5
    }

    @Test
    void testDownvoteReply_alreadyDownvoted_returnsMessage() {
        // ARRANGE
        User user = new User();
        user.setId("uDown2");

        Reply reply = new Reply();
        reply.setId("rDown2");
        reply.setVoteCount(2L);
        Set<User> disliked = new HashSet<>();
        disliked.add(user);
        reply.setDislikedBy(disliked);

        Mockito.when(replyRepository.findById("rDown2")).thenReturn(Optional.of(reply));
        Mockito.when(userRepository.findById("uDown2")).thenReturn(Optional.of(user));

        // ACT
        String result = replyService.downvoteReply("rDown2", "uDown2");

        // ASSERT
        assertEquals("Reply already downvoted!", result);
        assertEquals(2L, reply.getVoteCount()); // neschimbat
    }

    @Test
    void testDownvoteReply_missingReplyOrUser_returnsNull() {
        // ARRANGE
        Mockito.when(replyRepository.findById("noReply")).thenReturn(Optional.empty());
        Mockito.when(userRepository.findById("noUser")).thenReturn(Optional.empty());

        // ACT
        String result = replyService.downvoteReply("noReply", "noUser");

        // ASSERT
        assertNull(result);
    }

}
