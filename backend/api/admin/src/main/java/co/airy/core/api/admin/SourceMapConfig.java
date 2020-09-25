package co.airy.core.api.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;

@Configuration
class SourceMapConfig {
    @Autowired
    List<Source> sources;

    @Bean
    public SourceMap sourceMap() {
        SourceMap sourceMap = new SourceMap();

        for (Source source : sources) {
            sourceMap.put(source.getIdentifier(), source);
        }

        return sourceMap;
    }

    static class SourceMap extends HashMap<String, Source> {
    }
}
