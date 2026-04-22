package com.silverguide.backend.controller;

import com.silverguide.backend.dto.AuthResponse;
import com.silverguide.backend.dto.LoginRequest;
import com.silverguide.backend.dto.RefreshRequest;
import com.silverguide.backend.dto.RegisterRequest;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal User user) {
        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .superuser(user.isSuperuser())
                .staff(user.isStaff())
                .build();
        return ResponseEntity.ok(response);
    }
}
