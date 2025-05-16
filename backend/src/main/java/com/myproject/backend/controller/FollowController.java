package com.myproject.backend.controller;

import com.myproject.backend.model.Follow;
import com.myproject.backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:5173")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerId}/{followingId}")
    public ResponseEntity<Follow> followUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        return ResponseEntity.ok(followService.followUser(followerId, followingId));
    }

    @DeleteMapping("/{followerId}/{followingId}")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        followService.unfollowUser(followerId, followingId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{followerId}/{followingId}")
    public ResponseEntity<Boolean> checkFollowStatus(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        return ResponseEntity.ok(followService.isFollowing(followerId, followingId));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Long>> getFollowStats(
            @PathVariable String userId) {
        return ResponseEntity.ok(Map.of(
                "followers", followService.getFollowersCount(userId),
                "following", followService.getFollowingCount(userId)
        ));
    }
}