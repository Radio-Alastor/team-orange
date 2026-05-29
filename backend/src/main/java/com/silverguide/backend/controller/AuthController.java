package com.silverguide.backend.controller;

import com.silverguide.backend.dto.AuthResponse;
import com.silverguide.backend.dto.LoginRequest;
import com.silverguide.backend.dto.RefreshRequest;
import com.silverguide.backend.dto.RegisterRequest;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cookie.secure}")
    private boolean secureCookie;

    private ResponseCookie createCookie(String token, int maxAge) {
        return ResponseCookie.from("sg_refresh_token", token != null ? token : "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/api/auth")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(name = "sg_refresh_token", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken(refreshToken);
        
        AuthResponse response = authService.refresh(req);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, createCookie(response.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = "sg_refresh_token", required = false) String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            RefreshRequest req = new RefreshRequest();
            req.setRefreshToken(refreshToken);
            authService.logout(req);
        }
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, createCookie("", 0).toString())
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, createCookie(response.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, createCookie(response.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
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
