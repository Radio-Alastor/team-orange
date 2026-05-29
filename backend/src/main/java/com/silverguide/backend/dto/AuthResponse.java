package com.silverguide.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    
    @JsonIgnore
    private String refreshToken;
    
    @Builder.Default
    private String tokenType = "Bearer";
    private String userId;
    private String name;
    private String email;
    private boolean superuser;
    private boolean staff;
}
