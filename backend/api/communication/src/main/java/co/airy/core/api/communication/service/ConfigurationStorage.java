package co.airy.core.api.communication.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.LinkedBlockingQueue;


@Configuration
public class ConfigurationStorage {
@Bean(name = "EndLessQueue")
    public LinkedBlockingQueue<Object> getQueue() {
       return new LinkedBlockingQueue<>();
    }


}
