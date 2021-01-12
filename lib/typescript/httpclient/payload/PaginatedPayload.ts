export interface PaginatedPayload<T> {
  data: T[];
  responseMetadata: {previousCursor: string; nextCursor: string; total: number};
}
