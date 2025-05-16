package com.myproject.backend.controller;

import com.myproject.backend.model.SavedPost;
import com.myproject.backend.model.MediaModel;
import com.myproject.backend.service.SavedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
public class SavedPostController {

    @Autowired
    private SavedPostService savedPostService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleSavePost(
            @RequestParam String userId,
            @RequestParam String postId) {
        try {
            SavedPost result = savedPostService.toggleSavePost(userId, postId);
            String message = result != null ? "Post saved successfully" : "Post unsaved successfully";
            return ResponseEntity.ok(Map.of(
                    "message", message,
                    "saved", result != null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<List<MediaModel>> getSavedPosts(@RequestParam String userId) {
        try {
            List<MediaModel> savedPosts = savedPostService.getSavedPosts(userId);
            return ResponseEntity.ok(savedPosts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> isPostSaved(
            @RequestParam String userId,
            @RequestParam String postId) {
        try {
            boolean isSaved = savedPostService.isPostSaved(userId, postId);
            return ResponseEntity.ok(Map.of("saved", isSaved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getSavedPostCount(@RequestParam String userId) {
        try {
            long count = savedPostService.getSavedPostCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}