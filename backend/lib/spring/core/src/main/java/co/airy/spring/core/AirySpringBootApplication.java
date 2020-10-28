package co.airy.spring.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;


@SpringBootApplication(scanBasePackages = "co.airy")
@PropertySource(value = {"classpath:default.properties", "classpath:application.properties"})
public class AirySpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirySpringBootApplication.class, args);
    }
}
