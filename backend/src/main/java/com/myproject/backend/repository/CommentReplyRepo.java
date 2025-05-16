package com.myproject.backend.repository;

import com.myproject.backend.model.CommentReply;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentReplyRepo extends MongoRepository<CommentReply, String> {
    List<CommentReply> findByCommentId(String commentId);
    long countByCommentId(String commentId);
}