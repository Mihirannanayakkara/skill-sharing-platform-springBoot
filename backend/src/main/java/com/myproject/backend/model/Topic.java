package com.paf.Learningplatform.model;

import lombok.Data;

@Data
public class Topic {
    private String name;
    private String resourceLink;
    private String deadline;
    private boolean completed;
}
