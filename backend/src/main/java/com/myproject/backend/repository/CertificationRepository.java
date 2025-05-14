package com.myproject.backend.repository;

import com.myproject.backend.model.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CertificationRepository extends MongoRepository<Certification, String> {
    List<Certification> findByUserId(String userId);
}
