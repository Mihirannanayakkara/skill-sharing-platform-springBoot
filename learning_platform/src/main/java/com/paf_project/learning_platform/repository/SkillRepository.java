package com.paf_project.learning_platform.repository;

import com.paf_project.learning_platform.entity.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SkillRepository extends MongoRepository<Skill, String> {
    Optional<Skill> findByName(String name);
}
