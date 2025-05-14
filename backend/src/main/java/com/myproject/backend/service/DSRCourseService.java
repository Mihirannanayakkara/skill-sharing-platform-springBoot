package com.myproject.backend.service;

import com.myproject.backend.model.DSRCourse;
import com.myproject.backend.repository.DSRCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DSRCourseService {

    @Autowired
    private DSRCourseRepository courseRepo;

    public DSRCourse createCourse(DSRCourse course) {
        return courseRepo.save(course);
    }

    public List<DSRCourse> getAllCourses() {
        return courseRepo.findAll();
    }

    public List<DSRCourse> searchCourses(String keyword) {
        return courseRepo.findByTitleContainingIgnoreCase(keyword);
    }

    public List<DSRCourse> getEnrolledCourses(String userId) {
        return courseRepo.findByEnrolledUserIdsContains(userId);
    }

    public DSRCourse enrollUser(String courseId, String userId) {
        DSRCourse course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
    
        if (course.getEnrolledUserIds() == null) {
            course.setEnrolledUserIds(new ArrayList<>());
        }
        if (course.getLessonViewedMap() == null) {
            course.setLessonViewedMap(new HashMap<>());
        }
        if (course.getResourcesDownloadedMap() == null) {
            course.setResourcesDownloadedMap(new HashMap<>());
        }
    
        if (!course.getEnrolledUserIds().contains(userId)) {
            course.getEnrolledUserIds().add(userId);
            course.getLessonViewedMap().put(userId, false);
            course.getResourcesDownloadedMap().put(userId, new ArrayList<>());
            return courseRepo.save(course);
        }
    
        return course;
    }
    
    public DSRCourse markLessonViewed(String courseId, String userId) {
        DSRCourse course = courseRepo.findById(courseId).orElseThrow();
        course.getLessonViewedMap().put(userId, true);
        return courseRepo.save(course);
    }

    public DSRCourse markResourceDownloaded(String courseId, String userId, String resourceName) {
        DSRCourse course = courseRepo.findById(courseId).orElseThrow();
    
        List<String> downloaded = course.getResourcesDownloadedMap().getOrDefault(userId, new ArrayList<>());
    
        if (!downloaded.contains(resourceName)) {
            downloaded.add(resourceName);
            course.getResourcesDownloadedMap().put(userId, downloaded);
        }
    
        // ✅ Updated for multiple lessons
        boolean lessonViewed = course.getLessonViewedMap().getOrDefault(userId, false);
        boolean allDownloaded = course.getLessons().stream()
            .flatMap(lesson -> lesson.getResources().stream())
            .allMatch(r -> downloaded.contains(r.getName()));
    
        if (lessonViewed && allDownloaded && !course.getCompletedUserIds().contains(userId)) {
            course.getCompletedUserIds().add(userId);
        }
    
        return courseRepo.save(course);
    }

    public DSRCourse markCompleted(String courseId, String userId) {
        DSRCourse course = courseRepo.findById(courseId).orElseThrow();
        if (course.getEnrolledUserIds().contains(userId) && !course.getCompletedUserIds().contains(userId)) {
            course.getCompletedUserIds().add(userId);
            return courseRepo.save(course);
        }
        return course;
    }

    public DSRCourse getCourseDetailsForUser(String courseId, String userId) {
        return courseRepo.findByIdAndEnrolledUserIdsContains(courseId, userId).orElse(null);
    }

    public DSRCourse unenrollUser(String courseId, String userId) {
        DSRCourse course = courseRepo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getEnrolledUserIds() != null) {
            course.getEnrolledUserIds().remove(userId);
        }
        if (course.getCompletedUserIds() != null) {
            course.getCompletedUserIds().remove(userId);
        }
        if (course.getLessonViewedMap() != null) {
            course.getLessonViewedMap().remove(userId);
        }
        if (course.getResourcesDownloadedMap() != null) {
            course.getResourcesDownloadedMap().remove(userId);
        }

        return courseRepo.save(course);
    }
    

}
