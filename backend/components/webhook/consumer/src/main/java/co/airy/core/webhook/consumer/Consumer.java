package co.airy.core.webhook.consumer;

import co.airy.core.webhook.WebhookEvent;
import co.airy.log.AiryLoggerFactory;
import com.dinstone.beanstalkc.Job;
import com.dinstone.beanstalkc.JobConsumer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class Consumer implements DisposableBean {
    private static final Logger log = AiryLoggerFactory.getLogger(Consumer.class);

    private final ObjectMapper objectMapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    private final JobConsumer consumer;
    private final Sender sender;

    Consumer(JobConsumer consumer, Sender sender) {
        this.consumer = consumer;
        this.sender = sender;
    }

    @Scheduled(fixedDelay = 50)
    public void process() {
        final Job job = consumer.reserveJob(10);
        if (job == null) {
            return;
        }

        final byte[] jobData = job.getData();

        WebhookEvent event;
        try {
            event = objectMapper.readValue(jobData, WebhookEvent.class);
        } catch (IOException e) {
            log.error("Failed to deserialize event. Removing job {}. Payload {}", job.getId(), new String(jobData, StandardCharsets.UTF_8), e);
            consumer.deleteJob(job.getId());
            return;
        }

        try {
            sender.sendRecord(event);
        } catch (RestClientException e) {
            log.error("Sending message to webhook {} failed. ", event.getWebhookId());
            return;
        }

        consumer.deleteJob(job.getId());
    }

    @Override
    public void destroy() {
        consumer.close();
    }
}
