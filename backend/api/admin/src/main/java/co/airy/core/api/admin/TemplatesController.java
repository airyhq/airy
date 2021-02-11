package co.airy.core.api.admin;

import co.airy.avro.communication.Template;
import co.airy.core.api.admin.payload.CreateTemplateRequestPayload;
import co.airy.core.api.admin.payload.DeleteTemplateRequestPayload;
import co.airy.core.api.admin.payload.GetTemplateRequestPayload;
import co.airy.core.api.admin.payload.ListTemplatesRequestPayload;
import co.airy.core.api.admin.payload.TemplatesResponsePayload;
import co.airy.core.api.admin.payload.UpdateTemplateRequestPayload;
import co.airy.model.template.TemplatePayload;
import co.airy.spring.web.payload.EmptyResponsePayload;
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
    private final ObjectMapper objectMapper;

    public TemplatesController(Stores stores, ObjectMapper objectMapper) {
        this.stores = stores;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/templates.create")
    ResponseEntity<?> createTemplate(@RequestBody @Valid CreateTemplateRequestPayload payload) throws JsonProcessingException {
        final Template template = Template.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setName(payload.getName())
                .setContent(payload.getContent())
                .setVariables(objectMapper.writeValueAsString(payload.getVariables()))
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
        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    @PostMapping("/templates.list")
    ResponseEntity<?> listTemplates(@RequestBody @Valid ListTemplatesRequestPayload payload) {
        final List<TemplatePayload> response = stores.getTemplates().stream()
                .filter(t -> t.getName().contains(payload.getName()))
                .map(TemplatePayload::fromTemplate)
                .collect(toList());

        return ResponseEntity.ok(new TemplatesResponsePayload(response));
    }

    @PostMapping("/templates.update")
    ResponseEntity<?> updateTemplate(@RequestBody @Valid UpdateTemplateRequestPayload payload) throws JsonProcessingException {
        final Template template = stores.getTemplate(payload.getName());

        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        template.setContent(payload.getName());
        template.setContent(objectMapper.writeValueAsString(payload.getContent()));

        try {
            stores.storeTemplate(template);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.ok(TemplatePayload.fromTemplate(template));
    }
}
