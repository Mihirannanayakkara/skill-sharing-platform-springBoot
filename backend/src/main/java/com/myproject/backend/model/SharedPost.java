package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "sharedposts")
public class SharedPost {
    @Id
    private String id;

    private String originalPostId;
    private String sharedByUserId;
    private String sharedByUserName;
    private String sharedByUserImage;

    private String sharedToUserId;
    private String sharedToUserName;

    private String description;
    private List<String> imageUrls;
    private String videoUrl;
    private MediaType mediaType;
    private Date sharedAt = new Date();

    public enum MediaType { IMAGE, VIDEO }
}
