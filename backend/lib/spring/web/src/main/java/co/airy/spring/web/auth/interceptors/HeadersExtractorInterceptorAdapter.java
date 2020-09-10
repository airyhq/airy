package backend.lib.spring.web.src.main.java.co.airy.spring.web.auth.interceptors;

import co.airy.spring.web.auth.AiryHeaders;
import io.opentracing.Span;
import io.opentracing.util.GlobalTracer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class HeadersExtractorInterceptorAdapter extends HandlerInterceptorAdapter {

    public static final String APP_ID = "appId";
    public static final String DEVICE_TYPE = "deviceType";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        final String appId = request.getHeader(AiryHeaders.APP_ID);
        final String deviceType = request.getHeader(AiryHeaders.DEVICE_TYPE);

        //TODO: validate presence of the above headers, and reject it if one is missing

        RequestContextHolder.currentRequestAttributes().setAttribute(APP_ID, appId == null ? "" : appId, RequestAttributes.SCOPE_REQUEST);
        RequestContextHolder.currentRequestAttributes().setAttribute(DEVICE_TYPE, deviceType == null ? "" : deviceType, RequestAttributes.SCOPE_REQUEST);

        final Span span = GlobalTracer.get().activeSpan();

        if (span != null) {
            span.setTag("app.id", appId);
            span.setTag("device.type", deviceType);
        }
        return super.preHandle(request, response, handler);
    }
}
