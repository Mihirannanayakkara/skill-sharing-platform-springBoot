package com.myproject.backend.controller;

import com.myproject.backend.model.Skill;
import com.myproject.backend.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        return skillService.addSkill(skill);
    }

    @GetMapping("/{userId}")
    public List<Skill> getUserSkills(@PathVariable String userId) {
        return skillService.getUserSkills(userId);
    }
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable String id) {
    skillService.deleteSkill(id);
}

}
