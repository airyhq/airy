package co.airy.spring.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true
)
public class AuthConfig extends WebSecurityConfigurerAdapter {
    private final Jwt jwt;
    private final String[] ignoreAuthPatterns;
    public AuthConfig(Jwt jwt, List<IgnoreAuthPattern> ignorePatternBeans) {
        this.jwt = jwt;
        this.ignoreAuthPatterns = ignorePatternBeans.stream()
                .flatMap((ignoreAuthPatternBean -> ignoreAuthPatternBean.getIgnorePattern().stream()))
                .toArray(String[]::new);
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.cors().disable().csrf().disable()
                .addFilter(new JwtAuthenticationFilter(authenticationManager(), jwt))
                .authorizeRequests(authorize -> authorize
                        .antMatchers("/actuator/**", "/ws.communication").permitAll()
                        .antMatchers(ignoreAuthPatterns).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
