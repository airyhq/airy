package co.airy.spring.auth;

import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.oidc.ConfigProvider;
import co.airy.spring.auth.oidc.EmailFilter;
import co.airy.spring.auth.session.AuthCookie;
import co.airy.spring.auth.session.CookieSecurityContextRepository;
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
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    private final String logoutSuccessUrl;
    private final String loginSuccessUrl;

    public AuthConfig(@Value("${systemToken:#{null}}") String systemToken,
                      @Value("${jwtSecret:#{null}}") String jwtSecret,
                      List<IgnoreAuthPattern> ignorePatternBeans,
                      ConfigProvider configProvider,
                      @Value("${oidc.logoutSuccessUrl:/control-center/}") String logoutSuccessUrl,
                      @Value("${oidc.loginSuccessUrl:/control-center/}") String loginSuccessUrl
    ) {
        this.systemToken = systemToken;
        this.jwtSecret = jwtSecret;
        this.ignoreAuthPatterns = ignorePatternBeans.stream()
                .flatMap((ignoreAuthPatternBean -> ignoreAuthPatternBean.getIgnorePattern().stream()))
                .toArray(String[]::new);
        this.configProvider = configProvider;
        this.logoutSuccessUrl = logoutSuccessUrl;
        this.loginSuccessUrl = loginSuccessUrl;
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.cors().and()
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        if (hasTokenAuth() || hasOidcAuth()) {
            http.authorizeRequests(authorize -> authorize
                    .antMatchers("/actuator/**", "/login/**", "/logout/**", "/oauth/**").permitAll()
                    .antMatchers(ignoreAuthPatterns).permitAll()
                    .anyRequest().authenticated()
            );

            if (hasTokenAuth()) {
                log.info("System token auth enabled");
                http.addFilterBefore(new AuthenticationFilter(systemToken, new Jwt(jwtSecret)), AnonymousAuthenticationFilter.class);
            }

            if (hasOidcAuth()) {
                final String registrationId = configProvider.getRegistration().getRegistrationId();
                log.info("Oidc auth enabled with provider: {}", registrationId);

                // By default, oauth2Login creates an authentication entrypoint that redirects clients to the
                // login form. For API clients we instead want to return a 403.
                http.exceptionHandling()
                        .defaultAuthenticationEntryPointFor(new Http403ForbiddenEntryPoint(),
                                new NegatedRequestMatcher(new OrRequestMatcher(new AntPathRequestMatcher("/login/**"),
                                        new AntPathRequestMatcher("/logout/**"), new AntPathRequestMatcher("/oauth/**"))));

                http
                        .securityContext().securityContextRepository(new CookieSecurityContextRepository(new Jwt(jwtSecret), new PrincipalAccess()))
                        .and().logout().permitAll().deleteCookies(AuthCookie.NAME)
                        .logoutSuccessUrl(logoutSuccessUrl)
                        .and()
                        .oauth2Login(oauth2 -> oauth2
                                // Replace the default login page with co.airy.spring.auth.oidc.LoginRedirect
                                .loginPage("/login")
                                .defaultSuccessUrl(this.loginSuccessUrl))
                        .addFilterAfter(new EmailFilter(configProvider), OAuth2LoginAuthenticationFilter.class);
            }
        }
    }

    private boolean hasTokenAuth() {
        return systemToken != null && jwtSecret != null;
    }

    private boolean hasOidcAuth() {
        return configProvider.isPresent();
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
