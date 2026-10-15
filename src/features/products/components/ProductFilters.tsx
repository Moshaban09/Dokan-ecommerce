import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PRODUCT_FILTERS,
  PRODUCT_SORT_OPTIONS,
  hasActiveProductFilters,
  type ProductFilterState,
  type ProductSortOption,
} from "../utils/filter-products";

interface ProductFiltersProps {
  value: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
  className?: string;
}

const SORT_KEYS: Record<ProductSortOption, string> = {
  featured: "products.filters.sort.featured",
  "price-asc": "products.filters.sort.priceAsc",
  "price-desc": "products.filters.sort.priceDesc",
  rating: "products.filters.sort.rating",
  discount: "products.filters.sort.discount",
};

const inputClass =
  "h-10 rounded-lg border border-border bg-white px-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors";

const parsePrice = (raw: string): number | null => {
  if (raw.trim() === "") return null;
  const num = Number(raw);
  return Number.isFinite(num) && num >= 0 ? num : null;
};

export function ProductFilters({ value, onChange, className }: ProductFiltersProps) {
  const { t } = useTranslation();
  const isActive = hasActiveProductFilters(value);

  return (
    <div className={cn("flex flex-wrap items-center gap-3 md:gap-4 text-black", className)}>
      <label className="flex items-center gap-2 text-sm text-black/60">
        <span className="whitespace-nowrap">{t("products.filters.sortLabel")}</span>
        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as ProductSortOption })}
          className={cn(inputClass, "pe-8 cursor-pointer")}
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(SORT_KEYS[option])}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2" role="group" aria-label={t("products.filters.priceRange")}>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={value.minPrice ?? ""}
          placeholder={t("products.filters.minPrice")}
          aria-label={t("products.filters.minPrice")}
          onChange={(e) => onChange({ ...value, minPrice: parsePrice(e.target.value) })}
          className={cn(inputClass, "w-24 md:w-28")}
        />
        <span className="text-black/40" aria-hidden="true">–</span>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={value.maxPrice ?? ""}
          placeholder={t("products.filters.maxPrice")}
          aria-label={t("products.filters.maxPrice")}
          onChange={(e) => onChange({ ...value, maxPrice: parsePrice(e.target.value) })}
          className={cn(inputClass, "w-24 md:w-28")}
        />
      </div>

      <label className="flex items-center gap-2 h-10 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={value.onSaleOnly}
          onChange={(e) => onChange({ ...value, onSaleOnly: e.target.checked })}
          className="size-4 rounded border-border accent-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        <span>{t("products.filters.onSaleOnly")}</span>
      </label>

      {isActive && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_PRODUCT_FILTERS)}
          className="ms-auto h-10 px-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors cursor-pointer"
        >
          {t("products.filters.reset")}
        </button>
      )}
    </div>
  );
}
