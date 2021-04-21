export interface PaginationData {
  previous_cursor: string;
  next_cursor: string;
  total: number;
}
export interface PaginatedPayload<T> {
  data: T[];
  pagination_data: PaginationData;
}
