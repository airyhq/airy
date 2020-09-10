package backend.lib.payload.src.main.java.co.airy.payload.parser;

import co.airy.log.AiryLoggerFactory;
import co.airy.payload.response.AddressPayload;
import co.airy.payload.response.AdjustmentPayload;
import co.airy.payload.response.AttachmentPayload;
import co.airy.payload.response.AttachmentPayloadPayload;
import co.airy.payload.response.MessagePreviewPayload;
import co.airy.payload.response.OrderSummaryPayload;
import co.airy.payload.response.TemplateElementButtonPayload;
import co.airy.payload.response.TemplateElementPayload;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.slf4j.Logger;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;


public final class MessageParser {
    private static final Logger log = AiryLoggerFactory.getLogger(MessageParser.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static final DateTimeFormatter ISO_INSTANT_WITH_MILLIS_DF = new DateTimeFormatterBuilder().parseCaseInsensitive().appendInstant(3).toFormatter();

    private final JsonNode root;

    @Getter
    private String text, metadata, mediaType, displayText, sentAt, triggerType;

    @Getter
    private List<AttachmentPayload> attachments;

    private MessageParser(final Map<String, String> headers, final String content, final Long timestamp,
                          final String attachmentUrl) throws IOException {
        final String messageType = headers.get("SOURCE_MESSAGE_TYPE");

        switch (messageType) {
            case "MESSAGE":
            case "QUICK_REPLY":
            case "ECHO":
                root = objectMapper.readTree(content).get("message");
                JsonNode textNode = root.get("text");
                if (textNode != null) {
                    mediaType = "text";
                    text = textNode.textValue();
                }

                break;
            case "POSTBACK":
                root = objectMapper.readTree(content).get("postback");
                textNode = root.get("title");
                if (textNode != null) {
                    mediaType = "postback";
                    text = textNode.textValue();
                }

                JsonNode payloadNode = root.get("payload");
                if (payloadNode != null) {
                    triggerType = payloadNode.textValue();
                }

                break;
            default:
                throw new RuntimeException(String.format("Unknown message type %s: ", messageType));
        }

        metadata = root.get("metadata") != null ? root.get("metadata").textValue() : null;

        attachments = parseAttachments(attachmentUrl);

        if (attachments != null && attachments.size() > 0) {
            final AttachmentPayload attachment = attachments.get(0);
            final AttachmentPayloadPayload payload = attachment.getPayload();
            final Optional<AttachmentPayloadPayload> payloadOptional = Optional.ofNullable(payload);

            mediaType = attachment.getType();
            displayText = Stream.of(text, attachment.getTitle(), attachment.getUrl(), payloadOptional.map(AttachmentPayloadPayload::getText).orElse(null), payloadOptional.map(AttachmentPayloadPayload::getTitle).orElse(null), payloadOptional.map(AttachmentPayloadPayload::getUrl).orElse(null))
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("N/A");
        } else {
            displayText = text == null ? "N/A" : text;
            if (mediaType == null) {
                mediaType = "N/A";
            }
        }

        if (triggerType == null) {
            triggerType = mediaType;
        }

        sentAt = ISO_INSTANT_WITH_MILLIS_DF.format(Instant.ofEpochMilli(timestamp));
    }

    private List<AttachmentPayload> parseAttachments(final String attachmentUrl) {
        final JsonNode attachmentsNode = root.get("attachments");

        if (attachmentsNode == null) {
            return null;
        }

        final List<AttachmentPayload> attachmentPayloads = new ArrayList<>();

        attachmentsNode
            .elements()
            .forEachRemaining(attachmentNode -> {
                final JsonNode attachmentTypeNode = attachmentNode.get("type");

                attachmentPayloads.add(
                    AttachmentPayload.builder()
                        .type(Optional.ofNullable(attachmentTypeNode).map(JsonNode::textValue).orElse("N/A"))
                        .payload(getAttachmentPayload(attachmentNode, attachmentUrl))
                        .build()
                );
            });

        return attachmentPayloads;
    }


    private OrderSummaryPayload getOrderSummary(final JsonNode payloadNode) {
        final JsonNode summary = payloadNode.get("summary");

        if (summary == null) {
            return null;
        }

        return OrderSummaryPayload
            .builder()
            .shippingCost(summary.get("shipping_cost") != null ? summary.get("shipping_cost").asDouble() : null)
            .subtotal(summary.get("subtotal") != null ? summary.get("subtotal").asDouble() : null)
            .totalTax(summary.get("total_tax") != null ? summary.get("total_tax").asDouble() : null)
            .totalCost(summary.get("total_cost") != null ? summary.get("total_cost").asDouble() : null)
            .build();
    }

    private AddressPayload getAddress(final JsonNode payloadNode) {
        final JsonNode address = payloadNode.get("address");

        if (address == null) {
            return null;
        }

        return AddressPayload
            .builder()
            .street_1(address.get("street_1") != null ? address.get("street_1").textValue() : null)
            .street_2(address.get("street_2") != null ? address.get("street_2").textValue() : null)
            .city(address.get("city") != null ? address.get("city").textValue() : null)
            .postalCode(address.get("postal_code") != null ? address.get("postal_code").textValue() : null)
            .state(address.get("state") != null ? address.get("state").textValue() : null)
            .country(address.get("country") != null ? address.get("country").textValue() : null)
            .build();
    }

    private AttachmentPayloadPayload getAttachmentPayload(final JsonNode attachmentNode, final String attachmentUrl) {
        final JsonNode payloadNode = attachmentNode.get("payload");

        if (payloadNode == null) {
            return null;
        }

        return AttachmentPayloadPayload
            .builder()
            .summary(getOrderSummary(payloadNode))
            .address(getAddress(payloadNode))
            .adjustments(getAdjustments(payloadNode))
            .url(payloadNode.get("url") != null ? payloadNode.get("url").textValue() : null)
            .title(payloadNode.get("title") != null ? payloadNode.get("title").textValue() : null)
            .subtitle(payloadNode.get("subtitle") != null ? payloadNode.get("subtitle").textValue() : null)
            .templateType(payloadNode.get("template_type") != null ? payloadNode.get("template_type").textValue() : null)
            .recipientName(payloadNode.get("recipient_name") != null ? payloadNode.get("recipient_name").textValue() : null)
            .currency(payloadNode.get("currency") != null ? payloadNode.get("currency").textValue() : null)
            .orderNumber(payloadNode.get("order_number") != null ? payloadNode.get("order_number").textValue() : null)
            .paymentMethod(payloadNode.get("payment_method") != null ? payloadNode.get("payment_method").textValue() : null)
            .timestamp(payloadNode.get("timestamp") != null ? payloadNode.get("timestamp").textValue() : null)
            .orderUrl(payloadNode.get("order_url") != null ? payloadNode.get("order_url").textValue() : null)
            .text(payloadNode.get("text") != null ? payloadNode.get("text").textValue() : null)
            .buttons(getTemplateElementButtonsPayload(payloadNode.get("buttons")))
            .elements(getTemplateElementsPayload(payloadNode.get("elements"), attachmentUrl))
            .build();
    }

    private List<AdjustmentPayload> getAdjustments(JsonNode payloadNode) {
        final JsonNode adjustmentNode = payloadNode.get("adjustments");

        if (adjustmentNode == null) {
            return null;
        }

        final List<AdjustmentPayload> templateElementPayloads = new ArrayList<>();

        adjustmentNode
            .elements()
            .forEachRemaining(elementNode -> templateElementPayloads.add(
                AdjustmentPayload.builder()
                    .name(elementNode.get("name") != null ? elementNode.get("name").textValue() : null)
                    .amount(elementNode.get("amount") != null ? elementNode.get("amount").asDouble() : null)
                    .build()
            ));

        return templateElementPayloads;
    }

    private List<TemplateElementPayload> getTemplateElementsPayload(JsonNode elementsNode, final String attachmentUrl) {
        if (elementsNode == null) {
            return null;
        }

        final List<TemplateElementPayload> templateElementPayloads = new ArrayList<>();

        elementsNode
            .elements()
            .forEachRemaining(elementNode -> {

                String imageUrl;
                if(attachmentUrl != null) {
                    imageUrl = attachmentUrl;
                } else {
                    imageUrl = elementNode.get("image_url") != null ? elementNode.get("image_url").textValue() : null;
                }

                templateElementPayloads.add(
                    TemplateElementPayload.builder()
                        .title(elementNode.get("title") != null ? elementNode.get("title").textValue() : null)
                        .subtitle(elementNode.get("subtitle") != null ? elementNode.get("subtitle").textValue() : null)
                        .defaultAction(elementNode.get("default_action") != null ? elementNode.get("default_action").textValue() : null)
                        .imageUrl(imageUrl)
                        .mediaType(elementNode.get("media_type") != null ? elementNode.get("media_type").textValue() : null)
                        .externalAttachment(elementNode.get("attachment_id") != null)
                        .url(elementNode.get("url") != null ? elementNode.get("url").textValue() : null)
                        .buttons(getTemplateElementButtonsPayload(elementNode.get("buttons")))
                        .price(elementNode.get("price") != null ? elementNode.get("price").asDouble() : null)
                        .quantity(elementNode.get("quantity") != null ? elementNode.get("quantity").asLong() : null)
                        .build()
                );
            });

        return templateElementPayloads;
    }

    private List<TemplateElementButtonPayload> getTemplateElementButtonsPayload(final JsonNode buttonsNode) {
        if (buttonsNode == null) {
            return null;
        }

        final List<TemplateElementButtonPayload> templateElementButtonPayloads = new ArrayList<>();

        buttonsNode
            .elements()
            .forEachRemaining(buttonNode -> templateElementButtonPayloads.add(
                TemplateElementButtonPayload
                    .builder()
                    .type(buttonNode.get("type") != null ? buttonNode.get("type").textValue() : null)
                    .title(buttonNode.get("title") != null ? buttonNode.get("title").textValue() : null)
                    .url(buttonNode.get("url") != null ? buttonNode.get("url").textValue() : null)
                    .payload(buttonNode.get("payload") != null ? buttonNode.get("payload").textValue() : null)
                    .fallbackUrl(buttonNode.get("fallback_url") != null ? buttonNode.get("fallback_url").textValue() : null)
                    .messengerExtensions(buttonNode.get("messenger_extensions") != null ? buttonNode.get("messenger_extensions").booleanValue() : false)
                    .build()
            ));

        return templateElementButtonPayloads;
    }

    public static MessagePreviewPayload getMessagePreview(final Map<String, String> headers, final String content, final Long timestamp) {
        try {
            final MessageParser messageParser = new MessageParser(headers, content, timestamp, null);

            return MessagePreviewPayload.builder()
                .displayText(messageParser.getDisplayText())
                .contentType(messageParser.getMediaType())
                .build();

        } catch (IOException e) {
            return defaultMessagePreview();
        }
    }

    public static String getMessageMetadata(final Map<String, String> headers, final String content, final Long timestamp) {
        try {
            final MessageParser messageParser = new MessageParser(headers, content, timestamp, null);

            return messageParser.getMetadata();
        } catch (IOException e) {
            return null;
        }
    }

    public static String getMessageEventType(final Map<String, String> headers, final String content, final Long timestamp) {
        try {
            final MessageParser messageParser = new MessageParser(headers, content, timestamp, null);

            return messageParser.getTriggerType();
        } catch (IOException e) {
            return "unknown";
        }
    }

    private static MessagePreviewPayload defaultMessagePreview() {
        return MessagePreviewPayload.builder()
            .displayText("N/A")
            .contentType("N/A")
            .build();
    }

}
