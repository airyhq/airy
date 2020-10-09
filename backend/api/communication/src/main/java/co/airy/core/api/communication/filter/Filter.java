package co.airy.core.api.communication.filter;

import co.airy.core.api.communication.payload.QueryFilterPayload;

public interface Filter<T> {

    boolean filter(T objectToFilter, QueryFilterPayload filterPayload);

}
