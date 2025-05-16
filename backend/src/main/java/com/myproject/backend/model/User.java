package com.myproject.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String imageUrl;
    private String coverImageUrl;
    private String password;
    private String authProvider; // "google" or "local"
    private String role; // "USER", "ADMIN", etc.
    private String bio; // New field

    public User() {}

    public User(String id, String name, String email, String imageUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", coverImageUrl='" + coverImageUrl + '\'' +
                ", authProvider='" + authProvider + '\'' +
                ", role='" + role + '\'' +
                ", bio='" + bio + '\'' +
                '}';
    }
}
