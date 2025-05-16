package com.myproject.backend.controller;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/aiimage")
public class AIImageController {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
    private static final String API_KEY = "AIzaSyCemNhSkNrBI"; // Replace with your actual key

    @PostMapping("/generate-description")
    public ResponseEntity<?> generateDescription(@RequestParam("image") MultipartFile imageFile) {
        try {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            String requestJson = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": "%s"
                          }
                        },
                        {
                          "text": "Generate a short, engaging social media description for this image."
                        }
                      ]
                    }
                  ]
                }
                """.formatted(base64Image);

            try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
                HttpPost httpPost = new HttpPost(GEMINI_API_URL + "?key=" + API_KEY);
                httpPost.setHeader("Content-Type", "application/json");
                httpPost.setEntity(new StringEntity(requestJson, StandardCharsets.UTF_8));

                try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                    String responseBody = new BufferedReader(
                            new InputStreamReader(response.getEntity().getContent(), StandardCharsets.UTF_8)
                    ).lines().collect(Collectors.joining("\n"));

                    // Use regex to extract the first "text" field value
                    Pattern pattern = Pattern.compile("\"text\"\\s*:\\s*\"([^\"]+)\"");
                    Matcher matcher = pattern.matcher(responseBody);
                    String description = matcher.find() ? matcher.group(1) : "No description generated.";

                    return ResponseEntity.ok(Map.of("description", description));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong: " + e.getMessage()));
        }
    }
}
