package co.airy.core.chat_plugin.config;

import co.airy.core.chat_plugin.Principal;
import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final Logger log = AiryLoggerFactory.getLogger(WebSocketConfig.class);
    private final Jwt jwt;

    public WebSocketConfig(Jwt jwt) {
        this.jwt = jwt;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{30_000, 30_000})
                .setTaskScheduler(heartbeatScheduler());
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws.chatplugin").setAllowedOrigins("*");
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
                final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    final String jwtToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
                    try {
                        final Principal principal = jwt.authenticate(jwtToken);
                        accessor.setUser(principal);
                    } catch (Exception e) {
                        log.error(String.format("STOMP Command: %s, token: %s \n Failed to authenticate", accessor.getCommand(), jwtToken));
                    }
                }

                if (accessor == null || accessor.getUser() == null) {
                    throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized");
                }

                return message;
            }
        });
    }
}
