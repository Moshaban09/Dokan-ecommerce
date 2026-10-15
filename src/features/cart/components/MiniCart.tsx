import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "../hooks/use-cart";
import { useCartProducts } from "../hooks/use-cart-products";
import { OPEN_MINI_CART_EVENT } from "../mini-cart-events";

export const MiniCart = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { updateQuantity, removeItem } = useCart();
  const { itemsWithProducts, subtotal, isLoading } = useCartProducts();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MINI_CART_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MINI_CART_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      className={cn("fixed inset-0 z-[60]", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={close}
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-label={t("cart.title")}
        className={cn(
          "absolute inset-y-0 inset-e-0 w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300",
          open
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <h2 className="text-lg font-medium font-poppins flex items-center gap-2">
            <ShoppingCart size={20} />
            {t("cart.title")}
          </h2>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label={t("cart.close", { defaultValue: "Close" })}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {itemsWithProducts.length === 0 ? (
            <p className="text-center text-black/60 mt-16 font-poppins">
              {isLoading ? "…" : t("cart.empty")}
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {itemsWithProducts.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-border p-2"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="size-20 rounded-lg bg-secondary object-contain p-1"
                  />
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={close}
                      className="text-sm font-medium font-poppins line-clamp-1 hover:text-primary"
                    >
                      {product.title}
                    </Link>
                    <span className="text-sm text-primary font-medium">
                      {t("common.currency")}
                      {product.price.toFixed(2)}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(product.id, Math.max(1, quantity - 1))
                          }
                          className="p-1.5 cursor-pointer hover:bg-secondary rounded-s-lg"
                          aria-label="−"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 cursor-pointer hover:bg-secondary rounded-e-lg"
                          aria-label="+"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 text-black/50 hover:text-sale cursor-pointer"
                        aria-label={t("cart.coupon.remove")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {itemsWithProducts.length > 0 && (
          <div className="border-t border-border p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between font-poppins">
              <span className="text-black/60">{t("cart.total.subtotal")}</span>
              <span className="font-medium">
                {t("common.currency")}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <Button asChild variant="outline" className="h-11" onClick={close}>
              <Link to="/cart">{t("products.viewCart")}</Link>
            </Button>
            <Button
              asChild
              className="h-11 bg-primary hover:bg-primary-dark text-white"
              onClick={close}
            >
              <Link to="/checkout">{t("cart.total.checkout")}</Link>
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
};
