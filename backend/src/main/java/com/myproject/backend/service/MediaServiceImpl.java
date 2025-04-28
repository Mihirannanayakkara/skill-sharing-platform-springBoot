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

import java.io.IOException;
import java.util.*;

@Service
public class MediaServiceImpl implements MediaService {

    @Value("paf-it-c136a.firebasestorage.app")
    private String bucketName;

    @Autowired
    private MediaRepo mediaRepository;

    @Override
    public MediaModel createPost(String userId, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException {

        try {
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

            return  mediaRepository.save(mediaModel);

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
}
