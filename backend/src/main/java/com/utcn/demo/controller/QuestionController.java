package com.utcn.demo.controller;

import com.utcn.demo.dto.QuestionDTO;
import com.utcn.demo.service.JwtService;
import com.utcn.demo.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @Autowired
    private JwtService jwtService;

    private String extractUserIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            return jwtService.extractUserIdFromToken(jwt);
        }
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<?> addQuestion(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody QuestionDTO questionDTO) {
        String userId = extractUserIdFromHeader(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatusCode.valueOf(401)).body("Invalid authorization token.");
        }
        questionDTO.setAuthorId(userId);
        QuestionDTO createdQuestionDTO = questionService.createQuestion(questionDTO);
        if (createdQuestionDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.status(201).body(createdQuestionDTO);
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable String id) {
        QuestionDTO questionDTO = questionService.getQuestionById(id);
        if (questionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionDTO);
    }
    @RequestMapping("/get/by-tag/{pageNumber}")
    public ResponseEntity<?> getQuestionsByTag(@RequestParam String tag, @PathVariable int pageNumber) {
        List<QuestionDTO> questionDTO = questionService.getQuestionByTag(tag, pageNumber);
        if (questionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionDTO);
    }
    @RequestMapping("/get/by-author/{pageNumber}")
    public ResponseEntity<?> getQuestionsByAuthor(@RequestParam String authorId, @PathVariable int pageNumber) {
        List<QuestionDTO> questionDTO = questionService.getQuestionByUserId(authorId, pageNumber);
        if (questionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionDTO);
    }
    @RequestMapping("/get/all/{pageNumber}")
    public ResponseEntity<?> getAllQuestions(@PathVariable int pageNumber) {
        List<QuestionDTO> questionDTO = questionService.getAllQuestions(pageNumber);
        if (questionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionDTO);
    }
    @RequestMapping("/get/by-title/{pageNumber}")
    public ResponseEntity<?> getQuestionsByTitle(@RequestParam String title, @PathVariable int pageNumber) {
        List<QuestionDTO> questionDTO = questionService.getQuestionByTitle(title, pageNumber);
        if (questionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionDTO);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateQuestion(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody QuestionDTO questionDTO) {
        String userId = extractUserIdFromHeader(authHeader);
        if (userId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }
        questionDTO.setAuthorId(userId);
        QuestionDTO updatedQuestionDTO = questionService.updateQuestion(questionDTO, userId);
        if (updatedQuestionDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(updatedQuestionDTO);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteQuestion(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String id) {
        String userId = extractUserIdFromHeader(authHeader);
        if (userId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }
        String response = questionService.deleteQuestion(id, userId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(response);
    }

}
