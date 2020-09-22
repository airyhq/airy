package co.airy.spring.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(scanBasePackages = "co.airy")
public class AirySpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirySpringBootApplication.class, args);
    }
}
