package com.myproject.backend.service;

import com.myproject.backend.dto.AuthRequestDTO;
import com.myproject.backend.dto.RegisterRequestDTO;
import com.myproject.backend.dto.UserDTO;
import com.myproject.backend.model.User;
import com.myproject.backend.model.Follow;
import com.myproject.backend.repository.UserRepository;
import com.myproject.backend.repository.FollowRepository;
import com.myproject.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FollowRepository followRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // For Google Auth
    public User registerOrGetUser(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User();
        newUser.setName(userDTO.getName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setAuthProvider("google");

        return userRepository.save(newUser);
    }

    // For Local Register
    public void registerUser(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("user");
        user.setAuthProvider("local");

        userRepository.save(user);
    }

    // For Local Login
    public String loginUser(AuthRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!"local".equals(user.getAuthProvider())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use Google Login for this account");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public ResponseEntity<User> updateUser(String id, User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = userOptional.get();
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setCoverImageUrl(updatedUser.getCoverImageUrl());
        existingUser.setImageUrl(updatedUser.getImageUrl());
        existingUser.setBio(updatedUser.getBio());

        return ResponseEntity.ok(userRepository.save(existingUser));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> searchUsers(String query) {
        String lowercaseQuery = query.toLowerCase();
        return userRepository.findAll().stream()
                .filter(user -> (user.getName() != null && user.getName().toLowerCase().contains(lowercaseQuery)) ||
                        (user.getEmail() != null && user.getEmail().toLowerCase().contains(lowercaseQuery)))
                .collect(Collectors.toList());
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public List<User> getFollowers(String userId) {
        List<Follow> followers = followRepository.findByFollowingId(userId);
        return followers.stream()
                .map(follow -> userRepository.findById(follow.getFollowerId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    public List<User> getFollowing(String userId) {
        List<Follow> following = followRepository.findByFollowerId(userId);
        return following.stream()
                .map(follow -> userRepository.findById(follow.getFollowingId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }


}
