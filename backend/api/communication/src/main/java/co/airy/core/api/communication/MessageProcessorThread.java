
package co.airy.core.api.communication;

import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import org.apache.commons.lang3.concurrent.BasicThreadFactory;
import javax.annotation.PreDestroy;

/**
 * MessageProcessorThread
 * <br>
 * <code>co.airy.core.api.communication.MessageProcessorThread</code>
 * <br>
 *@author Abhinav Jain
 * @since 23 February 2022
 *
 */

@Component
public class MessageProcessorThread {
    private ExecutorService executorService;

    @PostConstruct
    public void init() {

        BasicThreadFactory factory = new BasicThreadFactory.Builder()
                .namingPattern("myspringbean-thread-%d").build();

        executorService = Executors.newSingleThreadExecutor(factory);
        executorService.execute(new Runnable() {

            @Override
            public void run() {
                try {
                    // do something
                    System.out.println("thread started");
                } catch (Exception e) {
                    logger.error("error: ", e);
                }
            }
        });

        executorService.shutdown();

    }
}

