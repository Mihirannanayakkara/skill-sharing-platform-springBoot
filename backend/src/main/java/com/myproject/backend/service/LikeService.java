package com.myproject.backend.service;

import com.myproject.backend.model.Like;
import com.myproject.backend.repository.LikeRepo;
import com.myproject.backend.repository.UserRepository;
import com.myproject.backend.repository.MediaRepo;
import com.myproject.backend.model.User;
import com.myproject.backend.model.MediaModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class LikeService {
    @Autowired
    private LikeRepo likeRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MediaRepo mediaRepo;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public synchronized Like toggleLike(String postId, String userId) {
        try {
            // Check if user has already liked the post
            Optional<Like> existingLike = likeRepo.findByPostIdAndUserId(postId, userId);

            if (existingLike.isPresent()) {
                // If like exists, remove it (unlike)
                likeRepo.delete(existingLike.get());
                return null;
            }

            // Check if user exists - only fetch name as it's all we need
            String userName = userRepository.findById(userId)
                    .map(User::getName)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if post exists and get only userId
            String postOwnerId = mediaRepo.findById(postId)
                    .map(MediaModel::getUserId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            // Create new like with minimal data
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);
            like.setUserName(userName);
            Like savedLike = likeRepo.save(like);

            // Create notification only if needed
            if (!postOwnerId.equals(userId)) {
                notificationService.createNotification(
                        postOwnerId,
                        userId,
                        "LIKE",
                        userName + " liked your post",
                        postId
                );
            }

            return savedLike;
        } catch (Exception e) {
            throw new RuntimeException("Error toggling like: " + e.getMessage());
        }
    }

    public List<Like> getLikesByPostId(String postId) {
        try {
            return likeRepo.findByPostId(postId);
        } catch (Exception e) {
            throw new RuntimeException("Error getting likes by post ID: " + e.getMessage());
        }
    }

    public long getLikeCount(String postId) {
        try {
            return likeRepo.countByPostId(postId);
        } catch (Exception e) {
            throw new RuntimeException("Error getting like count: " + e.getMessage());
        }
    }

    public boolean hasUserLiked(String postId, String userId) {
        try {
            if (postId == null || postId.trim().isEmpty() || userId == null || userId.trim().isEmpty()) {
                return false;
            }

            // Simplified validation
            if (!postId.matches("^[0-9a-fA-F]{24}$") || !userId.matches("^[0-9a-fA-F]{24}$")) {
                return false;
            }

            return likeRepo.findByPostIdAndUserId(postId, userId).isPresent();
        } catch (Exception e) {
            return false;
        }
    }
}