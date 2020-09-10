package backend.lib.payload.src.main.java.co.airy.payload.response;

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
public class AddressPayload implements Serializable {

    public String street_1;

    public String street_2;

    public String city;

    public String postalCode;

    public String state;

    public String country;
}
