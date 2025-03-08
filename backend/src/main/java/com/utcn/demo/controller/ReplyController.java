package com.utcn.demo.controller;

import com.utcn.demo.dto.ReplyDTO;
import com.utcn.demo.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {
    @Autowired
    private ReplyService replyService;

    @PostMapping("/create")
    public ResponseEntity<?> addReply(@RequestBody ReplyDTO replyDTO) {
        ReplyDTO createdReplyDTO = replyService.createReply(replyDTO);
        if (createdReplyDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.status(201).body(createdReplyDTO);
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<?> getReplyById(@PathVariable String id) {
        ReplyDTO replyDTO = replyService.getReplyById(id);
        if (replyDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(replyDTO);
    }

    @RequestMapping("/get/by-question/{pageNumber}")
    public ResponseEntity<?> getRepliesByQuestion(@RequestParam String questionId, @PathVariable int pageNumber) {
        List<ReplyDTO> replyDTOs = replyService.getRepliesByQuestionId(questionId, pageNumber);
        if (replyDTOs == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(replyDTOs);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateReply(@RequestBody ReplyDTO replyDTO) {
        ReplyDTO updatedReplyDTO = replyService.updateReply(replyDTO);
        if (updatedReplyDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(updatedReplyDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteReply(@RequestParam String id) {
        String response = replyService.deleteReply(id);
        if (response == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upvote")
    public ResponseEntity<?> upvoteReply(@RequestParam String replyId, @RequestParam String userId) {
        String response = replyService.upvoteReply(replyId, userId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/downvote")
    public ResponseEntity<?> downvoteReply(@RequestParam String replyId, @RequestParam String userId) {
        String response = replyService.downvoteReply(replyId, userId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(response);
    }
} 