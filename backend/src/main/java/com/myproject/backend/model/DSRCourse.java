package com.myproject.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "courses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DSRCourse {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String skillLevel;
    private String language;
    private String duration;
    private String coverImageBase64;
    private String instructorName;

    private List<Lesson> lessons;

    private String createdByUserId; // Admin who created the course

    private List<String> enrolledUserIds; // Users who enrolled
    private List<String> completedUserIds; // Users who completed

    // NEW: Track viewed lesson and downloaded resources per user
    private Map<String, Boolean> lessonViewedMap; // userId -> true
    private Map<String, List<String>> resourcesDownloadedMap; // userId -> list of resource names

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Lesson {
        private String lessonTitle;
        private String notes;
        private List<Resource> resources;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Resource {
        private String name;
        private String base64Content;
        private String type; // "pdf" or "image"
    }
}
