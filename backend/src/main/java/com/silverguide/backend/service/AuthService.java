package com.silverguide.backend.service;

import com.silverguide.backend.dto.AuthResponse;
import com.silverguide.backend.dto.LoginRequest;
import com.silverguide.backend.dto.RefreshRequest;
import com.silverguide.backend.dto.RegisterRequest;
import com.silverguide.backend.entity.RefreshToken;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.repository.RefreshTokenRepository;
import com.silverguide.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return buildAuthResponse(token, refreshToken.getToken(), user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return buildAuthResponse(token, refreshToken.getToken(), user);
    }

    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken oldToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());
        User user = oldToken.getUser();

        refreshTokenService.revokeRefreshToken(oldToken);

        String newAccessToken = jwtService.generateToken(user);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
        return buildAuthResponse(newAccessToken, newRefreshToken.getToken(), user);
    }

    public void logout(RefreshRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .filter(rt -> rt.getRevokedAt() == null)
                .ifPresent(refreshTokenService::revokeRefreshToken);
    }

    private AuthResponse buildAuthResponse(String token, String refreshToken, User user) {
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .superuser(user.isSuperuser())
                .staff(user.isStaff())
                .build();
    }

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }
}
