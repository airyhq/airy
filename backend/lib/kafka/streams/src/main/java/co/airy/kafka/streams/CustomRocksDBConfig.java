package backend.lib.kafka.streams.src.main.java.co.airy.kafka.streams;

import org.apache.kafka.streams.state.RocksDBConfigSetter;

import java.util.Map;

import org.rocksdb.Options;
import org.rocksdb.CompressionType;

public class CustomRocksDBConfig implements RocksDBConfigSetter {

    @Override
    public void setConfig(String storeName, Options options, Map<String, Object> configs) {
        options.setCompressionType(CompressionType.LZ4_COMPRESSION);
        options.setBottommostCompressionType(CompressionType.ZSTD_COMPRESSION);

    }

}
