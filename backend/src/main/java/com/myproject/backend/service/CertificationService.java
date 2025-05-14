package com.myproject.backend.service;

import com.myproject.backend.model.Certification;
import com.myproject.backend.repository.CertificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CertificationService {

    @Autowired
    private CertificationRepository certificationRepository;

    public Certification addCertification(Certification cert) {
        return certificationRepository.save(cert);
    }

    public List<Certification> getUserCertifications(String userId) {
        return certificationRepository.findByUserId(userId);
    }

    public List<Certification> searchCertifications(String userId, String query) {
        return certificationRepository.findByUserId(userId).stream()
                .filter(cert ->
                        cert.getName().toLowerCase().contains(query.toLowerCase()) ||
                        cert.getOrganization().toLowerCase().contains(query.toLowerCase()) ||
                        (cert.getIssueDate() != null && cert.getIssueDate().toString().contains(query))
                ).collect(Collectors.toList());
    }

    public Certification updateCertification(String id, Certification updatedCert) {
        Certification existing = certificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Certification not found"));
    
        existing.setName(updatedCert.getName());
        existing.setOrganization(updatedCert.getOrganization());
        existing.setIssueDate(updatedCert.getIssueDate());
        existing.setExpiryDate(updatedCert.getExpiryDate());
        existing.setCredentialId(updatedCert.getCredentialId());
        existing.setCredentialUrl(updatedCert.getCredentialUrl());
        existing.setSkills(updatedCert.getSkills());
        existing.setCertificateImageBase64(updatedCert.getCertificateImageBase64());
    
        return certificationRepository.save(existing);
    }
    
    public void deleteCertification(String id) {
        certificationRepository.deleteById(id);
    }
    
}
