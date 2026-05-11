import { axiosInstance } from '@/lib/axios';
import type { ApiResponse, ApiParams } from '@/api/types';
import type { Product, CategoryItem } from "../types";

export const ProductService = {
  getProducts: async (params?: ApiParams): Promise<ApiResponse<Product>> => {
    return axiosInstance.get('/products', { params });
  },

  getProductById: async (id: number): Promise<Product> => {
    return axiosInstance.get(`/products/${id}`);
  },

  searchProducts: async (query: string): Promise<ApiResponse<Product>> => {
    return axiosInstance.get('/products/search', { params: { q: query } });
  },

  getCategories: async (): Promise<CategoryItem[]> => {
    return axiosInstance.get('/products/categories');
  },

  getProductsByCategory: async (
    category: string,
    params?: ApiParams
  ): Promise<ApiResponse<Product>> => {
    return axiosInstance.get(`/products/category/${category}`, { params });
  },
};
