package com.paf_project.learning_platform.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.paf_project.learning_platform.dto.MonthYearDTO;
import com.paf_project.learning_platform.dto.ProgressUpdateDTO;
import com.paf_project.learning_platform.entity.MonthYear;
import com.paf_project.learning_platform.entity.ProgressUpdate;
import com.paf_project.learning_platform.entity.Skill;
import com.paf_project.learning_platform.entity.User;
import com.paf_project.learning_platform.repository.ProgressUpdateRepository;
import com.paf_project.learning_platform.repository.SkillRepository;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;


@Service
public class ProgressUpdateService {
    @Autowired 
    private ProgressUpdateRepository progressUpdateRepository;


    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SkillService skillService;

    @Autowired
    private SkillRepository skillRepository;
    

    public ProgressUpdateDTO convertToDTO(ProgressUpdate progressUpdate) {
        ProgressUpdateDTO dto = new ProgressUpdateDTO();
        dto.setId(progressUpdate.getId().toString());
        dto.setName(progressUpdate.getName());
        dto.setIssuingOrganization(progressUpdate.getIssuingOrganization());
        dto.setIssueDate(new MonthYearDTO(
            progressUpdate.getIssueDate().getMonth(),
            progressUpdate.getIssueDate().getYear()
        ));
        dto.setExpireDate(new MonthYearDTO(
            progressUpdate.getExpireDate().getMonth(),
            progressUpdate.getExpireDate().getYear()
        ));
        dto.setCredentialId(progressUpdate.getCredentialId());
        dto.setCredentialUrl(progressUpdate.getCredentialUrl());
        dto.setMediaUrl(progressUpdate.getMediaUrl());
        dto.setSkills(progressUpdate.getSkills());

    return dto;
    }


    public Optional<ProgressUpdateDTO> getProgressUpdateDTOById(ObjectId id) {
        return progressUpdateRepository.findById(id)
            .map(this::convertToDTO);
    }

    public List<ProgressUpdateDTO> getAllProgressUpdateDTOs() {
        return allProgressUpdates().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }


    public List<ProgressUpdateDTO> getProgressUpdatesByUserId(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
    
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
    
            List<ProgressUpdate> progressUpdates = user.getProgressUpdates();
    
            // Map to DTOs
            return progressUpdates.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }
    
    public List<ProgressUpdate> allProgressUpdates() {
        Query query = new Query();
        query.fields().exclude("userId.progressUpdates"); // Exclude nested reference to prevent infinite loop
        return mongoTemplate.find(query, ProgressUpdate.class);
    }
    

    public Optional<ProgressUpdate> singleProgressUpdate(ObjectId id){
        return progressUpdateRepository.findById(id);
    }

    public String createProgressUpdate(String userId, ProgressUpdateDTO dto) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Convert DTO to entity
            ProgressUpdate progressUpdate = new ProgressUpdate();
            progressUpdate.setName(dto.getName());
            progressUpdate.setIssuingOrganization(dto.getIssuingOrganization());
            progressUpdate.setIssueDate(new MonthYear(dto.getIssueDate().getMonth(), dto.getIssueDate().getYear()));
            progressUpdate.setExpireDate(new MonthYear(dto.getExpireDate().getMonth(), dto.getExpireDate().getYear()));
            progressUpdate.setCredentialId(dto.getCredentialId());
            progressUpdate.setCredentialUrl(dto.getCredentialUrl());
            progressUpdate.setMediaUrl(dto.getMediaUrl());

            // Process and attach skills
            List<Skill> updatedSkills = skillService.processSkillsForProgressUpdate(userId, dto.getSkills());
            progressUpdate.setSkills(updatedSkills);

            // Associate progress update with the user
            progressUpdate.setUser(user);

            // Add progress update skills to user's skills if not already present
            if (user.getSkills() == null) {
                user.setSkills(new ArrayList<>());
            }
            for (Skill skill : updatedSkills) {
                boolean alreadyHasSkill = user.getSkills().stream()
                    .anyMatch(s -> s.getName().equalsIgnoreCase(skill.getName()));
                if (!alreadyHasSkill) {
                    user.getSkills().add(skill);
                }
            }

