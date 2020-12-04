package co.airy.spring.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
public class IgnoreAuthPattern {
    public IgnoreAuthPattern(String... patterns) {
        this.ignorePattern = Arrays.asList(patterns);
    }
    private List<String> ignorePattern;
}
