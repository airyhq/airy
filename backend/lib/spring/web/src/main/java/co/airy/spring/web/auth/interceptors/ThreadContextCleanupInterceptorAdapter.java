package backend.lib.spring.web.src.main.java.co.airy.spring.web.auth.interceptors;

import co.airy.log.AiryLoggerFactory;
import org.apache.logging.log4j.ThreadContext;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class ThreadContextCleanupInterceptorAdapter extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        ThreadContext.clearAll();
        return super.preHandle(request, response, handler);
    }
}
