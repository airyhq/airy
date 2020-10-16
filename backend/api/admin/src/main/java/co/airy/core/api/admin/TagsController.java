package co.airy.core.api.admin;

import co.airy.avro.communication.Tag;
import co.airy.avro.communication.TagColor;
import co.airy.core.api.admin.payload.CreateTagRequestPayload;
import co.airy.core.api.admin.payload.CreateTagResponsePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@RestController
public class TagsController {
    @Autowired
    Stores stores;

    private static final Map<String, TagColor> tagColors = Map.of(
            "tag-blue", TagColor.BLUE,
            "tag-red", TagColor.RED,
            "tag-green", TagColor.GREEN,
            "tag-purple", TagColor.PURPLE
    );

    @PostMapping("/tags.create")
    ResponseEntity<?> createTag(@RequestBody @Valid CreateTagRequestPayload payload) {
        final Tag tag = Tag.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setColor(tagColors.get(payload.getColor()))
                .setName(payload.getName())
                .build();

        try {
            stores.storeTag(tag);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(201).body(CreateTagResponsePayload.builder().id(tag.getId()).build());
    }
}
