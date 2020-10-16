package co.airy.core.webhook.publisher.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Autowired
    public LettuceConnectionFactory redisConnectionFactory;

    @Bean
    public RedisTemplate redisTemplate() {
        RedisTemplate<String, String> stringTemplate = new RedisTemplate<>();
        stringTemplate.setConnectionFactory(redisConnectionFactory);
        stringTemplate.setDefaultSerializer(new StringRedisSerializer());
        stringTemplate.afterPropertiesSet();

        return stringTemplate;
    }

}
