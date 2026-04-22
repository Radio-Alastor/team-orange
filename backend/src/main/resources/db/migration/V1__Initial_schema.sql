CREATE TABLE users (
    id            VARCHAR(36)  NOT NULL,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_superuser  BOOLEAN      NOT NULL DEFAULT FALSE,
    is_staff      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    DATETIME     NOT NULL,
    updated_at    DATETIME,
    deleted_at    DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
);

CREATE TABLE topics (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uk_topics_name (name)
);

CREATE TABLE articles (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    title      VARCHAR(255) NOT NULL,
    content    MEDIUMTEXT,
    summary    VARCHAR(255),
    image_url  VARCHAR(255),
    author_id  VARCHAR(36),
    topic_id   BIGINT,
    published  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL,
    updated_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES users (id),
    CONSTRAINT fk_articles_topic  FOREIGN KEY (topic_id)  REFERENCES topics (id)
);

CREATE TABLE engagement_likes (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    user_id    VARCHAR(36) NOT NULL,
    article_id BIGINT      NOT NULL,
    created_at DATETIME    NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_likes_user_article (user_id, article_id),
    CONSTRAINT fk_likes_user    FOREIGN KEY (user_id)    REFERENCES users (id),
    CONSTRAINT fk_likes_article FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE engagement_comments (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    user_id    VARCHAR(36) NOT NULL,
    article_id BIGINT      NOT NULL,
    body       TEXT        NOT NULL,
    created_at DATETIME    NOT NULL,
    updated_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_comments_user    FOREIGN KEY (user_id)    REFERENCES users (id),
    CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES articles (id)
);
