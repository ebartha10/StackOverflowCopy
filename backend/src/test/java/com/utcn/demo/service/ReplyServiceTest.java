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

    @Test
    void testGetReplyById_existingReply_returnsReplyDTO() {
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

        ReplyDTO result = replyService.getReplyById("r001");

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
        Mockito.when(replyRepository.findById("notFound"))
                .thenReturn(Optional.empty());

        ReplyDTO result = replyService.getReplyById("notFound");

        assertNull(result);
    }

    @Test
    void testCreateReply_validUserAndQuestion_createsReply() {
        User user = new User();
        user.setId("u001");

        Question question = new Question();
        question.setId("q001");

        ReplyDTO inputDTO = new ReplyDTO(
                null,
                "Hello world",
                user,
                question,
                null,
                0L,
                false,
                null,
                null
        );

        Mockito.when(userRepository.findById("u001"))
                .thenReturn(Optional.of(user));

        Mockito.when(questionRepository.findById("q001"))
                .thenReturn(Optional.of(question));

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

        ReplyDTO result = replyService.createReply(inputDTO);

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

        Mockito.when(userRepository.findById("uBad"))
                .thenReturn(Optional.empty());
        Mockito.when(questionRepository.findById("qBad"))
                .thenReturn(Optional.empty());

        ReplyDTO result = replyService.createReply(inputDTO);

        assertNull(result);
    }

    @Test
    void testGetRepliesByQuestionId_existingQuestion_returnsList() {
        Question q = new Question();
        q.setId("q123");

        Mockito.when(questionRepository.findById("q123"))
                .thenReturn(Optional.of(q));

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

        Mockito.when(replyRepository.findAllByQuestionOrderByVoteCountDesc(
                Mockito.eq(q),
                Mockito.any(Pageable.class))
        ).thenReturn(page);

        List<ReplyDTO> result = replyService.getRepliesByQuestionId("q123", 0);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("r1", result.get(0).getId());
        assertEquals("r2", result.get(1).getId());
    }

    @Test
    void testGetRepliesByQuestionId_nonExistingQuestion_returnsNull() {
        Mockito.when(questionRepository.findById("qX"))
                .thenReturn(Optional.empty());

        List<ReplyDTO> result = replyService.getRepliesByQuestionId("qX", 0);

        assertNull(result);
    }

    @Test
    void testUpdateReply_existingReply_returnsUpdated() {
        Reply existing = new Reply();
        existing.setId("r999");
        existing.setBody("Old body");
        existing.setAccepted(false);
        existing.setLikedBy(new HashSet<>());
        existing.setDislikedBy(new HashSet<>());
        existing.setVoteCount(0L);

        Mockito.when(replyRepository.findById("r999"))
                .thenReturn(Optional.of(existing));

        Reply updated = new Reply();
        updated.setId("r999");
        updated.setBody("New body");
        updated.setAccepted(true);
        updated.setVoteCount(5L);
        updated.setLikedBy(new HashSet<>());
        updated.setDislikedBy(new HashSet<>());

        Mockito.when(replyRepository.save(Mockito.any(Reply.class)))
                .thenReturn(updated);

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

        ReplyDTO result = replyService.updateReply(inputDTO);

        assertNotNull(result);
        assertEquals("r999", result.getId());
        assertEquals("New body", result.getBody());
        assertTrue(result.isAccepted());
        assertEquals(5L, result.getVoteCount());
    }

    @Test
    void testUpdateReply_nonExistingReply_returnsNull() {
        Mockito.when(replyRepository.findById("nope"))
                .thenReturn(Optional.empty());

        ReplyDTO inputDTO = new ReplyDTO();
        inputDTO.setId("nope");

        ReplyDTO result = replyService.updateReply(inputDTO);

        assertNull(result);
    }

    @Test
    void testDeleteReply_successfulDeletion_returnsMessage() {
        Mockito.doNothing().when(replyRepository).deleteById("del1");

        String result = replyService.deleteReply("del1");

        assertEquals("Reply successfully deleted!", result);
    }

    @Test
    void testDeleteReply_exceptionThrown_returnsNull() {
        Mockito.doThrow(new RuntimeException("DB error"))
                .when(replyRepository).deleteById("delX");

        String result = replyService.deleteReply("delX");

        assertNull(result);
    }

    @Test
    void testUpvoteReply_successfulUpvote_returnsMessage() {
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

        Mockito.when(replyRepository.save(Mockito.any(Reply.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = replyService.upvoteReply("rUp", "uUp");

        assertEquals("Reply upvoted!", result);
        assertTrue(reply.getLikedBy().contains(user));
        assertFalse(reply.getDislikedBy().contains(user));
        assertEquals(1L, reply.getVoteCount());
        assertEquals(102.5, reply.getAuthor().getScore(), 0.0001);
    }

    @Test
    void testUpvoteReply_alreadyUpvoted_returnsMessage() {
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

        String result = replyService.upvoteReply("rUp2", "uUp");

        assertEquals("Reply already upvoted!", result);
        assertEquals(3L, reply.getVoteCount()); // neschimbat
    }

    @Test
    void testUpvoteReply_missingReplyOrUser_returnsNull() {
        Mockito.when(replyRepository.findById("rNone")).thenReturn(Optional.empty());
        Mockito.when(userRepository.findById("uNone")).thenReturn(Optional.empty());

        String result = replyService.upvoteReply("rNone", "uNone");

        assertNull(result);
    }

    @Test
    void testDownvoteReply_successfulDownvote_returnsMessage() {
        Reply reply = new Reply();
        reply.setId("rDown");
        reply.setBody("Reply to be downvoted");
        reply.setVoteCount(10L);
        reply.setLikedBy(new HashSet<>());
        reply.setDislikedBy(new HashSet<>());

        User user = new User();
        user.setId("uDown");
        user.setScore(50);

        User author = new User();
        author.setScore(100.0);
        reply.setAuthor(author);

        Mockito.when(replyRepository.findById("rDown")).thenReturn(Optional.of(reply));
        Mockito.when(userRepository.findById("uDown")).thenReturn(Optional.of(user));

        Mockito.when(replyRepository.save(Mockito.any(Reply.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = replyService.downvoteReply("rDown", "uDown");

        assertEquals("Reply downvoted!", result);
        assertTrue(reply.getDislikedBy().contains(user));
        assertFalse(reply.getLikedBy().contains(user));
        assertEquals(9L, reply.getVoteCount());
        assertEquals(98.5, reply.getAuthor().getScore(), 0.0001); // 100 - 1.5
    }

    @Test
    void testDownvoteReply_alreadyDownvoted_returnsMessage() {
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

        String result = replyService.downvoteReply("rDown2", "uDown2");

        assertEquals("Reply already downvoted!", result);
        assertEquals(2L, reply.getVoteCount()); // neschimbat
    }

    @Test
    void testDownvoteReply_missingReplyOrUser_returnsNull() {
        Mockito.when(replyRepository.findById("noReply")).thenReturn(Optional.empty());
        Mockito.when(userRepository.findById("noUser")).thenReturn(Optional.empty());

        String result = replyService.downvoteReply("noReply", "noUser");

        assertNull(result);
    }

}
