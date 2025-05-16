package com.myproject.backend.repository;

import com.myproject.backend.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface LikeRepo extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    long countByPostId(String postId);
    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    @Transactional
    void deleteByPostIdAndUserId(String postId, String userId);
}