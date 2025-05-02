package com.paf_project.learning_platform.controller;

import com.paf_project.learning_platform.entity.Skill;
import com.paf_project.learning_platform.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    //get all skills
    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    //add skills to a pariticular user
    @PostMapping("/{userId}")
    public ResponseEntity<List<String>> addSkillToUser(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
    
        String skillName = request.get("skillName");
        List<String> updatedSkillNames = skillService.addSkillToUserAndReturnSkillNames(userId, skillName);
        return ResponseEntity.ok(updatedSkillNames);
    }

    //Get particular users skills 
    @GetMapping("/{userId}")
    public ResponseEntity<List<Skill>> getUserSkills(@PathVariable String userId) {
        List<Skill> skills = skillService.getUserSkills(userId);
        return ResponseEntity.ok(skills);
    }

    //delete particular user skill
    @DeleteMapping("/{userId}/{skillId}")
    public ResponseEntity<String> removeSkillFromUser(
            @PathVariable String userId,
            @PathVariable String skillId) {

        String result = skillService.removeSkillFromUser(userId, skillId);
        return ResponseEntity.ok(result);
    }
}