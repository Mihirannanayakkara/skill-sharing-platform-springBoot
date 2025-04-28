package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "posts")
public class MediaModel {
    @Id
    private String id;
    private String userId; // <-- Add this line to know who created the post

    private String description;
    private List<String> imageUrls; // 1-3 images
    private String videoUrl; // 1 video (null if images exist)
    private Date createdAt = new Date();

    public enum MediaType { IMAGE, VIDEO }
    private MediaType mediaType;



}