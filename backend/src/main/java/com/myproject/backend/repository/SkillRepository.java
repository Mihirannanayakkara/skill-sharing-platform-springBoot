package com.myproject.backend.repository;

import com.myproject.backend.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SkillRepository extends MongoRepository<Skill, String> {
    List<Skill> findByUserId(String userId);
}
