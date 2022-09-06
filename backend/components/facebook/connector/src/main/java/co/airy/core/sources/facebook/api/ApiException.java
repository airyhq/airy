package co.airy.core.sources.facebook.api;

import lombok.Getter;

public class ApiException extends RuntimeException {
    @Getter
    private String errorPayload;
    public ApiException(String message) {
        super(message);
    }
    public ApiException(String message, String errorPayload) {
        super(message);
        this.errorPayload = errorPayload;
    }
}
