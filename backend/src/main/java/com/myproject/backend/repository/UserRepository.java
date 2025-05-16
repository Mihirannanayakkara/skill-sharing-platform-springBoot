package com.myproject.backend.repository;

import com.myproject.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("{ 'posts._id': ?0 }")
    Optional<User> findByPostId(String postId);
}
