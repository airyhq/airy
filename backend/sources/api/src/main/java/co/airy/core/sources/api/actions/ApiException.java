package co.airy.core.sources.api.actions;

public class ApiException extends RuntimeException{
    public ApiException(String msg) {
        super(msg);
    }
}
