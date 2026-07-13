import { ProductService } from "@/features/products";
import type { Product } from "@/features/products/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./use-cart";

const productCache = new Map<number, Product>();

export const useCartProducts = () => {
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>(() =>
    items.map((i) => productCache.get(i.id)).filter(Boolean) as Product[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const itemIds = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (itemIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const missingIds = itemIds.filter((id) => !productCache.has(id));

    if (missingIds.length === 0) {
      setProducts(itemIds.map((id) => productCache.get(id)!));
      return;
    }

    let ignore = false;
    setIsLoading(true);

    const load = async () => {
      try {
        const fetched = await Promise.all(
          missingIds.map((id) => ProductService.getProductById(id))
        );

        fetched.forEach((p) => productCache.set(p.id, p));

        if (!ignore && mountedRef.current) {
          setProducts(itemIds.map((id) => productCache.get(id)!).filter(Boolean));
        }
      } catch {
        // ignore
      } finally {
        if (!ignore && mountedRef.current) setIsLoading(false);
      }
    };

    load();
    return () => { ignore = true; };
  }, [itemIds]);

  const subtotal = useMemo(
    () =>
      products.reduce((total, product) => {
        const quantity = items.find((i) => i.id === product.id)?.quantity ?? 1;
        return total + product.price * quantity;
      }, 0),
    [products, items],
  );

  return {
    products,
    isLoading,
    subtotal,
    itemsWithProducts: products.map((product) => ({
      product,
      quantity: items.find((i) => i.id === product.id)?.quantity ?? 0,
    })),
  };
};
