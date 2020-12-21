package co.airy.core.sources.facebook;

public class ApiException extends RuntimeException {
    public ApiException(String msg) {
        super(msg);
    }
}
