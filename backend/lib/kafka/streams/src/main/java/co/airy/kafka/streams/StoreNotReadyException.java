package co.airy.kafka.streams;

public class StoreNotReadyException extends RuntimeException {
    private static final String ERROR_MESSAGE = "Store %s is not initialized";

    StoreNotReadyException(final String storeName) {
        super(String.format(ERROR_MESSAGE, storeName));
    }
}
