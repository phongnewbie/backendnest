import { PaginationMeta } from '../dto/pagination.dto';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
