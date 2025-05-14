package com.myproject.backend.controller;

import com.myproject.backend.dto.AuthRequestDTO;
import com.myproject.backend.dto.RegisterRequestDTO;
import com.myproject.backend.dto.UserDTO;
import com.myproject.backend.model.User;
import com.myproject.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/google-auth")
    public User googleAuth(@RequestBody UserDTO userDTO) {
        return userService.registerOrGetUser(userDTO);
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email).orElse(null);
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequestDTO request) {
        userService.registerUser(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequestDTO request) {
        return userService.loginUser(request);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam("q") String query) {
        List<User> allUsers = userService.getAllUsers();
        return allUsers.stream()
                .filter(user -> user.getName() != null && user.getName().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }



}
