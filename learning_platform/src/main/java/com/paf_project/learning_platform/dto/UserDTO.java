package com.paf_project.learning_platform.dto;

import com.paf_project.learning_platform.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private List<Skill> skills;
    private List<ProgressUpdateDTO> progressUpdates; // Custom DTO to avoid deep nesting
}
