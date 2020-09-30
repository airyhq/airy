package co.airy.core.api.send_message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SendMessageRequestController {
    @Autowired
    Stores stores;
}
