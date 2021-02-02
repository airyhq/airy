export interface PaginatedPayload<T> {
  data: T[];
  pagination_data: {previous_cursor: string; next_cursor: string; total: number};
}
