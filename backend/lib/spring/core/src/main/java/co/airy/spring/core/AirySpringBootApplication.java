package co.airy.spring.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;


@SpringBootApplication(scanBasePackages = "co.airy")
@PropertySources({
        @PropertySource("classpath:default.properties"),
        @PropertySource(value = "classpath:application.properties", ignoreResourceNotFound = true)
})
public class AirySpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirySpringBootApplication.class, args);
    }
}
