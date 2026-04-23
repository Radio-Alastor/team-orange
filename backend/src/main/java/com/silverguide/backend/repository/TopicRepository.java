package com.silverguide.backend.repository;

import com.silverguide.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByTopicName(String topicName);
}
