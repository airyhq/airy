package co.airy.core.api.components.installer.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class InstalledComponentsCache {

    @Bean
    public ConcurrentMapCacheManager cache() {
        return new ConcurrentMapCacheManager("installedComponents");
    }
}
