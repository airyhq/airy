package co.airy.core.webhook.publisher;

import co.airy.core.webhook.publisher.model.QueueMessage;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisQueue {
    private static final Logger log = AiryLoggerFactory.getLogger(RedisQueue.class);

    final ObjectMapper objectMapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    void publishMessage(String webhookId, QueueMessage message) {
        try {
            redisTemplate.opsForList().leftPush(webhookId, objectMapper.writeValueAsString(message));
        } catch (JsonProcessingException e) {
            log.error("failed to publish message to redis", e);
        }
    }
}
