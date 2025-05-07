package com.myproject.backend.controller;

import com.myproject.backend.model.User;
import com.myproject.backend.service.AuthService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/signout")
    public ResponseEntity<String> signout() {
        // Invalidate or clear any session/token if necessary (depends on your implementation)
        return ResponseEntity.ok("Signed out successfully");
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody AuthRequest request) {
        User user = authService.signup(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/signin")
    public ResponseEntity<TokenResponse> signin(@RequestBody AuthRequest request) {
        String token = authService.signin(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @Data
    static class AuthRequest {
        private String username;
        private String password;
    }

    @Data
    static class TokenResponse {
        private final String token;
    }
}
