package com.paf.Learningplatform.service;

import com.paf.Learningplatform.model.LearningPlan;
import com.paf.Learningplatform.model.Task; // Add import for Task
import com.paf.Learningplatform.repository.LearningPlanRepository;
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

    // Add a manual task to a learning plan
    public LearningPlan addManualTask(String id, String taskName, String taskDescription) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.getTasks().add(new Task(taskName, taskDescription, false)); // Add new task
        return learningPlanRepository.save(plan);
    }

    // Add AI-generated tasks
    public LearningPlan addAiGeneratedTasks(String id, List<Task> aiTasks) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.getTasks().addAll(aiTasks); // Add AI-generated tasks
        return learningPlanRepository.save(plan);
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
        plan.setTasks(updated.getTasks()); // Add tasks update
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
