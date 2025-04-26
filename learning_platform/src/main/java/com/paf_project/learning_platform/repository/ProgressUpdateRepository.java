package com.paf_project.learning_platform.repository;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.entity.ProgressUpdate;



public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, ObjectId> {

}
               