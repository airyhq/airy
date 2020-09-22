package co.airy.spring.web.filters;

public interface Filter<T, K> {

    boolean filter(T objectToFilter, K filterPayload);
}
