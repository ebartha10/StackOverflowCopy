package com.utcn.demo.controller;

import com.utcn.demo.dto.AuthenticationRequest;
import com.utcn.demo.dto.AuthenticationResponse;
import com.utcn.demo.dto.RegisterRequest;
import com.utcn.demo.exception.UserBannedException;
import com.utcn.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/register", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> registerOptions() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "http://localhost:4200");
        headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.add("Access-Control-Allow-Credentials", "true");
        headers.add("Access-Control-Max-Age", "3600");
        return ResponseEntity.ok().headers(headers).build();
    }
    
    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> loginOptions() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "http://localhost:4200");
        headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.add("Access-Control-Allow-Credentials", "true");
        headers.add("Access-Control-Max-Age", "3600");
        return ResponseEntity.ok().headers(headers).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = userService.register(request);
            if (response == null) {
                return ResponseEntity.badRequest().body("User with this email already exists.");
            }
            return ResponseEntity.ok(response);
        } catch (UserBannedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("An error occurred during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse response = userService.authenticate(request);
            if (response == null) {
                return ResponseEntity.badRequest().body("Invalid credentials.");
            }
            return ResponseEntity.ok(response);
        } catch (UserBannedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("An error occurred during authentication: " + e.getMessage());
        }
    }
} 