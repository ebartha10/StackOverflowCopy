package com.utcn.demo.controller;

import com.utcn.demo.dto.TagDTO;
import com.utcn.demo.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @PostMapping("/create")
    public ResponseEntity<?> createTag(@RequestBody TagDTO tagDTO) {
        TagDTO createdTagDTO = tagService.createTag(tagDTO);
        if (createdTagDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.status(201).body(createdTagDTO);
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<?> getTagById(@PathVariable String id) {
        TagDTO tagDTO = tagService.getTagById(id);
        if (tagDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tagDTO);
    }

    @RequestMapping("/search/{pageNumber}")
    public ResponseEntity<?> searchTags(@RequestParam String tagName, @PathVariable int pageNumber) {
        List<TagDTO> tagDTOs = tagService.searchTags(tagName, pageNumber);
        if (tagDTOs == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tagDTOs);
    }

    @RequestMapping("/get/all/{pageNumber}")
    public ResponseEntity<?> getAllTags(@PathVariable int pageNumber) {
        List<TagDTO> tagDTOs = tagService.getAllTags(pageNumber);
        if (tagDTOs == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tagDTOs);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTag(@RequestBody TagDTO tagDTO) {
        TagDTO updatedTagDTO = tagService.updateTag(tagDTO);
        if (updatedTagDTO == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(updatedTagDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteTag(@RequestParam String id) {
        String response = tagService.deleteTag(id);
        if (response == null) {
            return ResponseEntity.badRequest().body("Something went wrong.");
        }
        return ResponseEntity.ok(response);
    }
} 