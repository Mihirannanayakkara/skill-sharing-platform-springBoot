package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.entity.User;

public interface UserRepository extends MongoRepository<User, String> {

}
