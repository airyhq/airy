package co.airy.core.webhook.publisher;

import co.airy.core.webhook.publisher.payload.QueueMessage;
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

    final ObjectMapper objectMapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    private final JobProducer beanstalkdJobProducer;

    BeanstalkPublisher(JobProducer beanstalkdJobProducer) {
        this.beanstalkdJobProducer = beanstalkdJobProducer;
    }


    void publishMessage(QueueMessage message) {
        try {
            beanstalkdJobProducer.putJob(1, 1, 5000, objectMapper.writeValueAsBytes(message));
        } catch (JsonProcessingException e) {
            log.error("Failed to publish message to Beanstalkd", e);
        }
    }
}
