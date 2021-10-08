package co.airy.core.media;

import co.airy.core.media.services.MediaUpload;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
public class MediaController implements HealthIndicator {
    private static final Logger log = AiryLoggerFactory.getLogger(MediaController.class);
    private final MediaUpload mediaUpload;

    public MediaController(MediaUpload mediaUpload) {
        this.mediaUpload = mediaUpload;
    }

    @PostMapping(value = {"/media.upload", "media.uploadFile"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> mediaUpload(@RequestParam("file") MultipartFile multipartFile) {
        final String originalFileName = multipartFile.getOriginalFilename();

        if (originalFileName == null) {
            return ResponseEntity.unprocessableEntity().body(new RequestErrorResponsePayload("Request is missing original file name"));
        }

        try {
            final InputStream is = multipartFile.getInputStream();
            String fileName = UUIDv5.fromFile(is).toString();

            final String originalFileExtension = originalFileName.contains(".") ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
            fileName = fileName.concat(originalFileExtension);

            return ResponseEntity.ok(new MediaUploadResponsePayload(mediaUpload.uploadMedia(is, fileName)));
        } catch (Exception e) {
            log.error("Media upload failed:", e);
            return ResponseEntity.badRequest().body(new RequestErrorResponsePayload(String.format("Media Upload failed with error: %s", e.getMessage())));
        }
    }

    @Override
    public Health health() {
        return Health.up().build();
    }
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MediaUploadResponsePayload {
    private String mediaUrl;
}

