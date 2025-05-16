package com.myproject.backend.controller;

import com.myproject.backend.model.Like;
import com.myproject.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interactions")
@CrossOrigin(origins = "http://localhost:5173")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(
            @RequestParam String postId,
            @RequestParam String userId) {
        try {
            Like like = likeService.toggleLike(postId, userId);
            return ResponseEntity.ok(like);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPostId(@PathVariable String postId) {
        try {
            List<Like> likes = likeService.getLikesByPostId(postId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<?> getLikeCount(@PathVariable String postId) {
        try {
            long count = likeService.getLikeCount(postId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> hasUserLiked(
            @RequestParam String postId,
            @RequestParam String userId) {
        try {
            boolean hasLiked = likeService.hasUserLiked(postId, userId);
            return ResponseEntity.ok(Map.of("hasLiked", hasLiked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}