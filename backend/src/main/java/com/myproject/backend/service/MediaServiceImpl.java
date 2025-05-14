package com.myproject.backend.service;

import com.myproject.backend.model.MediaModel;
import com.myproject.backend.repository.MediaRepo;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.myproject.backend.repository.UserRepository;
import com.myproject.backend.model.User;


import java.io.IOException;
import java.util.*;

@Service
public class MediaServiceImpl implements MediaService {

    @Value("paf-it-c136a.firebasestorage.app")
    private String bucketName;

    @Autowired
    private UserRepository userRepository;  // ✅ Inject UserRepository to check users


    @Autowired
    private MediaRepo mediaRepository;

    @Override
    public MediaModel createPost(String userId, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException {

        try {
            // ✅ Validate user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("Invalid user ID. User does not exist.");
            }

            MediaModel mediaModel = new MediaModel();
            mediaModel.setUserId(userId); // ✅ Set userId here
            mediaModel.setDescription(description);
            mediaModel.setCreatedAt(new Date());

            if (isVideo) {
                validateVideo(mediaFiles[0]);
                String videoUrl = uploadToFirebase(mediaFiles[0], "videos");
                mediaModel.setVideoUrl(videoUrl);
                mediaModel.setMediaType(MediaModel.MediaType.VIDEO);
            } else {
                validateImages(mediaFiles);
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : mediaFiles) {
                    String imageUrl = uploadToFirebase(file, "images");
                    imageUrls.add(imageUrl);
                }
                mediaModel.setImageUrls(imageUrls);
                mediaModel.setMediaType(MediaModel.MediaType.IMAGE);
            }

            return mediaRepository.save(mediaModel);

        } catch (IOException e) {
            throw new IOException("Failed to upload media to Firebase: " + e.getMessage());
        }
    }


    private void validateVideo(MultipartFile file) throws IllegalArgumentException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Video file is empty");
        }
        if (file.getSize() > 30 * 1024 * 1024) { // 30MB limit
            throw new IllegalArgumentException("Video must be under 30MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new IllegalArgumentException("Invalid video format");
        }
    }

    private void validateImages(MultipartFile[] files) throws IllegalArgumentException {
        if (files == null || files.length == 0 || files.length > 3) {
            throw new IllegalArgumentException("You must upload 1 to 3 images");
        }
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("One or more image files are empty");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Invalid image format");
            }
        }
    }

    private String uploadToFirebase(MultipartFile file, String folder) throws IOException {
        Bucket bucket = StorageClient.getInstance().bucket(bucketName);
        String fileName = String.format("%s/%s_%s",
                folder,
                UUID.randomUUID(),
                file.getOriginalFilename());

        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());

        // Generate download URL that works directly in browsers
        return String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucketName,
                fileName.replace("/", "%2F"));
    }

    @Override
    public List<MediaModel> getAllPosts() {
        return mediaRepository.findAll();
    }

    @Override
    public Optional<MediaModel> getPostById(String id) {
        return mediaRepository.findById(id);
    }

    @Override
    public void deletePost(String id) {
        Optional<MediaModel> postOptional = mediaRepository.findById(id);

        if (postOptional.isPresent()) {
            MediaModel post = postOptional.get();
            Bucket bucket = StorageClient.getInstance().bucket(bucketName);

            // 🔥 1. Delete images from Firebase Storage (if images exist)
            if (post.getImageUrls() != null) {
                for (String imageUrl : post.getImageUrls()) {
                    String filePath = extractFilePathFromUrl(imageUrl);
                    bucket.get(filePath).delete();
                }
            }

            // 🔥 2. Delete video from Firebase Storage (if exists)
            if (post.getVideoUrl() != null) {
                String filePath = extractFilePathFromUrl(post.getVideoUrl());
                bucket.get(filePath).delete();
            }

            // 🔥 3. Finally, delete the post from MongoDB
            mediaRepository.deleteById(id);
        }
    }

    @Override
    public MediaModel updatePost(String id, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException {
        Optional<MediaModel> optionalPost = mediaRepository.findById(id);
        if (optionalPost.isEmpty()) {
            throw new NoSuchElementException("Post not found with ID: " + id);
        }

        MediaModel post = optionalPost.get();

        // ✅ Always update description
        post.setDescription(description);

        // ✅ Only update media if new files are provided
        if (mediaFiles != null && mediaFiles.length > 0) {
            // 🔁 Delete old media
            Bucket bucket = StorageClient.getInstance().bucket(bucketName);
            if (post.getMediaType() == MediaModel.MediaType.IMAGE && post.getImageUrls() != null) {
                for (String imageUrl : post.getImageUrls()) {
                    String filePath = extractFilePathFromUrl(imageUrl);
                    bucket.get(filePath).delete();
                }
            } else if (post.getMediaType() == MediaModel.MediaType.VIDEO && post.getVideoUrl() != null) {
                String filePath = extractFilePathFromUrl(post.getVideoUrl());
                bucket.get(filePath).delete();
            }

            // 🔁 Upload new media
            if (isVideo) {
                validateVideo(mediaFiles[0]);
                String videoUrl = uploadToFirebase(mediaFiles[0], "videos");
                post.setVideoUrl(videoUrl);
                post.setImageUrls(null);  // Clear old images
                post.setMediaType(MediaModel.MediaType.VIDEO);
            } else {
                validateImages(mediaFiles);
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : mediaFiles) {
                    String imageUrl = uploadToFirebase(file, "images");
                    imageUrls.add(imageUrl);
                }
                post.setImageUrls(imageUrls);
                post.setVideoUrl(null); // Clear old video
                post.setMediaType(MediaModel.MediaType.IMAGE);
            }
        }

        return mediaRepository.save(post);
    }

    @Override
    public List<MediaModel> getPostsByUserId(String userId) {
        return mediaRepository.findByUserId(userId);
    }

    private String extractFilePathFromUrl(String url) {
        return url.substring(url.indexOf("/o/") + 3, url.indexOf("?alt=media")).replace("%2F", "/");
    }

    @Override
    public void sharePost(String originalPostId, String fromUserId, String toUserId) {
        MediaModel originalPost = mediaRepository.findById(originalPostId)
                .orElseThrow(() -> new RuntimeException("Original post not found"));

        MediaModel sharedPost = new MediaModel();
        sharedPost.setUserId(toUserId); // ❗ shared to another user's wall
        sharedPost.setDescription(originalPost.getDescription());
        sharedPost.setImageUrls(originalPost.getImageUrls());
        sharedPost.setVideoUrl(originalPost.getVideoUrl());
        sharedPost.setMediaType(originalPost.getMediaType());
        sharedPost.setCreatedAt(new Date());

        // 👇 Add a small "sharedBy" info at the beginning
        sharedPost.setDescription("[Shared by User ID: " + fromUserId + "] " + originalPost.getDescription());

        mediaRepository.save(sharedPost);
    }

}