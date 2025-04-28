package com.myproject.backend.repository;

import com.myproject.backend.model.MediaModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepo extends MongoRepository<MediaModel, String> {
    List<MediaModel> findByUserId(String userId);
}
