package com.utcn.demo.service;

import com.utcn.demo.dto.AuthenticationRequest;
import com.utcn.demo.dto.AuthenticationResponse;
import com.utcn.demo.dto.RegisterRequest;
import com.utcn.demo.dto.UserDTO;
import com.utcn.demo.entity.User;
import com.utcn.demo.exception.UserBannedException;
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

    @Autowired
    private EmailService emailService;

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
        user.setBanned(false);

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
        // Check if user is banned before attempting authentication
        Optional<User> userOptional = userRepository.findFirstByEmail(request.getEmail());
        if (userOptional.isPresent() && userOptional.get().isBanned()) {
            throw new UserBannedException("Your account has been banned. Please contact an administrator.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("userId", user.getId());
                String jwtToken = jwtService.generateToken(extraClaims, userDetails);
                return AuthenticationResponse.builder()
                        .token(jwtToken)
                        .userId(user.getId())
                        .build();
            }
        } catch (Exception e) {
            return null;
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
                    u.isAdmin(),
                    u.isBanned()
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
                    u.isAdmin(),
                    u.isBanned()
            );
        }
        return null;
    }

    public UserDTO updateUser(UserDTO userDTO, String requestingUserId) {
        // Check if the requesting user is an admin
        Optional<User> requestingUser = userRepository.findById(requestingUserId);
        if (requestingUser.isEmpty() || !requestingUser.get().isAdmin()) {
            return null;
        }

        // Check if the user to be updated exists
        Optional<User> optionalUser = userRepository.findById(userDTO.getId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setName(userDTO.getName());
            user.setScore(userDTO.getScore());
            user.setAdmin(userDTO.isAdmin());
            user.setBanned(userDTO.isBanned());

            User updatedUser = userRepository.save(user);
            return new UserDTO(
                    updatedUser.getId(),
                    updatedUser.getEmail(),
                    updatedUser.getName(),
                    updatedUser.getScore(),
                    updatedUser.isAdmin(),
                    updatedUser.isBanned()
            );
        }
        return null;
    }

    public String deleteUser(String id, String requestingUserId) {
        // Check if the requesting user is an admin
        Optional<User> requestingUser = userRepository.findById(requestingUserId);
        if (requestingUser.isEmpty() || !requestingUser.get().isAdmin()) {
            return null;
        }

        // Check if the user to be deleted exists
        Optional<User> userToDelete = userRepository.findById(id);
        if (userToDelete.isEmpty()) {
            return null;
        }

        try {
            userRepository.deleteById(id);
            return "User successfully deleted!";
        } catch (Exception e) {
            return null;
        }
    }

    public String banUser(String userId, String requestingUserId) {
        // Check if the requesting user is an admin
        Optional<User> requestingUser = userRepository.findById(requestingUserId);
        if (requestingUser.isEmpty() || !requestingUser.get().isAdmin()) {
            return null;
        }

        // Check if the user to be banned exists
        Optional<User> userToBan = userRepository.findById(userId);
        if (userToBan.isEmpty()) {
            return null;
        }

        User user = userToBan.get();
        user.setBanned(true);
        userRepository.save(user);

        // Send ban notification email
        emailService.sendBanNotification(user.getEmail(), user.getName());

        return "User successfully banned!";
    }

    public String unbanUser(String userId, String requestingUserId) {
        // Check if the requesting user is an admin
        Optional<User> requestingUser = userRepository.findById(requestingUserId);
        if (requestingUser.isEmpty() || !requestingUser.get().isAdmin()) {
            return null;
        }

        // Check if the user to be unbanned exists
        Optional<User> userToUnban = userRepository.findById(userId);
        if (userToUnban.isEmpty()) {
            return null;
        }

        User user = userToUnban.get();
        user.setBanned(false);
        userRepository.save(user);
        return "User successfully unbanned!";
    }
}
