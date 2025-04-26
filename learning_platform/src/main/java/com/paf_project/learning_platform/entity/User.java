package com.paf_project.learning_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    @NonNull
    private String username;

    @NonNull
    private String password;

    private String email;

    @DocumentReference
    private List<Skill> skills; 

    @DocumentReference
    private List<ProgressUpdate> progressUpdates; 
}