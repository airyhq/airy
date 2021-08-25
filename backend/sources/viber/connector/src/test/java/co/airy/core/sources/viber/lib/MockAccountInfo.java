package co.airy.core.sources.viber.lib;

import co.airy.core.sources.viber.dto.AccountInfo;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockAccountInfo {
    @Bean
    @Primary
    public AccountInfo mockAccountInfo() {
        return new AccountInfo("Viber bot", "viber account id", null);
    }
}
