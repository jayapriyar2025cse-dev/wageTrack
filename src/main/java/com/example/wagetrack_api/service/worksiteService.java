package com.example.wagetrack_api.service;

import com.example.wagetrack_api.model.Worksite;
import com.example.wagetrack_api.repository.worksiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class worksiteService {

    private final worksiteRepository worksiteRepository;

    public worksiteService(worksiteRepository worksiteRepository) {
        this.worksiteRepository = worksiteRepository;
    }

    public Worksite addWorksite(Worksite worksite) {
        return worksiteRepository.save(worksite);
    }

    public List<Worksite> getAllWorksites() {
        return worksiteRepository.findAll();
    }

    public Worksite getWorksiteById(Long id) {
        return worksiteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worksite not found"));
    }

    public Worksite updateWorksite(Long id, Worksite worksite) {

        Worksite existingWorksite = worksiteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worksite not found"));

        existingWorksite.setName(worksite.getName());
        existingWorksite.setLocation(worksite.getLocation());

        return worksiteRepository.save(existingWorksite);
    }

    public void deleteWorksite(Long id) {

        Worksite existingWorksite = worksiteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worksite not found"));

        worksiteRepository.delete(existingWorksite);
    }
}
