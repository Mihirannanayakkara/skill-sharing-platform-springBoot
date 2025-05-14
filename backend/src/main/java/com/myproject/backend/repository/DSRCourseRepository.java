package com.myproject.backend.repository;

import com.myproject.backend.model.DSRCourse;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DSRCourseRepository extends MongoRepository<DSRCourse, String> {
    List<DSRCourse> findByTitleContainingIgnoreCase(String title);
    List<DSRCourse> findByEnrolledUserIdsContains(String userId);
    Optional<DSRCourse> findByIdAndEnrolledUserIdsContains(String id, String userId);
}
