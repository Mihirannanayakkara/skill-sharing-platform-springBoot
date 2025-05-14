package com.myproject.backend.controller;

import com.myproject.backend.model.DSRCourse;
import com.myproject.backend.service.DSRCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsrcourses")
@CrossOrigin(origins = "http://localhost:5173")
public class DSRCourseController {

    @Autowired
    private DSRCourseService courseService;

    @PostMapping
    public DSRCourse createCourse(@RequestBody DSRCourse course) {
        return courseService.createCourse(course);
    }

    @GetMapping
    public List<DSRCourse> getAll() {
        return courseService.getAllCourses();
    }

    @GetMapping("/search")
    public List<DSRCourse> search(@RequestParam String q) {
        return courseService.searchCourses(q);
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    public DSRCourse enroll(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.enrollUser(courseId, userId);
    }

    @PostMapping("/{courseId}/complete/{userId}")
    public DSRCourse complete(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.markCompleted(courseId, userId);
    }

    @PostMapping("/{courseId}/viewed/{userId}")
    public DSRCourse markLessonViewed(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.markLessonViewed(courseId, userId);
    }

    @PostMapping("/{courseId}/download/{userId}/{resourceName}")
    public DSRCourse markResourceDownloaded(@PathVariable String courseId, @PathVariable String userId, @PathVariable String resourceName) {
        return courseService.markResourceDownloaded(courseId, userId, resourceName);
    }

    @GetMapping("/{courseId}/user/{userId}")
    public DSRCourse getCourseForUser(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.getCourseDetailsForUser(courseId, userId);
    }

    @GetMapping("/enrolled/{userId}")
    public List<DSRCourse> getEnrolledCourses(@PathVariable String userId) {
        return courseService.getEnrolledCourses(userId);
    }

     @DeleteMapping("/{courseId}/enroll/{userId}")
    public DSRCourse unenroll(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.unenrollUser(courseId, userId);
    }
    
}
