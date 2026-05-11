export interface ApiResponse<T> {
  products?: T[];
  carts?: T[];
  users?: T[];
  posts?: T[];
  comments?: T[];
  todos?: T[];
  recipes?: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiParams {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  q?: string;
}
