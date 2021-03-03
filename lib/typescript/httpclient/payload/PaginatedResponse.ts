export interface PaginatedResponse<T> {
  data: T[];
  paginationData: {previousCursor: string; nextCursor: string; total: number; filteredTotal: number};
}
