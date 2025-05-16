package com.myproject.backend.controller;

import com.myproject.backend.model.CommentLike;
import com.myproject.backend.service.CommentLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment-likes")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentLikeController {
    @Autowired
    private CommentLikeService commentLikeService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(
            @RequestParam String commentId,
            @RequestParam String userId) {
        try {
            CommentLike like = commentLikeService.toggleLike(commentId, userId);
            return ResponseEntity.ok(like);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<?> getLikesByCommentId(@PathVariable String commentId) {
        try {
            List<CommentLike> likes = commentLikeService.getLikesByCommentId(commentId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count/{commentId}")
    public ResponseEntity<?> getLikeCount(@PathVariable String commentId) {
        try {
            long count = commentLikeService.getLikeCount(commentId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getLikeStatus(
            @RequestParam String commentId,
            @RequestParam String userId) {
        try {
            boolean hasLiked = commentLikeService.hasUserLiked(commentId, userId);
            return ResponseEntity.ok(Map.of("hasLiked", hasLiked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}