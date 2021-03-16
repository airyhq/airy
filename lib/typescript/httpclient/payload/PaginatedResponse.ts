import {Pagination} from '../model/Pagination';

export interface PaginatedResponse<T> {
  data: T[];
  paginationData: Pagination;
}
