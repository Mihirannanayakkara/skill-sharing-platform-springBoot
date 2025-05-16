package com.myproject.backend.repository;

import com.myproject.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepo extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    long countByPostId(String postId);
}