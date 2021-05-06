package co.airy.core.api.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker()
                .setHeartbeatValue(new long[]{30_000, 30_000})
                .setTaskScheduler(heartbeatScheduler());
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws.communication").setAllowedOrigins("*");
    }

    @Bean
    TaskScheduler heartbeatScheduler() {
        final ThreadPoolTaskScheduler heartbeatScheduler = new ThreadPoolTaskScheduler();

        heartbeatScheduler.setPoolSize(1);
        heartbeatScheduler.setThreadNamePrefix("wss-heartbeat-scheduler-thread-");

        return heartbeatScheduler;
    }
}
