package com.myproject.backend.service;

import com.myproject.backend.model.LearningPlan;

import com.myproject.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private LearningPlanRepository repository;

    // Create a learning plan
    public LearningPlan create(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    // Get learning plans by user ID
    public List<LearningPlan> getByUser(String userId) {
        return repository.findByUserId(userId);
    }

    // Update a learning plan
    public LearningPlan update(String id, LearningPlan updated) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.setTitle(updated.getTitle());
        plan.setBackground(updated.getBackground());
        plan.setScope(updated.getScope());
        plan.setResourceLink(updated.getResourceLink());
        plan.setSkills(updated.getSkills());
        plan.setSuggestedCourses(updated.getSuggestedCourses());
        plan.setDeadlineEnabled(updated.isDeadlineEnabled());
        plan.setStartDate(updated.getStartDate());
        plan.setEndDate(updated.getEndDate());
        plan.setTopics(updated.getTopics());

        return learningPlanRepository.save(plan);
    }

    // Delete a learning plan
    public void delete(String id) {
        learningPlanRepository.deleteById(id);
    }

    // Method to get a learning plan by its ID
    public LearningPlan getById(String id) {
        Optional<LearningPlan> plan = repository.findById(id);
        return plan.orElse(null); // Return the plan if found, or null if not found
    }
}
