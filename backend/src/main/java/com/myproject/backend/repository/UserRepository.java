package com.myproject.backend.repository;

import com.myproject.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username); // For checking existing username during login
}
