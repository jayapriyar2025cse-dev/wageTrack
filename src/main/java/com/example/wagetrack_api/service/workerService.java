package com.example.wagetrack_api.service;

import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.workerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class workerService {

    private final workerRepository workerRepository;

    public workerService(workerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public worker addWorker(worker worker) {
        return workerRepository.save(worker);
    }

    public List<worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public worker getWorkerById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));
    }

    public worker updateWorker(Long id, worker worker) {

        worker existingWorker = workerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        existingWorker.setName(worker.getName());
        existingWorker.setDailyWage(worker.getDailyWage());

        return workerRepository.save(existingWorker);
    }

    public void deleteWorker(Long id) {

        worker existingWorker = workerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        workerRepository.delete(existingWorker);
    }
}