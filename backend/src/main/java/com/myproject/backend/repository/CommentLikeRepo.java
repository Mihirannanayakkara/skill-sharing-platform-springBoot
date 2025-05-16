package com.myproject.backend.repository;

import com.myproject.backend.model.CommentLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CommentLikeRepo extends MongoRepository<CommentLike, String> {
    List<CommentLike> findByCommentId(String commentId);
    long countByCommentId(String commentId);
    Optional<CommentLike> findByCommentIdAndUserId(String commentId, String userId);
    void deleteByCommentIdAndUserId(String commentId, String userId);
}