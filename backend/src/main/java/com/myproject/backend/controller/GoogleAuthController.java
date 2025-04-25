package com.myproject.backend.controller;

import com.myproject.backend.model.User;
import com.myproject.backend.repository.UserRepository;
import com.myproject.backend.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    private final GoogleIdTokenVerifier verifier;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    public GoogleAuthController(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        NetHttpTransport transport = new NetHttpTransport();
        JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();
        this.verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            String idTokenString = body.get("token");
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                User user = userRepository.findByEmail(email);
                if (user == null) {
                    // Create new user
                    user = new User();
                    user.setEmail(email);
                    user.setFirstName((String) payload.get("given_name"));
                    user.setLastName((String) payload.get("family_name"));
                    user = userRepository.save(user);
                }

                // Generate JWT token including user's MongoDB ID
                String token = jwtUtil.generateToken(user);

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing Google login: " + e.getMessage());
        }
    }
}