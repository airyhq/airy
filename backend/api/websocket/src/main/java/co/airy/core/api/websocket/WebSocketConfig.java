package co.airy.core.api.websocket;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final Logger log = AiryLoggerFactory.getLogger(WebSocketConfig.class);
    private final String systemToken;
    private final String systemTokenPrincipal;

    public WebSocketConfig(@Value("${systemToken:#{null}}") String systemToken) {
        this.systemToken = systemToken;
        this.systemTokenPrincipal = systemToken == null ? null : String.format("system-token-%s", systemToken.substring(0, Math.min(systemToken.length(), 4)));
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

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                if (systemToken == null) {
                    return message;
                }

                final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
                    if (authToken != null && authToken.startsWith("Bearer")) {
                        authToken = authToken.substring(7);
                    }

                    try {
                        if (systemToken.equals(authToken)) {
                            accessor.setUser(new UsernamePasswordAuthenticationToken(systemTokenPrincipal, null, List.of()));
                        }
                    } catch (Exception e) {
                        log.error(String.format("STOMP Command: %s, token: %s \n Failed to authenticate", accessor.getCommand(), authToken));
                    }
                }

                if (accessor == null || accessor.getUser() == null) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
                }

                return message;
            }
        });
    }
}
