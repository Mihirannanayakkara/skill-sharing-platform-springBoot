package com.paf_project.learning_platform.service;

import com.paf_project.learning_platform.entity.Skill;
import com.paf_project.learning_platform.entity.User;
import com.paf_project.learning_platform.repository.SkillRepository;
import com.paf_project.learning_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Add a skill to a specific user and return updated skills
    public List<Skill> addSkillToUserAndReturnSkills(String userId, String skillName) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
        throw new RuntimeException("User not found."); 
        }

        User user = optionalUser.get();

        // Find or create skill by name
        Skill skill = skillRepository.findByName(skillName)
            .orElseGet(() -> skillRepository.save(new Skill(skillName)));

        // Initialize user's skill list if null
        if (user.getSkills() == null) {
            user.setSkills(new ArrayList<>());
        }

        // Check if user already has this skill
        boolean alreadyHasSkill = user.getSkills().stream()
            .anyMatch(s -> s.getName().equalsIgnoreCase(skill.getName()));

        if (!alreadyHasSkill) {
            user.getSkills().add(skill);
            userRepository.save(user);
        }

        return user.getSkills(); // Return the updated list of skills
        }


    public List<String> addSkillToUserAndReturnSkillNames(String userId, String skillName) {
        List<Skill> skills = addSkillToUserAndReturnSkills(userId, skillName);
        return skills.stream()
                 .map(Skill::getName)
                 .collect(Collectors.toList());
    }


    // Get all skills for a specific user
    public List<Skill> getUserSkills(String userId) {
        return userRepository.findById(userId)
                .map(User::getSkills)
                .orElse(Collections.emptyList());
    }

    // Optional: Remove a skill from user's list
    public String removeSkillFromUser(String userId, String skillId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) return "User not found.";

        User user = optionalUser.get();

        if (user.getSkills() == null) return "User has no skills.";

        boolean removed = user.getSkills().removeIf(skill -> skill.getId().equals(skillId));

        if (removed) {
            userRepository.save(user);
            return "Skill removed from user.";
        } else {
            return "Skill not found for user.";
        }
    }



    public List<Skill> processSkillsForProgressUpdate(String userId, List<Skill> incomingSkills) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = optionalUser.get();

        if (user.getSkills() == null) {
            user.setSkills(new ArrayList<>());
        }

        List<Skill> processedSkills = new ArrayList<>();

        for (Skill skill : incomingSkills) {
            Skill dbSkill = skillRepository.findByName(skill.getName())
                .orElseGet(() -> skillRepository.save(new Skill(skill.getName()))); // Save if not exists

            // Add to user if not already there
            boolean alreadyInUser = user.getSkills().stream()
                .anyMatch(s -> s.getName().equalsIgnoreCase(dbSkill.getName()));

            if (!alreadyInUser) {
                user.getSkills().add(dbSkill);
            }

            processedSkills.add(dbSkill);
        }

        userRepository.save(user); // Save updated user

        return processedSkills; // Return for ProgressUpdate use
    }


    public Skill getSkillByNameOrCreate(String name) {
        return skillRepository.findByName(name)
                .orElseGet(() -> skillRepository.save(new Skill(name)));
    }
    
}