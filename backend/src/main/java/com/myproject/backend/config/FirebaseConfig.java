package com.myproject.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("paf-it-c136a.firebasestorage.app")
    private String storageBucket;

        @PostConstruct
        public void initialize() throws IOException {
            try (InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("firebase-adminsdk.json")) {

                if (serviceAccount == null) {
                    throw new IllegalStateException("Firebase service account file not found");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setStorageBucket(storageBucket) // Using your bucket gs://paf-it.firebasestorage.app
                        .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                }
                System.out.println("Firebase initialized with bucket: " + storageBucket);
            }
        }

        @Bean
        public StorageClient storageClient() {
            return StorageClient.getInstance();
        }

}
