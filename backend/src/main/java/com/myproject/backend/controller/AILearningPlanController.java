// src/main/java/com/myproject/backend/controller/LearningPlanController.java
package com.myproject.backend.controller;

import com.myproject.backend.model.LearningPlan;
import com.myproject.backend.service.AIBasedLearningPlanService;
import com.myproject.backend.service.AIBasedLearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ailearningplans")
public class AILearningPlanController {

    @Autowired
    private AIBasedLearningPlanService geminiService;

    @PostMapping("/generate-tasks")
    public LearningPlan generateTasks(@RequestBody LearningPlan plan) {
        plan.setTasks(geminiService.generateTasksForPlan(plan));
        return plan;
    }
}
