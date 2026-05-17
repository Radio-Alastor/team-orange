package com.silverguide.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {
    private String id;
    private String username;
    private LocalDateTime dateCreated;
    private long totalEngagements;
    private boolean isStaff;
    private boolean isSuperuser;
}
