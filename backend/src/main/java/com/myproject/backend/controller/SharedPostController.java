package com.myproject.backend.controller;

import com.myproject.backend.model.SharedPost;
import com.myproject.backend.service.SharedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shared")
public class SharedPostController {

    @Autowired
    private SharedPostService sharedPostService;

    @PostMapping("/share-to-user")
    public SharedPost sharePostToUser(
            @RequestParam String postId,
            @RequestParam String sharedByUserId,
            @RequestParam String sharedToUserId
    ) {
        return sharedPostService.sharePostToUser(postId, sharedByUserId, sharedToUserId);
    }

    @GetMapping("/my-shared")
    public List<SharedPost> getSharedPostsForUser(@RequestParam String userId) {
        return sharedPostService.getSharedPostsForUser(userId);
    }
}
