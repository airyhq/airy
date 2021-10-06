package co.airy.tracking;

import co.airy.log.AiryLoggerFactory;
import com.segment.analytics.Analytics;
import lombok.Getter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;


@Configuration
@Getter
@ConditionalOnProperty("segment.analytics.enabled")
public class SegmentAnalytics {
    private static final Logger log = AiryLoggerFactory.getLogger(SegmentAnalytics.class);


    private String writeKey = "xCK4HrNJxaP5pXClLxgShD4FkAp5PG53";
    private Analytics analytics;
    private String coreId;

    public SegmentAnalytics(@Value("${CORE_ID}") final String coreId, @Value("${segment.analytics.enabled}") final String enabled) {
        log.warn("Segment Analytics property found");
        this.analytics = Analytics.builder(writeKey).build();
        this.coreId = coreId;
    }
}
