package co.airy.spring.web.filters;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RequestLoggingIgnorePatterns {
    private List<String> patterns;
}
