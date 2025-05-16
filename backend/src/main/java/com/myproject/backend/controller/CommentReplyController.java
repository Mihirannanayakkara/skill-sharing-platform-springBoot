package com.myproject.backend.controller;

import com.myproject.backend.model.CommentReply;
import com.myproject.backend.service.CommentReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment-replies")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentReplyController {
    @Autowired
    private CommentReplyService commentReplyService;

    @PostMapping
    public ResponseEntity<CommentReply> createReply(
            @RequestParam String commentId,
            @RequestParam String userId,
            @RequestBody String content) {
        return ResponseEntity.ok(commentReplyService.createReply(commentId, userId, content));
    }

    @PutMapping("/{replyId}")
    public ResponseEntity<CommentReply> updateReply(
            @PathVariable String replyId,
            @RequestBody String content) {
        return ResponseEntity.ok(commentReplyService.updateReply(replyId, content));
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable String replyId) {
        commentReplyService.deleteReply(replyId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<CommentReply>> getRepliesByCommentId(@PathVariable String commentId) {
        return ResponseEntity.ok(commentReplyService.getRepliesByCommentId(commentId));
    }

    @GetMapping("/count/{commentId}")
    public ResponseEntity<Map<String, Long>> getReplyCount(@PathVariable String commentId) {
        return ResponseEntity.ok(Map.of("count", commentReplyService.getReplyCount(commentId)));
    }
}