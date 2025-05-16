package com.myproject.backend.controller;

import com.myproject.backend.model.Comment;
import com.myproject.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> createComment(
            @RequestParam String postId,
            @RequestParam String userId,
            @RequestBody String content) {
        return ResponseEntity.ok(commentService.createComment(postId, userId, content));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @RequestBody String content) {
        return ResponseEntity.ok(commentService.updateComment(commentId, content));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable String postId) {
        return ResponseEntity.ok(Map.of("count", commentService.getCommentCount(postId)));
    }
}