package com.silverguide.backend.controller;

import com.silverguide.backend.dto.ChangePasswordRequest;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(user, req);
        return ResponseEntity.noContent().build();
    }
}
