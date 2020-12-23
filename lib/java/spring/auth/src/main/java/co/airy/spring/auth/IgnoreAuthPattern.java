package co.airy.spring.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
public class IgnoreAuthPattern {
    private final List<String> ignorePattern;

    public IgnoreAuthPattern(String... patterns) {
        this.ignorePattern = Arrays.asList(patterns);
    }
}
