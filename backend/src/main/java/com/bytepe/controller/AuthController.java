package com.bytepe.controller;

import com.bytepe.config.JwtAuthFilter.CustomUserDetails;
import com.bytepe.dto.LoginRequest;
import com.bytepe.dto.LoginResponse;
import com.bytepe.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        return ResponseEntity.ok(Map.of(
                "phone", auth.getName(),
                "role", details.role(),
                "partnerId", details.partnerId() != null ? details.partnerId() : "",
                "userId", details.userId() != null ? details.userId() : ""
        ));
    }
}
