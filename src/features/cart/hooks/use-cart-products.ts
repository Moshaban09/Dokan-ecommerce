import { ProductService } from "@/features/products";
import type { Product } from "@/features/products/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./use-cart";

export const useCartProducts = () => {
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(items.length > 0);

  const productsRef = useRef(products);
  useEffect(() => { productsRef.current = products; }, [products]);

  const itemIdsString = useMemo(
    () => items.map((i) => i.id).sort().join(","),
    [items],
  );

  useEffect(() => {
    let ignore = false;

    const currentIds = itemIdsString ? itemIdsString.split(",").map(Number) : [];

    if (currentIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const cachedIds = new Set(productsRef.current.map((p) => p.id));
    if (!currentIds.every((id) => cachedIds.has(id))) setIsLoading(true);

    const load = async () => {
      try {
        const results = await Promise.all(
          currentIds.map((id) => ProductService.getProductById(id)),
        );
        if (!ignore) setProducts(results);
      } catch {
        // ignore
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();
    return () => { ignore = true; };
  }, [itemIdsString]);

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
