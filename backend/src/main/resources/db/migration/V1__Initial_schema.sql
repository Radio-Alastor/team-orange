CREATE TABLE users (
    id           VARCHAR(36)  NOT NULL,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    is_superuser TINYINT(1)   NOT NULL DEFAULT 0,
    is_staff     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP    NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
);

CREATE TABLE topics (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    topic_name  VARCHAR(50)  NOT NULL,
    description VARCHAR(500) NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP    NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_topics_topic_name (topic_name)
);

CREATE TABLE articles (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    subtitle    VARCHAR(500) NULL,
    description TEXT         NULL,
    content     MEDIUMTEXT   NOT NULL,
    img_url     VARCHAR(255) NULL,
    user_id     VARCHAR(36)  NULL,
    topic_id    BIGINT       NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_articles_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_articles_topic FOREIGN KEY (topic_id) REFERENCES topics (id)
);

CREATE TABLE engagement_likes (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    user_id    VARCHAR(36) NOT NULL,
    article_id BIGINT      NOT NULL,
    is_like    TINYINT(1)  NOT NULL DEFAULT 1,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_likes_user_article (user_id, article_id),
    CONSTRAINT fk_likes_user    FOREIGN KEY (user_id)    REFERENCES users (id),
    CONSTRAINT fk_likes_article FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE engagement_comments (
    id         VARCHAR(36) NOT NULL,
    user_id    VARCHAR(36) NOT NULL,
    article_id BIGINT      NOT NULL,
    comment    TEXT        NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP   NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_comments_user    FOREIGN KEY (user_id)    REFERENCES users (id),
    CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE refresh_tokens (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    token      VARCHAR(255) NOT NULL,
    user_id    VARCHAR(36)  NOT NULL,
    expires_at TIMESTAMP    NOT NULL,
    revoked_at TIMESTAMP    NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_refresh_tokens_token (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
);
