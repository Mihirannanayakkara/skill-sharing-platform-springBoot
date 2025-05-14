package com.myproject.backend.service;

import com.myproject.backend.model.MediaModel;
import com.myproject.backend.model.SharedPost;
import com.myproject.backend.model.User;
import com.myproject.backend.repository.MediaRepo;
import com.myproject.backend.repository.SharedPostRepo;
import com.myproject.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SharedPostService {

    @Autowired
    private SharedPostRepo sharedPostRepo;

    @Autowired
    private MediaRepo mediaRepo;

    @Autowired
    private UserRepository userRepository;

    public SharedPost sharePostToUser(String originalPostId, String sharedByUserId, String sharedToUserId) {
        MediaModel originalPost = mediaRepo.findById(originalPostId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User sharer = userRepository.findById(sharedByUserId)
                .orElseThrow(() -> new RuntimeException("Sharer user not found"));

        User receiver = userRepository.findById(sharedToUserId)
                .orElseThrow(() -> new RuntimeException("Receiver user not found"));

        SharedPost sharedPost = new SharedPost();
        sharedPost.setOriginalPostId(originalPost.getId());
        sharedPost.setSharedByUserId(sharer.getId());
        sharedPost.setSharedByUserName(sharer.getName());
        sharedPost.setSharedByUserImage(sharer.getImageUrl());
        sharedPost.setSharedToUserId(receiver.getId());
        sharedPost.setSharedToUserName(receiver.getName());
        sharedPost.setDescription(originalPost.getDescription());
        sharedPost.setImageUrls(originalPost.getImageUrls());
        sharedPost.setVideoUrl(originalPost.getVideoUrl());
        sharedPost.setMediaType(originalPost.getMediaType() == MediaModel.MediaType.IMAGE
                ? SharedPost.MediaType.IMAGE
                : SharedPost.MediaType.VIDEO);

        return sharedPostRepo.save(sharedPost);
    }

    public List<SharedPost> getSharedPostsForUser(String userId) {
        return sharedPostRepo.findBySharedToUserId(userId);
    }
}
