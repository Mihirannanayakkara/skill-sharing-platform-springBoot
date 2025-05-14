package com.myproject.backend.service;

import com.myproject.backend.model.MediaModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface MediaService {
    MediaModel createPost(String userId, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException;

    List<MediaModel> getAllPosts();

    Optional<MediaModel> getPostById(String id);

    void deletePost(String id);

    MediaModel updatePost(String id, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException;

    List<MediaModel> getPostsByUserId(String userId);

    void sharePost(String originalPostId, String fromUserId, String toUserId);






}


