package co.airy.spring.async;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncExecutorConfig {

    private static final Logger log = AiryLoggerFactory.getLogger(AsyncExecutorConfig.class);

    @Bean("threadPoolTaskExecutor")
    public Executor threadPoolTaskExecutor(
            @Value("${thpool.core-pool-size}") int corePoolSize,
            @Value("${thpool.max-pool-size}") int maxPoolSize,
            @Value("${thpool.queue-capacity}") int queueCapacity) {
        ThreadPoolTaskExecutor pool = new ThreadPoolTaskExecutor();

        if (maxPoolSize != 0) {
            pool.setMaxPoolSize(maxPoolSize);
        }
        if (corePoolSize != 0) {
            pool.setCorePoolSize(corePoolSize);
        }
        if (queueCapacity != 0) {
            pool.setQueueCapacity(queueCapacity);
        }

        log.info(String.format("Pool created with specs: corePoolSize: %d, maxPoolSize: %d, queueCapacity: %d",
                    pool.getCorePoolSize(),
                    pool.getMaxPoolSize(),
                    queueCapacity));

        return pool;
    }
}
