package com.silverguide.backend.repository;

import com.silverguide.backend.dto.admin.UserAdminDTO;
import com.silverguide.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
        SELECT new com.silverguide.backend.dto.admin.UserAdminDTO(
            u.id, 
            u.name, 
            u.createdAt, 
            (COUNT(DISTINCT c.id) + COUNT(DISTINCT l.id)), 
            u.isStaff, 
            u.isSuperuser
        )
        FROM User u
        LEFT JOIN EngagementComment c ON u.id = c.user.id
        LEFT JOIN EngagementLike l ON u.id = l.user.id
        GROUP BY u.id, u.name, u.createdAt, u.isStaff, u.isSuperuser
        ORDER BY u.createdAt DESC
    """)
    List<UserAdminDTO> findAllUsersWithEngagementCounts();
}
