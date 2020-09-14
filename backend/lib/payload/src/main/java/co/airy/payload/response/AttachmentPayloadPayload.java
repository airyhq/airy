package co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AttachmentPayloadPayload implements Serializable {

    public String url;

    public String title;

    public String subtitle;

    public String templateType;

    public String recipientName;

    public String merchantName;

    public String orderNumber;

    public String currency;

    public String timestamp;

    public AddressPayload address;

    public String paymentMethod;

    public String orderUrl;

    public OrderSummaryPayload summary;

    public List<AdjustmentPayload> adjustments;

    public String text;

    public List<TemplateElementButtonPayload> buttons;

    public List<TemplateElementPayload> elements;
}
