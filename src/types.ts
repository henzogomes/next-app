// src/types.ts
export interface User {
  id: number
  uuid: string
  email: string
  created_at: string
  updated_at: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
