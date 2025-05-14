package com.myproject.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "learningplans")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LearningPlan {
    @Id
    private String id;

    private String userId;       // Track who created it

    // Step 1 - Basic Info
    private String title;
    private String background;
    private String scope;

    // Step 2 - Skills and Courses
    private List<String> skills;
    private List<String> relatedCourseIds;  // enrolled course ids

    // Step 3 - Topics
    private List<String> topics;

    // Step 4 - Tasks
    private List<Task> tasks;

    // Step 5 - Timeline
    private String startDate;
    private String endDate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Task {
        private String taskName;
        private String taskDescription;
        private boolean completed; // for ticking
    }
}
