package co.airy.core.rasa_connector;


import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RasaClientConfig {
    @Bean
    public RasaClient rasaClient(@Value("${rasa.rest-webhook-url}") String rasaRestUrl) {
        return Feign.builder()
                .client(new OkHttpClient())
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .logger(new feign.Logger.ErrorLogger())
                .logLevel(feign.Logger.Level.FULL)
                .target(RasaClient.class, rasaRestUrl);
    }
}
