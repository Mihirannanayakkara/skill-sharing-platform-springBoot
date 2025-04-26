package com.paf_project.learning_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Skill {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    public Skill(String name) {
        this.name = name;
    }

    // // Override equals and hashCode based on name
    // @Override
    // public boolean equals(Object o) {
    //     if (this == o) return true;
    //     if (!(o instanceof Skill)) return false;
    //     Skill skill = (Skill) o;
    //     return name.equalsIgnoreCase(skill.name);
    // }

    // @Override
    // public int hashCode() {
    //     return name.toLowerCase().hashCode();
    // }
}
