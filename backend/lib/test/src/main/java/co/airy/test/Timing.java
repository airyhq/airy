package co.airy.test;

public class Timing {
    private static final long MAX_WAIT_MS = 30_000;

    public static void retryOnException(RunnableTest runnableTest, String failureMessage) throws InterruptedException {
        retryOnExceptionWithTimeout(runnableTest, failureMessage);
    }

    private static void retryOnExceptionWithTimeout(RunnableTest runnableTest, String failureMessage) throws InterruptedException {
        long expectedEnd = System.currentTimeMillis() + MAX_WAIT_MS;

        while (true) {
            try {
                runnableTest.test();
                return;
            } catch (Throwable t) {

                if (expectedEnd <= System.currentTimeMillis()) {
                    throw new AssertionError(failureMessage);
                }
            }

            Thread.sleep(100);
        }
    }
}