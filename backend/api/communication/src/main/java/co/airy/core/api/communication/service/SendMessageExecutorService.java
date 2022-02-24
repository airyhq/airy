package co.airy.core.api.communication.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST)
public class SendMessageExecutorService {

    public void sendMessageAsync(Runnable runnableTask) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.submit(runnableTask);
    }
}
