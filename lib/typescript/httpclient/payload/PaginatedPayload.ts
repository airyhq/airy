export interface PaginatedPayload<T> {
  data: T[];
  response_metadata: {previous_cursor: string; next_cursor: string; total: number};
}
