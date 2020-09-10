package backend.lib.payload.src.main.java.co.airy.payload.mapper;

import co.airy.avro.communication.Address;
import co.airy.avro.communication.Attachment;
import co.airy.avro.communication.AttachmentElementButton;
import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ContentRecord;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MessageContainer;
import co.airy.avro.communication.OrderAdjustment;
import co.airy.avro.communication.OrderSummary;
import co.airy.avro.communication.TemplateElement;
import co.airy.avro.communication.TemplateElementButton;
import co.airy.avro_v1.communication.Contact;
import co.airy.payload.response.AddressPayload;
import co.airy.payload.response.AdjustmentPayload;
import co.airy.payload.response.AttachmentPayload;
import co.airy.payload.response.AttachmentPayloadPayload;
import co.airy.payload.response.ContactResponsePayload;
import co.airy.payload.response.MessagePreviewPayload;
import co.airy.payload.response.MessageResponsePayload;
import co.airy.payload.response.OrderSummaryPayload;
import co.airy.payload.response.TemplateElementButtonPayload;
import co.airy.payload.response.TemplateElementPayload;

import java.time.Instant;
import java.util.List;

import static co.airy.payload.parser.MessageParser.ISO_INSTANT_WITH_MILLIS_DF;
import static java.util.stream.Collectors.toList;

public class MessageResponse {

    public static MessageResponsePayload mapMessageResponsePayload(final MessageContainer container, final ContentRecord record, final Channel channel, final Contact contact) {

        return MessageResponsePayload.builder()
            .id(container.getId())
            .alignment(container.getConversationId().equals(container.getSenderId()) ? "LEFT" : "RIGHT")
            .offset(container.getSentAt())
            .text(record.getContent())
            .metadata(null)
            .attachments(null)
            .sentAt(ISO_INSTANT_WITH_MILLIS_DF.format(Instant.ofEpochMilli(container.getSentAt())))
            .sender((container.getSenderId().equals(contact.getId()) ?
                ContactResponsePayload.builder()
                    .id(container.getSenderId())
                    .firstName(contact.getFirstName())
                    .lastName(contact.getLastName())
                    .avatarUrl(contact.getAvatarUrl())
                    .build() :
                ContactResponsePayload.builder()
                    .id(container.getSenderId())
                    .firstName(channel.getName())
                    .avatarUrl("") //TODO
                    .build()))
            .preview(MessagePreviewPayload.builder()
                .displayText(container.getPreview().getDisplayText())
                .contentType(container.getPreview().getContentType())
                .build())
            .build();
    }

    public static MessageResponsePayload mapMessageResponsePayload(final MessageContainer container, final Message content, final Channel channel) {

        return MessageResponsePayload.builder()
            .id(container.getId())
            .alignment(container.getConversationId().equals(container.getSenderId()) ? "LEFT" : "RIGHT")
            .offset(container.getSentAt())
            .text(content.getText())
            .metadata(content.getCorrelationId())
            .attachments(getAttachments(content.getAttachments()))
            .sentAt(ISO_INSTANT_WITH_MILLIS_DF.format(Instant.ofEpochMilli(container.getSentAt())))
            .preview(MessagePreviewPayload.builder()
                .displayText(container.getPreview().getDisplayText())
                .contentType(container.getPreview().getContentType())
                .build())
            .build();
    }

    public static MessageResponsePayload mapMessageResponsePayload(final MessageContainer container, final Message content) {

        return MessageResponsePayload.builder()
            .id(container.getId())
            .alignment(container.getConversationId().equals(container.getSenderId()) ? "LEFT" : "RIGHT")
            .offset(container.getSentAt())
            .text(content.getText())
            .metadata(content.getCorrelationId())
            .attachments(getAttachments(content.getAttachments()))
            .sentAt(ISO_INSTANT_WITH_MILLIS_DF.format(Instant.ofEpochMilli(container.getSentAt())))
            .sender(
                ContactResponsePayload.builder()
                    .id(container.getSenderId())
                    .build()
            )
            .preview(MessagePreviewPayload.builder()
                .displayText(container.getPreview().getDisplayText())
                .contentType(container.getPreview().getContentType())
                .build())
            .build();
    }

    public static List<AttachmentPayload> getAttachments(List<Attachment> attachments) {
        if (attachments == null) {
            return null;
        }

        return attachments.stream().map(MessageResponse::getAttachment).collect(toList());
    }

