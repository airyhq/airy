import {PaginatedResponse} from '../payload';
import {PaginatedPayload} from '../payload/PaginatedPayload';

export const paginatedPayloadMapper = <T>(payload: PaginatedPayload<T>): PaginatedResponse<T> => {
  return {
    data: payload.data,
    paginationData: {
      previousCursor: payload.pagination_data.previous_cursor,
      nextCursor: payload.pagination_data.next_cursor,
      total: payload.pagination_data.total,
    },
  };
};
