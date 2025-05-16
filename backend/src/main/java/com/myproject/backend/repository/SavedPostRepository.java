package com.myproject.backend.repository;

import com.myproject.backend.model.SavedPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPostRepository extends MongoRepository<SavedPost, String> {
    List<SavedPost> findByUserId(String userId);
    Optional<SavedPost> findByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
    boolean existsByUserIdAndPostId(String userId, String postId);
}