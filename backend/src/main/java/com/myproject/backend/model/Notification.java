package com.myproject.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;

    private String recipientId;

    private String senderId;
    private String senderName;    // Add sender's name
    private String senderImageUrl; // Add sender's image URL

    private String type; // LIKE, COMMENT, FOLLOW

    private String content;

    private boolean isRead;

    private LocalDateTime createdAt;

    private String postId; // Optional, for like and comment notifications

    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}