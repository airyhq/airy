package co.airy.core.webhook.publisher;

import co.airy.core.webhook.WebhookEvent;
import co.airy.log.AiryLoggerFactory;
import com.dinstone.beanstalkc.JobProducer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class BeanstalkPublisher {
    private static final Logger log = AiryLoggerFactory.getLogger(BeanstalkPublisher.class);

    private final ObjectMapper objectMapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    private final JobProducer beanstalkdJobProducer;

    BeanstalkPublisher(JobProducer beanstalkdJobProducer) {
        this.beanstalkdJobProducer = beanstalkdJobProducer;
    }

    void publishMessage(WebhookEvent event) {
        try {
            beanstalkdJobProducer.putJob(1, 1, 10000, objectMapper.writeValueAsBytes(event));
        } catch (JsonProcessingException e) {
            log.error("Failed to publish event to Beanstalkd", e);
            throw new RuntimeException(e);
        }
    }
}
