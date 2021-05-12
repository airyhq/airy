package co.airy.spring.auth;

import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.oidc.ConfigProvider;
import co.airy.spring.auth.oidc.EmailFilter;
import co.airy.spring.auth.oidc.UserService;
import co.airy.spring.auth.session.AuthCookie;
import co.airy.spring.auth.session.CookieSecurityContextRepository;
import co.airy.spring.auth.session.Jwt;
import co.airy.spring.auth.token.AuthenticationFilter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true
)
public class AuthConfig extends WebSecurityConfigurerAdapter {
    private static final Logger log = AiryLoggerFactory.getLogger(AuthConfig.class);
    private final String[] ignoreAuthPatterns;
    private final String systemToken;
    private final String jwtSecret;
    private final ConfigProvider configProvider;

    public AuthConfig(@Value("${systemToken:#{null}}") String systemToken,
                      @Value("${jwtSecret:#{null}}") String jwtSecret,
                      List<IgnoreAuthPattern> ignorePatternBeans,
                      ConfigProvider configProvider
    ) {
        this.systemToken = systemToken;
        this.jwtSecret = jwtSecret;
        this.ignoreAuthPatterns = ignorePatternBeans.stream()
                .flatMap((ignoreAuthPatternBean -> ignoreAuthPatternBean.getIgnorePattern().stream()))
                .toArray(String[]::new);
        this.configProvider = configProvider;
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.cors().and()
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        if (systemToken != null || configProvider.isPresent()) {
            http.authorizeRequests(authorize -> authorize
                    .antMatchers("/actuator/**").permitAll()
                    .antMatchers(ignoreAuthPatterns).permitAll()
                    .anyRequest().authenticated()
            ).exceptionHandling().authenticationEntryPoint(new Http403ForbiddenEntryPoint());

            if (systemToken != null) {
                log.info("System token auth enabled");
                http.addFilterBefore(new AuthenticationFilter(systemToken), AnonymousAuthenticationFilter.class);
            }

            if (configProvider.isPresent()) {
                log.info("Oidc auth enabled with provider: {}", configProvider.getRegistration().getRegistrationId());
                http
                        .securityContext().securityContextRepository(new CookieSecurityContextRepository(new Jwt(jwtSecret)))
                        .and().logout().permitAll().deleteCookies(AuthCookie.NAME)
                        .and()
                        .oauth2Login(oauth2 -> oauth2
                                .defaultSuccessUrl("/ui/")
                        )
                        .addFilterAfter(new EmailFilter(configProvider), OAuth2LoginAuthenticationFilter.class);
            }
        }
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(final Environment environment) {
        final String allowed = environment.getProperty("allowedOrigins", "");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList(allowed.split(",")));
        config.addAllowedHeader("*");
        config.setAllowedMethods(List.of("GET", "POST"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