            // Save progress update
            ProgressUpdate savedProgress = progressUpdateRepository.save(progressUpdate);

            // Add progress update to user
            if (user.getProgressUpdates() == null) {
                user.setProgressUpdates(new ArrayList<>());
            }
            user.getProgressUpdates().add(savedProgress);

            // Save updated user
            userRepository.save(user);

            return "Progress update added and user's skills updated!";
        } else {
            return "User not found!";
        }
    }


   public String editProgressUpdate(ObjectId id, ProgressUpdateDTO dto) {
    // 1. Load or 404
    ProgressUpdate existing = progressUpdateRepository.findById(id)
        .orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND,
                "ProgressUpdate with ID " + id + " not found"));

    // 2. Capture original skills
    List<Skill> originalList = existing.getSkills();
    Set<Skill> originalSet = new HashSet<>(originalList);

    // 3. Process incoming skills
    List<Skill> processed = skillService.processSkillsForProgressUpdate(
        existing.getUser().getId(), dto.getSkills());
    Set<Skill> updatedSet = new HashSet<>(processed);

    // 4. Compute removed vs added
    Set<Skill> removed = new HashSet<>(originalSet);
    removed.removeAll(updatedSet);

    Set<Skill> added = new HashSet<>(updatedSet);
    added.removeAll(originalSet);

    // 5. Update the rest of your fields...
    existing.setName(dto.getName());
    existing.setIssuingOrganization(dto.getIssuingOrganization());
    existing.setIssueDate(new MonthYear(dto.getIssueDate().getMonth(),
                                        dto.getIssueDate().getYear()));
    existing.setExpireDate(new MonthYear(dto.getExpireDate().getMonth(),
                                         dto.getExpireDate().getYear()));
    existing.setCredentialId(dto.getCredentialId());
    existing.setCredentialUrl(dto.getCredentialUrl());
    existing.setMediaUrl(dto.getMediaUrl());

    // 6. Set exactly the new skill list (convert Set → List)
    existing.setSkills(new ArrayList<>(updatedSet));

    // 7. Persist the ProgressUpdate
    progressUpdateRepository.save(existing);

    // 8. Sync the User’s skills
    User user = existing.getUser();
    if (user == null) {
        throw new IllegalStateException("ProgressUpdate has no associated User");
    }
    if (user.getSkills() == null) {
        user.setSkills(new ArrayList<>());
    }

    // Add newly attached
    for (Skill skill : added) {
        if (user.getSkills().stream()
                .noneMatch(s -> s.getName().equalsIgnoreCase(skill.getName()))) {
            user.getSkills().add(skill);
        }
    }

    // Remove ones no longer used by any other PU
    for (Skill skill : removed) {
        boolean stillUsed = user.getProgressUpdates().stream()
            .filter(pu -> !pu.getId().equals(id))
            .anyMatch(pu -> pu.getSkills().contains(skill));
        if (!stillUsed) {
            user.getSkills().removeIf(s -> s.getName().equalsIgnoreCase(skill.getName()));
        }
    }

    // 9. Save the user
    userRepository.save(user);

    return "Progress update edited successfully!";
}




    public void deleteProgressUpdate(ObjectId id) {
        Optional<ProgressUpdate> optionalProgressUpdate = progressUpdateRepository.findById(id);
    
        if (optionalProgressUpdate.isPresent()) {
            ProgressUpdate progressUpdate = optionalProgressUpdate.get();
            User user = progressUpdate.getUser(); // get the associated user
    
            // Remove the progress update from user's list
            if (user != null) {
                user.getProgressUpdates().removeIf(p -> p.getId().equals(id));
                userRepository.save(user);
            }
    
            // Delete the progress update
            progressUpdateRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Progress update not found with ID: " + id);
        }
    }

     // Helper method to process and add skills to the user
     private void processSkills(List<Skill> skills, User user) {
        for (Skill skill : skills) {
            // Add skill to the user if not already added
            skillService.addSkillToUserAndReturnSkills(user.getId(), skill.getName());
        }
    }
    

} 
