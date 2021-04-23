package co.airy.core.api.admin;

import co.airy.avro.communication.Tag;
import co.airy.avro.communication.TagColor;
import co.airy.core.api.admin.payload.CreateTagRequestPayload;
import co.airy.core.api.admin.payload.DeleteTagRequestPayload;
import co.airy.core.api.admin.payload.ListTagsResponsePayload;
import co.airy.core.api.admin.payload.TagPayload;
import co.airy.core.api.admin.payload.UpdateTagRequestPayload;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static java.util.stream.Collectors.toList;

@RestController
public class TagsController {
    private static final Map<String, TagColor> tagColors = Map.of(
            "tag-blue", TagColor.BLUE,
            "tag-red", TagColor.RED,
            "tag-green", TagColor.GREEN,
            "tag-purple", TagColor.PURPLE
    );

    private final Stores stores;
    private final String wrongTagColorErrorMessage;

    TagsController(Stores stores) {
        this.stores = stores;
        this.wrongTagColorErrorMessage = String.format("Tag color must be one of %s", tagColors.keySet());
    }

    @PostMapping("/tags.create")
    ResponseEntity<?> createTag(@RequestBody @Valid CreateTagRequestPayload payload) {
        if (!tagColors.containsKey(payload.getColor())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload(wrongTagColorErrorMessage));
        }

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

        return ResponseEntity.status(201).body(TagPayload.fromTag(tag));
    }

    @PostMapping("/tags.list")
    ResponseEntity<ListTagsResponsePayload> listTags() {
        final ReadOnlyKeyValueStore<String, Tag> store = stores.getTagsStore();
        final KeyValueIterator<String, Tag> iterator = store.all();

        List<Tag> tags = new ArrayList<>();
        iterator.forEachRemaining(kv -> tags.add(kv.value));

        final List<TagPayload> data = tags.stream().map(TagPayload::fromTag).collect(toList());

        return ResponseEntity.ok().body(ListTagsResponsePayload.builder().data(data).build());
    }

    @PostMapping("/tags.delete")
    ResponseEntity<Void> deleteTag(@RequestBody @Valid DeleteTagRequestPayload payload) {
        final Tag tag = stores.getTagsStore().get(payload.getId().toString());
        if (tag == null) {
            return ResponseEntity.notFound().build();
        }

        stores.deleteTag(tag);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tags.update")
    ResponseEntity<?> updateTag(@RequestBody @Valid UpdateTagRequestPayload payload) {
        final Tag tag = stores.getTagsStore().get(payload.getId().toString());
        if (tag == null) {
            return ResponseEntity.notFound().build();
        }

        final String color = payload.getColor();
        if (color != null && !tagColors.containsKey(color)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload(wrongTagColorErrorMessage));
        }
        if (color != null) {
            tag.setColor(tagColors.get(color));
        }

        tag.setName(Optional.ofNullable(payload.getName()).orElse(tag.getName()));

        try {
            stores.storeTag(tag);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}
