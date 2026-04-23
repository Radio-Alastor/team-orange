package com.silverguide.backend.service;

import com.silverguide.backend.dto.ChangePasswordRequest;
import com.silverguide.backend.entity.User;
import com.silverguide.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void changePassword(User user, ChangePasswordRequest req) {
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
