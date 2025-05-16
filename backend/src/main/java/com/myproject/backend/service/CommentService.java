package com.myproject.backend.service;

import com.myproject.backend.model.Comment;
import com.myproject.backend.repository.CommentRepo;
import com.myproject.backend.repository.UserRepository;
import com.myproject.backend.repository.MediaRepo;
import com.myproject.backend.model.User;
import com.myproject.backend.model.MediaModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MediaRepo mediaRepo;

    @Autowired
    private NotificationService notificationService;

    public Comment createComment(String postId, String userId, String content) {
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if post exists and get its owner
        MediaModel post = mediaRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setUserName(user.getName());
        comment.setUserImage(user.getImageUrl());
        comment.setContent(content);
        Comment savedComment = commentRepo.save(comment);

        // Create notification for the post owner if it's not the same user
        if (!post.getUserId().equals(userId)) {
            notificationService.createNotification(
                    post.getUserId(),
                    userId,
                    "COMMENT",
                    user.getName() + " commented on your post",
                    postId
            );
        }

        return savedComment;
    }

    public Comment updateComment(String commentId, String content) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        comment.setEdited(true);
        return commentRepo.save(comment);
    }

    public void deleteComment(String commentId) {
        commentRepo.deleteById(commentId);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepo.findByPostId(postId);
    }

    public long getCommentCount(String postId) {
        return commentRepo.countByPostId(postId);
    }
}