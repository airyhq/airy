package co.airy.core.media.services;

import co.airy.log.AiryLoggerFactory;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.Getter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

@Service
@EnableRetry
public class MediaUpload implements HealthIndicator {
    private static final Logger log = AiryLoggerFactory.getLogger(MediaUpload.class);
    private final AmazonS3 amazonS3Client;
    private final String bucket;
    private final String path;
    private final URL host;

    @Getter
    private boolean connectionStatus;

    public MediaUpload(AmazonS3 amazonS3Client,
                       @Value("${s3.bucket}") String bucket,
                       @Value("${s3.path}") String path) throws MalformedURLException {
        this.amazonS3Client = amazonS3Client;
        this.bucket = bucket;
        this.path = appendSlash(path);
        this.host = new URL(String.format("https://%s.s3.amazonaws.com/", bucket));

        // Check if the connection is healthy. This is only done during the construction face
        checkConnectionStatus();
    }

    @Retryable
    public String uploadMedia(final InputStream is, String fileName) throws Exception {
        fileName = path + fileName;
        final String contentType = resolveContentType(fileName, is);

        final ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(contentType);

        final PutObjectRequest putObjectRequest = new PutObjectRequest(
                bucket,
                fileName,
                is,
                objectMetadata
        ).withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3Client.putObject(putObjectRequest);

        return new URL(host, fileName).toString();
    }

    private String resolveContentType(final String fileName, final InputStream is) throws IOException {
        final String contentType = URLConnection.guessContentTypeFromStream(is);
        return contentType == null ? URLConnection.guessContentTypeFromName(fileName) : contentType;
    }

    private String appendSlash(String path) {
        return !path.endsWith("/") ? path + "/" : path;
    }

    private void checkConnectionStatus() {
        connectionStatus = false;
        try {
            List<Bucket> buckets = amazonS3Client.listBuckets();
            if (buckets != null) {
                log.info("check connection to S3 successful");
                connectionStatus = true;
            }
        } catch (SdkClientException e) {
            log.error("AWS SDK exception", e);

        } catch (Exception e) {
            log.error("unexpected exception", e);
        }
    }

    @Override
    public Health health() {
        if (connectionStatus) {
            return Health.up().build();
        }
        log.error("s3 connection status is not healthy check credentials");
        return Health.down().build();
    }
}
