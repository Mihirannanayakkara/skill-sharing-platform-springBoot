package com.myproject.backend.service;

import com.myproject.backend.model.CommentLike;
import com.myproject.backend.model.User;
import com.myproject.backend.repository.CommentLikeRepo;
import com.myproject.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentLikeService {
    @Autowired
    private CommentLikeRepo commentLikeRepo;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public synchronized CommentLike toggleLike(String commentId, String userId) {
        Optional<CommentLike> existingLike = commentLikeRepo.findByCommentIdAndUserId(commentId, userId);

        if (existingLike.isPresent()) {
            commentLikeRepo.delete(existingLike.get());
            return null;
        }

        String userName = userRepository.findById(userId)
                .map(User::getName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentLike like = new CommentLike();
        like.setCommentId(commentId);
        like.setUserId(userId);
        like.setUserName(userName);
        return commentLikeRepo.save(like);
    }

    public List<CommentLike> getLikesByCommentId(String commentId) {
        return commentLikeRepo.findByCommentId(commentId);
    }

    public long getLikeCount(String commentId) {
        return commentLikeRepo.countByCommentId(commentId);
    }

    public boolean hasUserLiked(String commentId, String userId) {
        return commentLikeRepo.findByCommentIdAndUserId(commentId, userId).isPresent();
    }
}