package backend.lib.payload.src.main.java.co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderSummaryPayload {

    public Double totalCost;

    public Double totalTax;

    public Double subtotal;

    public Double shippingCost;

}
