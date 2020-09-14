package co.airy.spring.web.auth.interceptors;

import co.airy.spring.web.auth.jwt.Jwt;
import io.opentracing.Span;
import io.opentracing.util.GlobalTracer;
import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Component
public class JwtAuthHandlerInterceptorAdapter extends HandlerInterceptorAdapter {

    public static final String USER_ID = "userId";
    public static final String USER_ORGANIZATIONS = "userOrganizations";

    @Autowired
    Jwt jwt;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized");
            return false;
        }

        String userId;
        List<String> organizationIds;
        try {
            final Pair<String, List<String>> userAndOrganizations = jwt.authenticate(authHeader);
            userId = userAndOrganizations.getValue0();
            organizationIds = userAndOrganizations.getValue1();
            if (userId == null || organizationIds == null) {
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized");
                return false;
            }
        } catch (Exception e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized");
            return false;
        }

        RequestContextHolder.currentRequestAttributes().setAttribute(USER_ID, userId, RequestAttributes.SCOPE_REQUEST);
        RequestContextHolder.currentRequestAttributes().setAttribute(USER_ORGANIZATIONS, organizationIds, RequestAttributes.SCOPE_REQUEST);

        final Span span = GlobalTracer.get().activeSpan();

        if (span != null) {
            span.setTag("user.id", userId);
            span.setTag("organization.ids", String.join(",", organizationIds));
        }
        return super.preHandle(request, response, handler);
    }
}
