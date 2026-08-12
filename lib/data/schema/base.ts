import { z } from "zod";

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export const basePaginationQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
});

export type BasePaginationQuery = z.infer<typeof basePaginationQuerySchema>;

export type ResponseData<T> = {
  statusCode: number;
  status: string;
  message: string;
  data: T;
};
