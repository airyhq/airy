package co.airy.core.sources.google;

public class ApiException extends RuntimeException {
    public ApiException() {
        super();
    }
    public ApiException(String msg) {
        super(msg);
    }
}
