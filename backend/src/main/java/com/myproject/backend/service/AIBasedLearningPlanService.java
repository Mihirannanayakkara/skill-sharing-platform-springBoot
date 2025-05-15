package com.myproject.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myproject.backend.model.LearningPlan;
import com.myproject.backend.model.LearningPlan.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIBasedLearningPlanService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<Task> generateTasksForPlan(LearningPlan plan) {
        String prompt = buildPrompt(plan);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String fullUrl = GEMINI_API_URL + "?key=" + geminiApiKey;

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, entity, Map.class);

        try {
            Map<String, Object> body = response.getBody();

            if (body == null) {
                throw new RuntimeException("Empty response body from Gemini API");
            }

            List<?> candidates = (List<?>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates found in Gemini API response");
            }

            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);

            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");

            List<?> parts = (List<?>) content.get("parts");

            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No parts found in content of Gemini API response");
            }

            Object firstPart = parts.get(0);

            String rawText;

            if (firstPart instanceof Map) {
                rawText = ((Map<?, ?>) firstPart).get("text").toString();
            } else {
                rawText = firstPart.toString();
            }

            // Clean the response string to remove possible markdown code fences
            String cleanedJsonString = rawText.replaceAll("(?i)```json", "")
                    .replaceAll("```", "")
                    .trim();

            JsonNode rootNode = mapper.readTree(cleanedJsonString);

            List<Task> tasks = new ArrayList<>();
            JsonNode tasksNode = rootNode.get("learning_tasks");

            if (tasksNode == null || !tasksNode.isArray()) {
                throw new RuntimeException("learning_tasks array missing in Gemini API response JSON");
            }

            for (JsonNode taskNode : tasksNode) {
                Task task = new Task();
                task.setTaskName(taskNode.get("title").asText());
                task.setTaskDescription(taskNode.get("description").asText());
                task.setCompleted(false);

                // Set new optional fields if they exist
                if (taskNode.has("objective")) {
                    task.setObjective(taskNode.get("objective").asText());
                }

                if (taskNode.has("estimated_time")) {
                    task.setEstimatedTime(taskNode.get("estimated_time").asText());
                }

                if (taskNode.has("suggested_resources") && taskNode.get("suggested_resources").isArray()) {
                    List<String> resources = new ArrayList<>();
                    for (JsonNode resNode : taskNode.get("suggested_resources")) {
                        resources.add(resNode.asText());
                    }
                    task.setSuggestedResources(resources);
                }

                tasks.add(task);
            }


            return tasks;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini API response: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(LearningPlan plan) {
        return """
                You are an intelligent learning plan assistant. Based on a single learning plan, generate exactly 5 specific, actionable learning tasks. The plan includes:

                - Title: %s
                - Background: %s
                - Scope: %s
                - Skills: %s
                - Topics: %s
                - Start Date: %s
                - End Date: %s

                Generate 5 learning tasks that:
                1. Are aligned with the scope, topics, and skills.
                2. Are feasible within the given time frame.
                3. Each includes a title, description, objective, estimated time, and suggested resources.

                Return only a valid JSON object in this structure:

                {
                  "learning_tasks": [
                    {
                      "title": "Task 1 Title",
                      "description": "What this task involves.",
                      "objective": "What the learner will achieve.",
                      "estimated_time": "e.g., 2 hours",
                      "suggested_resources": ["Resource 1", "Resource 2"]
                    },
                    ...
                  ]
                }

                Only return the JSON. Do not include any explanation or repeat the input fields.
                """.formatted(
                plan.getTitle(),
                plan.getBackground(),
                plan.getScope(),
                String.join(", ", plan.getSkills()),
                String.join(", ", plan.getTopics()),
                plan.getStartDate(),
                plan.getEndDate()
        );
    }
}
