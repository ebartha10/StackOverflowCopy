package com.utcn.demo.controller;

import com.utcn.demo.dto.UserDTO;
import com.utcn.demo.service.JwtService;
import com.utcn.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    private String extractUserIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            return jwtService.extractUserIdFromToken(jwt);
        }
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.getUserById(id);
        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        UserDTO userDTO = userService.getUserByEmail(email);
        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserDTO userDTO) {
        String requestingUserId = extractUserIdFromHeader(authHeader);
        if (requestingUserId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }

        UserDTO updatedUserDTO = userService.updateUser(userDTO, requestingUserId);
        if (updatedUserDTO == null) {
            return ResponseEntity.badRequest().body("Unauthorized or user not found.");
        }
        return ResponseEntity.ok(updatedUserDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String id) {
        String requestingUserId = extractUserIdFromHeader(authHeader);
        if (requestingUserId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }

        String response = userService.deleteUser(id, requestingUserId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Unauthorized or user not found.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ban/{userId}")
    public ResponseEntity<?> banUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String userId) {
        String requestingUserId = extractUserIdFromHeader(authHeader);
        if (requestingUserId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }

        String response = userService.banUser(userId, requestingUserId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Unauthorized or user not found.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unban")
    public ResponseEntity<?> unbanUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String userId) {
        String requestingUserId = extractUserIdFromHeader(authHeader);
        if (requestingUserId == null) {
            return ResponseEntity.badRequest().body("Invalid authorization token.");
        }

        String response = userService.unbanUser(userId, requestingUserId);
        if (response == null) {
            return ResponseEntity.badRequest().body("Unauthorized or user not found.");
        }
        return ResponseEntity.ok(response);
    }
} 