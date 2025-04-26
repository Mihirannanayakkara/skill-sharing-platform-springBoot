package com.paf_project.learning_platform.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_project.learning_platform.dto.MonthYearDTO;
import com.paf_project.learning_platform.dto.ProgressUpdateDTO;
import com.paf_project.learning_platform.dto.UserDTO;
import com.paf_project.learning_platform.entity.User;
import com.paf_project.learning_platform.repository.UserRepository;



@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;


    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public List<UserDTO> getAllUserDTOs() {
        return userRepository.findAll()
                             .stream()
                             .map(this::convertToDTO)
                             .toList();
    }

    public Optional<UserDTO> getUserDTOById(String id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }

    public UserDTO convertToDTO(User user) {
    List<ProgressUpdateDTO> progressDTOs = user.getProgressUpdates().stream().map(p -> {
        return new ProgressUpdateDTO(
                p.getId().toHexString(),
                p.getName(),
                p.getIssuingOrganization(),
                new MonthYearDTO(p.getIssueDate().getMonth(), p.getIssueDate().getYear()),
                new MonthYearDTO(p.getExpireDate().getMonth(), p.getExpireDate().getYear()),
                p.getCredentialId(),
                p.getCredentialUrl(),
                p.getMediaUrl(),
                p.getSkills()
        );
    }).toList();

    return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getSkills(),
            progressDTOs
    );
}



    // Get a single user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Edit an existing user
    public User updateUser(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword());
            user.setSkills(updatedUser.getSkills());
            return userRepository.save(user);
        }).orElse(null);
    }

    // Delete a user by ID
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }


}

