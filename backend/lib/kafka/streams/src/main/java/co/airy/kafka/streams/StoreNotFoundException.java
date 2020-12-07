package co.airy.kafka.streams;

public class StoreNotFoundException extends RuntimeException {
    private static final String ERROR_MESSAGE = "Store %s is not initialized";

    public StoreNotFoundException(final String storeName) {
        super(String.format(ERROR_MESSAGE, storeName));
    }
}
