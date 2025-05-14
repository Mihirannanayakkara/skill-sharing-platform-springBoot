package com.myproject.backend.repository;

import com.myproject.backend.model.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SharedPostRepo extends MongoRepository<SharedPost, String> {
    List<SharedPost> findBySharedToUserId(String sharedToUserId);
}
