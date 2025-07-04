package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "comment_likes")
public class CommentLike {
    @Id
    private String id;
    private String commentId;
    private String userId;
    private String userName;
    private Date createdAt = new Date();
}