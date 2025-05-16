package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "comment_replies")
public class CommentReply {
    @Id
    private String id;
    private String commentId;
    private String userId;
    private String userName;
    private String userImage;
    private String content;
    private Date createdAt = new Date();
    private boolean isEdited;
}