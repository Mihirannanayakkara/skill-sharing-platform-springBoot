package com.myproject.backend.service;

import com.myproject.backend.model.MediaModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MediaService {
    MediaModel createPost(String userId, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException;
}


