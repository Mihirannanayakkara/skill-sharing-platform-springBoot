package com.paf_project.learning_platform.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Document(collection = "progress")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressUpdate {

    @Id
    private ObjectId id; 

    private String name;
    private String issuingOrganization;
    private MonthYear issueDate;
    private MonthYear expireDate; 
    private String credentialId;
    private String credentialUrl;
    private String mediaUrl;

    @JsonIgnore
    @DocumentReference
    private User userId;


    @DBRef
    private List<Skill> skills;  

    // Getter and Setter for skills
    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public User getUser() {
        return userId;
    }
    public void setUser(User user) {
        this.userId = user;
    }

}
