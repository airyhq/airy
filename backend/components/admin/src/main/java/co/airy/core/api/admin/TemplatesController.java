package co.airy.core.api.admin;

import co.airy.avro.communication.Template;
import co.airy.core.api.admin.payload.CreateTemplateRequestPayload;
import co.airy.core.api.admin.payload.DeleteTemplateRequestPayload;
import co.airy.core.api.admin.payload.GetTemplateRequestPayload;
import co.airy.core.api.admin.payload.ListTemplatesRequestPayload;
import co.airy.core.api.admin.payload.TemplatesResponsePayload;
import co.airy.core.api.admin.payload.UpdateTemplateRequestPayload;
import co.airy.model.template.TemplatePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static java.util.stream.Collectors.toList;

@RestController
public class TemplatesController {
    private final Stores stores;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TemplatesController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/templates.create")
    ResponseEntity<?> createTemplate(@RequestBody @Valid CreateTemplateRequestPayload payload) throws JsonProcessingException {
        final Template template = Template.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setName(payload.getName())
                .setSource(payload.getSource())
                .setContent(objectMapper.writeValueAsString(payload.getContent()))
                .build();

        try {
            stores.storeTemplate(template);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(201).body(TemplatePayload.fromTemplate(template));
    }

    @PostMapping("/templates.info")
    ResponseEntity<?> getTemplate(@RequestBody @Valid GetTemplateRequestPayload payload) {
        final Template template = stores.getTemplatesStore().get(payload.getId().toString());
        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(TemplatePayload.fromTemplate(template));
    }

    @PostMapping("/templates.delete")
    ResponseEntity<?> deleteTemplate(@RequestBody @Valid DeleteTemplateRequestPayload payload) {
        final Template template = stores.getTemplatesStore().get(payload.getId().toString());
        if (template == null) {
            return ResponseEntity.notFound().build();
        }
        stores.deleteTemplate(template);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/templates.list")
    ResponseEntity<?> listTemplates(@RequestBody @Valid ListTemplatesRequestPayload payload) {
        final List<TemplatePayload> response = stores.getTemplates().stream()
                .filter(t -> t.getSource().equals(payload.getSource()))
                .filter(t -> (payload.getName() == null || payload.getName().isEmpty()) || t.getName().contains(payload.getName()))
                .map(TemplatePayload::fromTemplate)
                .collect(toList());

        return ResponseEntity.ok(new TemplatesResponsePayload(response));
    }

    @PostMapping("/templates.update")
    ResponseEntity<?> updateTemplate(@RequestBody @Valid UpdateTemplateRequestPayload payload) throws JsonProcessingException {
        final Template template = stores.getTemplate(payload.getId().toString());

        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        if (payload.getName() != null) {
            template.setName(payload.getName());
        }

        if (payload.getContent() != null) {
            template.setContent(objectMapper.writeValueAsString(payload.getContent()));
        }

        if (payload.getSource() != null) {
            template.setSource(payload.getSource());
        }

        try {
            stores.storeTemplate(template);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.ok(TemplatePayload.fromTemplate(template));
    }
}
