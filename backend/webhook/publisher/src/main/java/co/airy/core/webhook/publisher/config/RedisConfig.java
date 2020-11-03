package co.airy.core.webhook.publisher.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    private final LettuceConnectionFactory redisConnectionFactory;

    RedisConfig(LettuceConnectionFactory redisConnectionFactory) {
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @Bean
    public RedisTemplate<String, String> redisTemplate() {
        RedisTemplate<String, String> stringTemplate = new RedisTemplate<>();
        stringTemplate.setConnectionFactory(redisConnectionFactory);
        stringTemplate.setDefaultSerializer(new StringRedisSerializer());
        stringTemplate.afterPropertiesSet();

        return stringTemplate;
    }
}
