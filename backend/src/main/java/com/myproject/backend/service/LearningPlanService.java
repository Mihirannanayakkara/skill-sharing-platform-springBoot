package com.myproject.backend.service;

import com.myproject.backend.model.LearningPlan;
import com.myproject.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepo;

    public LearningPlan createPlan(LearningPlan plan) {
        return learningPlanRepo.save(plan);
    }

    public List<LearningPlan> getPlansByUser(String userId) {
        return learningPlanRepo.findByUserId(userId);
    }

    public Optional<LearningPlan> getPlanById(String id) {
        return learningPlanRepo.findById(id);
    }

    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        return learningPlanRepo.save(updatedPlan);
    }

    public void deletePlan(String id) {
        learningPlanRepo.deleteById(id);
    }
}
