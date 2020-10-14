package co.airy.core.webhook.publisher.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
public class LettuceConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory(@Value("${redis.url}") final String hostName, @Value("${redis.port}") final int port) {
        return new LettuceConnectionFactory(new RedisStandaloneConfiguration(hostName, port));
    }
}