    private static AttachmentPayload getAttachment(Attachment attachment) {
        return AttachmentPayload.builder()
            .title(attachment.getTitle())
            .type(attachment.getType().toString().toLowerCase())
            .url(attachment.getUrl())
            .payload(getAttachmentPayload(attachment.getPayload()))
            .build();
    }


    private static AttachmentPayloadPayload getAttachmentPayload(co.airy.avro.communication.AttachmentPayload attachment) {
        if (attachment == null) {
            return null;
        }

        return AttachmentPayloadPayload.builder()
            .address(getAddress(attachment.getAddress()))
            .adjustments(getAdjustments(attachment.getOrderAdjustments()))
            .buttons(getButtonsAttachment(attachment.getAttachmentElementButtons()))
            .currency(attachment.getCurrency())
            .elements(getElements(attachment.getTemplateElements()))
            .merchantName(attachment.getMerchantName())
            .orderNumber(attachment.getOrderNumber())
            .orderUrl(attachment.getOrderUrl())
            .paymentMethod(attachment.getPaymentMethod())
            .recipientName(attachment.getRecipientName())
            .subtitle(attachment.getSubtitle())
            .summary(getOrderSummary(attachment.getOrderSummary()))
            .templateType(attachment.getTemplateType())
            .text(attachment.getText())
            .timestamp(attachment.getTimestamp())
            .title(attachment.getTitle())
            .url(attachment.getUrl())
            .build();
    }

    private static AddressPayload getAddress(Address address) {
        if (address == null) {
            return null;
        }

        return AddressPayload.builder()
            .city(address.getCity())
            .country(address.getCountry())
            .postalCode(address.getPostalCode())
            .state(address.getState())
            .street_1(address.getStreet1())
            .street_2(address.getStreet2())
            .build();
    }

    private static List<AdjustmentPayload> getAdjustments(List<OrderAdjustment> adjustments) {
        if (adjustments == null) {
            return List.of();
        }

        return adjustments.stream()
            .map((adjustment) -> AdjustmentPayload.builder()
                .amount(adjustment.getAmount())
                .name(adjustment.getName())
                .build())
            .collect(toList());
    }

    private static List<TemplateElementButtonPayload> getButtonsAttachment(List<AttachmentElementButton> buttons) {
        if (buttons == null) {
            return List.of();
        }

        return buttons.stream()
            .map((button) -> TemplateElementButtonPayload.builder()
                .fallbackUrl(button.getFallbackUrl())
                .messengerExtensions(button.getMessengerExtensionsFlag())
                .payload(button.getPayload())
                .title(button.getTitle())
                .type(button.getType())
                .title(button.getTitle())
                .url(button.getUrl())
                .build())
            .collect(toList());
    }

    private static List<TemplateElementPayload> getElements(List<TemplateElement> elements) {
        if (elements == null) {
            return List.of();
        }

        return elements.stream()
            .map((element) -> TemplateElementPayload.builder()
                .buttons(getButtonsTemplate(element.getTemplateElementButtons()))
                .defaultAction(element.getDefaultAction())
                .externalAttachment(element.getExternalAttachment())
                .imageUrl(element.getImageUrl())
                .mediaType(element.getMediaType())
                .price(element.getPrice())
                .quantity(element.getQuantity())
                .subtitle(element.getSubtitle())
                .title(element.getTitle())
                .url(element.getUrl())
                .build())
            .collect(toList());
    }


    private static List<TemplateElementButtonPayload> getButtonsTemplate(List<TemplateElementButton> buttons) {
        if (buttons == null) {
            return List.of();
        }

        return buttons.stream()
            .map((button) -> TemplateElementButtonPayload.builder()
                .fallbackUrl(button.getFallbackUrl())
                .messengerExtensions(button.getMessengerExtensionsFlag())
                .payload(button.getPayload())
                .title(button.getTitle())
                .type(button.getType())
                .title(button.getTitle())
                .url(button.getUrl())
                .build())
            .collect(toList());
    }

    private static OrderSummaryPayload getOrderSummary(OrderSummary summary) {
        if (summary == null) {
            return null;
        }

        return OrderSummaryPayload.builder()
            .shippingCost(summary.getShippingCost())
            .subtotal(summary.getSubtotal())
            .totalCost(summary.getTotalCost())
            .totalTax(summary.getTotalTax())
            .build();
    }
}
