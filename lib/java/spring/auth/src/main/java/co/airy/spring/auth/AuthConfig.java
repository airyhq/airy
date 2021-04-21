package co.airy.spring.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true
)
public class AuthConfig extends WebSecurityConfigurerAdapter {
    private final String[] ignoreAuthPatterns;
    private final String systemToken;

    public AuthConfig(@Value("${systemToken:#{null}}") String systemToken, List<IgnoreAuthPattern> ignorePatternBeans) {
        this.systemToken = systemToken;
        this.ignoreAuthPatterns = ignorePatternBeans.stream()
                .flatMap((ignoreAuthPatternBean -> ignoreAuthPatternBean.getIgnorePattern().stream()))
                .toArray(String[]::new);
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.cors().and()
                .csrf().disable()
                // Don't let Spring create its own session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        if (this.systemToken != null) {
            http.addFilter(new AuthenticationFilter(authenticationManager(), this.systemToken))
                    .authorizeRequests(authorize -> authorize
                            .antMatchers("/actuator/**", "/ws*").permitAll()
                            .antMatchers(ignoreAuthPatterns).permitAll()
                            .anyRequest().authenticated()
                    );
        }
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(final Environment environment) {
        final String allowed = environment.getProperty("allowedOrigins", "");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern(allowed);
        config.addAllowedHeader("*");
        config.setAllowedMethods(List.of("GET", "POST"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
