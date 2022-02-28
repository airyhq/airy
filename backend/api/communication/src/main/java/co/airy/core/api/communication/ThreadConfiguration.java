package co.airy.core.api.communication;

import co.airy.avro.communication.*;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.core.Authentication;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Configuration
public class ThreadConfiguration {
    @Bean(name = "threadPoolTaskExecutor")
    public TaskExecutor getTaskExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setCorePoolSize(1);
        threadPoolTaskExecutor.setMaxPoolSize(1);
        threadPoolTaskExecutor.initialize();
        return threadPoolTaskExecutor;
    }

    @Bean
    @Qualifier("messageQueue")
    public LinkedBlockingQueue<Map<Authentication,SendMessageRequestPayload>> getMessageQueue() {
        return new LinkedBlockingQueue<Map<Authentication,SendMessageRequestPayload>>();
    }


}
