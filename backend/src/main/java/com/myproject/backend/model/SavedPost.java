package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "savedposts")
public class SavedPost {
    @Id
    private String id;
    private String userId;
    private String postId;
    private Date savedAt = new Date();
}