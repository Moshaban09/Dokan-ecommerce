import { useState, useEffect } from 'react';
import { ProductService } from "../api/product-service";
import type { Product } from "../types";
import type { ApiParams } from '@/api/types';

export const useProducts = (initialParams?: ApiParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ApiParams | undefined>(initialParams);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ProductService.getProducts(params);
        if (isMounted) setProducts(response.products ?? []);
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to fetch products';
          setError(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => { isMounted = false; };
  }, [params]);

  return { products, isLoading, error, params, setParams };
};
