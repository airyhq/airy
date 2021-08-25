package co.airy.test;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;

public class Timing {
    private static final Logger log = AiryLoggerFactory.getLogger(Timing.class);
    private static final int DEFAULT_MAX_WAIT_MS = 30_000;

    public static void retryOnException(RunnableTest runnableTest, String failureMessage) throws InterruptedException {
        retryOnException(runnableTest, failureMessage, DEFAULT_MAX_WAIT_MS);
    }

    public static void retryOnException(RunnableTest runnableTest, String failureMessage, int maxWaitMs) throws InterruptedException {
        long expectedEnd = System.currentTimeMillis() + maxWaitMs;

        while (true) {
            try {
                runnableTest.test();
                return;
            } catch (Throwable t) {
                log.info(t.getLocalizedMessage());
                if (expectedEnd <= System.currentTimeMillis()) {
                    throw new AssertionError(failureMessage);
                }
            }

            Thread.sleep(100);
        }
    }

}
