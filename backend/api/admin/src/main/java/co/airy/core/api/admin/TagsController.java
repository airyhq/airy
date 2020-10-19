package co.airy.core.api.admin;

import co.airy.avro.communication.Tag;
import co.airy.avro.communication.TagColor;
import co.airy.core.api.admin.payload.CreateTagRequestPayload;
import co.airy.core.api.admin.payload.CreateTagResponsePayload;
import co.airy.core.api.admin.payload.DeleteTagRequestPayload;
import co.airy.core.api.admin.payload.ListTagsResponsePayload;
import co.airy.core.api.admin.payload.TagResponsePayload;
import co.airy.payload.response.EmptyResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

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

        return ResponseEntity.status(201).body(CreateTagResponsePayload.builder().id(tag.getId().toString()).build());
    }

    @PostMapping("/tags.list")
    ResponseEntity<?> listTags() {
        final ReadOnlyKeyValueStore<String, Tag> store = stores.getTagsStore();
        final KeyValueIterator<String, Tag> iterator = store.all();

        List<Tag> tags = new ArrayList<>();
        iterator.forEachRemaining(kv -> tags.add(kv.value));

        final List<TagResponsePayload> data = tags.stream()
                .map(tag -> TagResponsePayload.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .color(tag.getColor().toString())
                        .build()
                ).collect(Collectors.toList());

        return ResponseEntity.ok().body(ListTagsResponsePayload.builder().data(data).build());
    }

    @PostMapping("/tags.delete")
    ResponseEntity<?> deleteTag(@RequestBody @Valid DeleteTagRequestPayload payload) {
        final Tag tag = stores.getTagsStore().get(payload.getId().toString());
        if( tag == null) {
            return ResponseEntity.notFound().build();
        }

        stores.deleteTag(tag);
        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}
