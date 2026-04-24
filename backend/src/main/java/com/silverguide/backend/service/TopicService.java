package com.silverguide.backend.service;

import com.silverguide.backend.dto.TopicResponse;
import com.silverguide.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;

    public List<TopicResponse> getActiveTopics() {
        return topicRepository.findAllByDeletedAtIsNull().stream()
            .map(t -> TopicResponse.builder()
                .id(t.getId())
                .topicName(t.getTopicName())
                .description(t.getDescription())
                .build())
            .collect(Collectors.toList());
    }
}
