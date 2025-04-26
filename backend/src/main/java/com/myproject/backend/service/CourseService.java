package com.paf.Learningplatform.service;

import com.paf.Learningplatform.model.Course;
import com.paf.Learningplatform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    // Create a new course
    public Course create(Course course) {
        return courseRepository.save(course);
    }

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get a course by ID
    public Course getCourseById(String id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // Update a course
    public Course update(String id, Course updatedCourse) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setName(updatedCourse.getName());
        course.setDescription(updatedCourse.getDescription());
        course.setSkill(updatedCourse.getSkill());
        course.setResourceLink(updatedCourse.getResourceLink());
        return courseRepository.save(course);
    }

    // Delete a course
    public void delete(String id) {
        courseRepository.deleteById(id);
    }

    // Get courses by skills
    public List<Course> getCoursesBySkills(List<String> skills) {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .filter(course -> skills.contains(course.getSkill()))
                .collect(java.util.stream.Collectors.toList());
    }
}
