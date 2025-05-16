package com.myproject.backend.service;

import com.myproject.backend.model.Follow;
import com.myproject.backend.model.User;
import com.myproject.backend.repository.FollowRepository;
import com.myproject.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Follow followUser(String followerId, String followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new IllegalStateException("Already following this user");
        }

        Follow follow = new Follow(followerId, followingId);
        Follow savedFollow = followRepository.save(follow);

        // Create notification for the user being followed
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));

        notificationService.createNotification(
                followingId,
                followerId,
                "FOLLOW",
                follower.getName() + " started following you",
                null
        );

        return savedFollow;
    }

    public void unfollowUser(String followerId, String followingId) {
        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new IllegalStateException("Not following this user"));
        followRepository.delete(follow);
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public long getFollowersCount(String userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long getFollowingCount(String userId) {
        return followRepository.countByFollowerId(userId);
    }
}