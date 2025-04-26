package com.paf.Learningplatform.controller;

import com.paf.Learningplatform.model.LearningPlan;
import com.paf.Learningplatform.model.Task;
import com.paf.Learningplatform.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learningplans")
@CrossOrigin
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    // ✅ Fixed POST endpoint
    @PostMapping
    public ResponseEntity<?> createLearningPlan(@RequestBody LearningPlan plan) {
        return ResponseEntity.status(201).body(service.create(plan));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<LearningPlan>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> update(@PathVariable String id, @RequestBody LearningPlan plan) {
        return ResponseEntity.ok(service.update(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/addManualTask")
    public ResponseEntity<LearningPlan> addManualTask(
            @PathVariable String id,
            @RequestParam String taskName,
            @RequestParam String taskDescription) {
        LearningPlan updatedPlan = service.addManualTask(id, taskName, taskDescription);
        return ResponseEntity.ok(updatedPlan);
    }

    @PutMapping("/{id}/addAiGeneratedTasks")
    public ResponseEntity<LearningPlan> addAiGeneratedTasks(@PathVariable String id, @RequestBody List<Task> aiTasks) {
        LearningPlan updatedPlan = service.addAiGeneratedTasks(id, aiTasks);
        return ResponseEntity.ok(updatedPlan);
    }

    // Endpoint to get details of a specific learning plan by ID
    @GetMapping("/plan/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable String id) {
        LearningPlan plan = service.getById(id);
        if (plan != null) {
            return ResponseEntity.ok(plan);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
