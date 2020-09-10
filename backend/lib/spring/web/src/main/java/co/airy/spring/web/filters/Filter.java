package backend.lib.spring.web.src.main.java.co.airy.spring.web.filters;

public interface Filter<T, K> {

    boolean filter(T objectToFilter, K filterPayload);
}
