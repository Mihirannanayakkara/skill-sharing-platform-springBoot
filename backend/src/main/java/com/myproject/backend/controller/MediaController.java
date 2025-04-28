package com.myproject.backend.controller;

import com.myproject.backend.model.MediaModel;
import com.myproject.backend.repository.MediaRepo;
import com.myproject.backend.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/posts")
public class MediaController {

    @Autowired
    private MediaRepo mediaRepository;

    @Autowired
    private MediaService mediaService;

    /* CREATE */
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam String userId,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile[] mediaFiles,
            @RequestParam boolean isVideo) {

        try {
            // ← now call your service with the four parameters
            MediaModel post = mediaService.createPost(userId, description, mediaFiles, isVideo);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + e.getMessage());
        }
    }
}