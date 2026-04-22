package com.silverguide.backend.service;

import com.silverguide.backend.entity.RefreshToken;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.exception.TokenException;
import com.silverguide.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public RefreshToken createRefreshToken(User user) {
        RefreshToken rt = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .build();
        return refreshTokenRepository.save(rt);
    }

    public RefreshToken verifyRefreshToken(String tokenValue) {
        RefreshToken rt = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new TokenException("Refresh token not found"));
        if (rt.getRevokedAt() != null) {
            throw new TokenException("Refresh token has been revoked");
        }
        if (rt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenException("Refresh token has expired");
        }
        return rt;
    }

    public void revokeRefreshToken(RefreshToken rt) {
        rt.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(rt);
    }
}
