package com.myproject.backend.dto;

import com.myproject.backend.model.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressUpdateDTO {
    private String id; // ObjectId.toString()
    private String name;
    private String issuingOrganization;
    private MonthYearDTO issueDate;
    private MonthYearDTO expireDate;
    private String credentialId;
    private String credentialUrl;
    private String mediaUrl;
    private List<Skill> skills;
}
