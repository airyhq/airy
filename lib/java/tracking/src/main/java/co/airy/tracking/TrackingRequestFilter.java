package co.airy.tracking;


import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty("segment.analytics.enabled")
public class TrackingRequestFilter extends OncePerRequestFilter {
    private final SegmentAnalytics segmentAnalytics;
    private final List<RouteTracking> routeTrackingBeans;

    TrackingRequestFilter(List<RouteTracking> routeTrackingBeans, SegmentAnalytics segmentAnalytics) {
        this.routeTrackingBeans = routeTrackingBeans;
        this.segmentAnalytics = segmentAnalytics;
    }

    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } finally {
            if ("POST".equals(httpServletRequest.getMethod())) {
                String requestUrl = httpServletRequest.getRequestURI();
                for (RouteTracking routeTracking : routeTrackingBeans) {
                    if (routeTracking.getUrlPattern().matcher(requestUrl).matches()) {
                        final Map<String, String> properties = new HashMap<>();
                        properties.put("responseStatus", String.valueOf(httpServletResponse.getStatus()));
                        segmentAnalytics.getAnalytics().enqueue(routeTracking.getTrackMessage(properties));
                    }
                }
            }
        }
    }
}
