package co.airy.core.api.conversations.filter;

import co.airy.core.api.conversations.payload.QueryFilterPayload;

public interface Filter<T> {

    boolean filter(T objectToFilter, QueryFilterPayload filterPayload);

}
