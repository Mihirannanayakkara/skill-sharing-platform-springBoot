package com.myproject.backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.myproject.backend.model.User;
import com.myproject.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String secretKey;

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Signup - Create a new user
    public User signup(String username, String password) {
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(new BCryptPasswordEncoder().encode(password)); // Store hashed password
        return userRepository.save(user);
    }

    // Signin - Authenticate user and generate a JWT token
    public String signin(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return generateToken(user.getId());
    }

    // Generate JWT Token using com.auth0.jwt
    private String generateToken(String userId) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey); // Secure hashing
        return JWT.create()
                .withSubject(userId)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .sign(algorithm);
    }
}
