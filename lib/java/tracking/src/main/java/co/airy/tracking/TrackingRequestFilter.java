package co.airy.tracking;


import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
@ConditionalOnProperty("segment.analytics.enabled")
public class TrackingRequestFilter extends OncePerRequestFilter {
    private static final Logger log = AiryLoggerFactory.getLogger(TrackingRequestFilter.class);

    private SegmentAnalytics segmentAnalytics;
    private List<RouteTracking> routeTrackingBeans;

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
                        routeTracking.addProperty("responseStatus", String.valueOf(httpServletResponse.getStatus()));
                        segmentAnalytics.getAnalytics().enqueue(routeTracking.getTrackMessage());
                    }
                }
            }
        }
    }
}
