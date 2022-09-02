package co.airy.core.chat_plugin;

import org.springframework.http.HttpHeaders;

import javax.servlet.http.HttpServletRequest;

public class Headers {
    public static String getAuthToken(HttpServletRequest request) {
        return getAuthToken(request.getHeader(HttpHeaders.AUTHORIZATION));
    }

    public static String getAuthToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }
}
