package co.airy.core.api.websocket;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final Logger log = AiryLoggerFactory.getLogger(WebSocketConfig.class);

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                Object nativeHeaders = message
                        .getHeaders()
                        .get(SimpMessageHeaderAccessor.NATIVE_HEADERS);

                log.info("nativeHeaders: {}", nativeHeaders);

                return message;
            }
        });
    }

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
