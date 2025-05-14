package com.myproject.backend.controller;

import com.myproject.backend.model.Certification;
import com.myproject.backend.service.CertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@CrossOrigin(origins = "http://localhost:5173")
public class CertificationController {

    @Autowired
    private CertificationService certificationService;

    @PostMapping
    public Certification addCertification(@RequestBody Certification cert) {
        return certificationService.addCertification(cert);
    }

    @GetMapping("/{userId}")
    public List<Certification> getUserCertifications(@PathVariable String userId) {
        return certificationService.getUserCertifications(userId);
    }

    @GetMapping("/search/{userId}")
    public List<Certification> searchCertifications(@PathVariable String userId, @RequestParam String query) {
        return certificationService.searchCertifications(userId, query);
    }

    @PutMapping("/{id}")
    public Certification updateCertification(@PathVariable String id, @RequestBody Certification updatedCert) {
        return certificationService.updateCertification(id, updatedCert);
    }

    @DeleteMapping("/{id}")
    public void deleteCertification(@PathVariable String id) {
        certificationService.deleteCertification(id);
    }

}
