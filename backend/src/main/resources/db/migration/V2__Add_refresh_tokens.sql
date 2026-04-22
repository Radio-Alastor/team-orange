CREATE TABLE refresh_tokens (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    token      VARCHAR(255) NOT NULL,
    user_id    VARCHAR(36)  NOT NULL,
    expires_at DATETIME     NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_refresh_tokens_token (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
);
