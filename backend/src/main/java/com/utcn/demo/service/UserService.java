package com.utcn.demo.service;

import com.utcn.demo.dto.AuthenticationRequest;
import com.utcn.demo.dto.AuthenticationResponse;
import com.utcn.demo.dto.RegisterRequest;
import com.utcn.demo.dto.UserDTO;
import com.utcn.demo.entity.User;
import com.utcn.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;

    public AuthenticationResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findFirstByEmail(request.getEmail()).isPresent()) {
            return null;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setScore(0.0);
        user.setAdmin(false);

        User savedUser = userRepository.save(user);
        final UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", savedUser.getId());
        String jwtToken = jwtService.generateToken(extraClaims, userDetails);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Optional<User> userOptional = userRepository.findFirstByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("userId", user.getId());
            String jwtToken = jwtService.generateToken(extraClaims, userDetails);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        }
        return null;
    }

    public UserDTO getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User u = user.get();
            return new UserDTO(
                    u.getId(),
                    u.getEmail(),
                    u.getName(),
                    u.getScore(),
                    u.isAdmin()
            );
        }
        return null;
    }

    public UserDTO getUserByEmail(String email) {
        Optional<User> user = userRepository.findFirstByEmail(email);
        if (user.isPresent()) {
            User u = user.get();
            return new UserDTO(
                    u.getId(),
                    u.getEmail(),
                    u.getName(),
                    u.getScore(),
                    u.isAdmin()
            );
        }
        return null;
    }

    public UserDTO updateUser(UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(userDTO.getId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setName(userDTO.getName());
            user.setScore(userDTO.getScore());
            user.setAdmin(userDTO.isAdmin());

            User updatedUser = userRepository.save(user);
            return new UserDTO(
                    updatedUser.getId(),
                    updatedUser.getEmail(),
                    updatedUser.getName(),
                    updatedUser.getScore(),
                    updatedUser.isAdmin()
            );
        }
        return null;
    }

    public String deleteUser(String id) {
        try {
            userRepository.deleteById(id);
            return "User successfully deleted!";
        } catch (Exception e) {
            return null;
        }
    }
}
