package com.paf_project.learning_platform.controller;


import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf_project.learning_platform.dto.ProgressUpdateDTO;
import com.paf_project.learning_platform.entity.ProgressUpdate;
import com.paf_project.learning_platform.service.ProgressUpdateService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    //get all progressUpdates
    @GetMapping
    public ResponseEntity<List<ProgressUpdateDTO>> getAllProgressUpdates() {
        return new ResponseEntity<>(progressUpdateService.getAllProgressUpdateDTOs(), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO> getProgressUpdateDTO(@PathVariable ObjectId id) {
        Optional<ProgressUpdateDTO> dto = progressUpdateService.getProgressUpdateDTOById(id);
        return dto.map(data -> new ResponseEntity<>(data, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //create Progress Update
    @PostMapping("/add/{userId}")
    public ResponseEntity<String> createProgressUpdate(@PathVariable String userId, @RequestBody ProgressUpdateDTO dto) {
        String response = progressUpdateService.createProgressUpdate(userId, dto);
        return ResponseEntity.ok(response);
    }
    

    //Get particular users ProgressUpdates
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdateDTO>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdateDTO> progressUpdates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return new ResponseEntity<>(progressUpdates, HttpStatus.OK);
    }

    //edit Progress Update
  
    @PutMapping("/{id}")
    public ResponseEntity<String> editProgressUpdate(
            @PathVariable ObjectId id,
            @RequestBody ProgressUpdateDTO dto) {
    
        String result = progressUpdateService.editProgressUpdate(id, dto);
        return ResponseEntity.ok(result);
    }

    //Delete Progress Update
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgressUpdate(@PathVariable ObjectId id) {
        try {
            progressUpdateService.deleteProgressUpdate(id);
            return new ResponseEntity<>("Progress update deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
