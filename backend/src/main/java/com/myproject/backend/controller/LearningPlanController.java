package com.myproject.backend.controller;

import com.myproject.backend.model.LearningPlan;
import com.myproject.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningplans")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return learningPlanService.createPlan(plan);
    }

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getPlansByUser(@PathVariable String userId) {
        return learningPlanService.getPlansByUser(userId);
    }

    @GetMapping("/{id}")
    public Optional<LearningPlan> getPlanById(@PathVariable String id) {
        return learningPlanService.getPlanById(id);
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan updatedPlan) {
        return learningPlanService.updatePlan(id, updatedPlan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable String id) {
        learningPlanService.deletePlan(id);
    }

    
}
