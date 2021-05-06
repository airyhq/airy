package co.airy.core.chat_plugin.config;

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
    private final Jwt jwt;
    private final String systemToken;

    public AuthConfig(Jwt jwt, @Value("${systemToken:#{null}}") String systemToken) {
        this.jwt = jwt;
        this.systemToken = systemToken;
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                // Don't let Spring create its own session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .addFilter(new JwtAuthenticationFilter(authenticationManager(), jwt, systemToken))
                .authorizeRequests()
                .antMatchers("/actuator/**", "/ws.chatplugin").permitAll()
                .mvcMatchers("/chatplugin.authenticate", "/chatplugin.resumeToken").permitAll()
                .anyRequest().authenticated();
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
