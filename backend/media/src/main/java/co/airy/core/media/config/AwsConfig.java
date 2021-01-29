package co.airy.core.media.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsConfig {

    @Bean
    public AmazonS3 amazonS3Client(@Value("${storage.s3.key}") final String mediaS3Key,
                                   @Value("${storage.s3.secret}") final String mediaS3Secret,
                                   @Value("${storage.s3.region}") final String region) {
        AWSCredentials credentials = new BasicAWSCredentials(
                mediaS3Key,
                mediaS3Secret
        );

        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }
}
