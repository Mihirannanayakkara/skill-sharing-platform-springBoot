package com.myproject.backend.controller;

import com.myproject.backend.model.LearningPlan;

import com.myproject.backend.service.LearningPlanService;
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
