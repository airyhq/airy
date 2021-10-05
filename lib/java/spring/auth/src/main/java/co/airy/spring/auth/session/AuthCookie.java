package co.airy.spring.auth.session;

import javax.servlet.http.Cookie;

public class AuthCookie extends Cookie {
    public static String NAME = "airy_auth_token";
    private static final String PATH = "/";

    public AuthCookie(String value) {
        super(NAME, value);
        this.setPath(PATH);
    }
}
