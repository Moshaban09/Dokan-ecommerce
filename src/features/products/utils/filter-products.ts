import type { Product } from "../types";

export type ProductSortOption = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

export interface ProductFilterState {
  sort: ProductSortOption;
  minPrice: number | null;
  maxPrice: number | null;
  onSaleOnly: boolean;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterState = {
  sort: "featured",
  minPrice: null,
  maxPrice: null,
  onSaleOnly: false,
};

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = ["featured", "price-asc", "price-desc", "rating", "discount"];

export function hasActiveProductFilters(state: ProductFilterState): boolean {
  return (
    state.sort !== DEFAULT_PRODUCT_FILTERS.sort ||
    state.minPrice !== null ||
    state.maxPrice !== null ||
    state.onSaleOnly
  );
}

const effectivePrice = (product: Product): number =>
  product.price * (1 - product.discountPercentage / 100);

export function filterAndSortProducts(products: Product[], state: ProductFilterState): Product[] {
  const { sort, minPrice, maxPrice, onSaleOnly } = state;

  const filtered = products.filter((product) => {
    if (minPrice !== null && effectivePrice(product) < minPrice) return false;
    if (maxPrice !== null && effectivePrice(product) > maxPrice) return false;
    if (onSaleOnly && product.discountPercentage <= 0) return false;
    return true;
  });

  // Array.prototype.sort is stable, so "featured" keeps the original order.
  switch (sort) {
    case "price-asc":
      return filtered.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return filtered.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "rating":
      return filtered.sort((a, b) => b.rating - a.rating);
    case "discount":
      return filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
    default:
      return filtered;
  }
}
