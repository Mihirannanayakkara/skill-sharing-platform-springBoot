package com.myproject.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String name;
    private String description;
    private String skill;
    private String resourceLink;
}
