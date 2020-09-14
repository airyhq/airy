package co.airy.spring.web.auth;

public class AuthenticationException extends Exception {

    public AuthenticationException(String error, Exception cause) {
        super(error, cause);
    }
}
