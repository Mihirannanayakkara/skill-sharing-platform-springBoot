package com.myproject.backend.controller;

import com.myproject.backend.model.MediaModel;
import com.myproject.backend.repository.MediaRepo;
import com.myproject.backend.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.myproject.backend.dto.ShareRequestDTO;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaRepo mediaRepository;

    @Autowired
    private MediaService mediaService;

    /* CREATE */
    @PostMapping("/post")
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


    /* READ ALL */
    @GetMapping("/getAll")
    public List<MediaModel> getAllPosts() {
        return mediaService.getAllPosts();
    }

    /* READ ONE */
    @GetMapping("/getpost/{id}")
    public ResponseEntity<MediaModel> getPost(@PathVariable String id) {
        return mediaService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/posts/{id}")
    public ResponseEntity<MediaModel> updatePost(
            @PathVariable String id,
            @RequestParam("description") String description,
            @RequestParam(value = "mediaFiles", required = false) MultipartFile[] mediaFiles,
            @RequestParam("isVideo") boolean isVideo
    ) throws IOException {
        MediaModel updatedPost = mediaService.updatePost(id, description, mediaFiles, isVideo);
        return ResponseEntity.ok(updatedPost);
    }

    /* DELETE */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        mediaService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Fetch posts for a specific user
    @GetMapping("/user/{userId}")
    public List<MediaModel> getPostsByUser(@PathVariable String userId) {
        return mediaService.getPostsByUserId(userId);
    }

    @PostMapping("/share")
    public ResponseEntity<?> sharePost(@RequestBody ShareRequestDTO request) {
        try {
            mediaService.sharePost(request.getPostId(), request.getFromUserId(), request.getToUserId());
            return ResponseEntity.ok("Post shared successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to share post: " + e.getMessage());
        }
    }


}