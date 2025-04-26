package com.paf.Learningplatform.model;

import lombok.Data;

@Data
public class Task {
    private String name;
    private String description;
    private boolean completed;

    // Default no-args constructor (required for JSON deserialization)
    public Task() {
        this.completed = false;
    }

    // Constructor with all fields
    public Task(String name, String description, boolean completed) {
        this.name = name;
        this.description = description;
        this.completed = completed;
    }

    // Constructor with just name and description (defaults completed to false)
    public Task(String name, String description) {
        this.name = name;
        this.description = description;
        this.completed = false;
    }
}
