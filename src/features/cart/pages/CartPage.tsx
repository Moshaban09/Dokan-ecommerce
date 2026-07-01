import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { CouponSection } from "../components/CouponSection";
import { useCart } from "../hooks/use-cart";
import { useCartProducts } from "../hooks/use-cart-products";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { useAuth } from "@/features/auth";

export default function CartPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  useDocumentTitle(t("cart.title"));
  const {
    items,
    removeItem,
    updateQuantity,
    isCouponApplied,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { products, isLoading, subtotal } = useCartProducts();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20 font-poppins">
      <div className="flex flex-col gap-10">
        <Breadcrumb
          items={[
            { label: t("common.home"), to: "/" },
            { label: t("cart.title"), active: true },
          ]}
          className="mb-10"
        />

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <p className="text-xl font-medium text-black">
              {t("cart.empty")}
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary px-8 py-3 hover:-translate-y-1 transition-all">
                {t("cart.return")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-start min-w-[700px]">
                <thead>
                  <tr className="shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] rounded bg-white text-black dark:bg-card dark:text-card-foreground">
                    <th className="py-6 px-10 font-normal">{t("cart.table.product")}</th>
                    <th className="py-6 px-10 font-normal">{t("cart.table.price")}</th>
                    <th className="py-6 px-10 font-normal">{t("cart.table.quantity")}</th>
                    <th className="py-6 px-10 font-normal">{t("cart.table.subtotal")}</th>
                  </tr>
                </thead>
                <tbody className="space-y-10">
                  <tr className="h-6"></tr>
                  {products.map((product) => {
                    const quantity =
                      items.find((i) => i.id === product.id)?.quantity || 1;
                    return (
                      <tr
                        key={product.id}
                        className="shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] rounded bg-white text-black dark:bg-card dark:text-card-foreground relative group mb-8"
                      >
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <button
                                onClick={() => removeItem(product.id)}
                                className="absolute -top-2 -start-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-sm"
                                title={t("cart.coupon.remove")}
                              >
                                ✕
                              </button>
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-12.5 h-12.5 object-contain"
                              />
                            </div>
                            <span className="font-normal truncate max-w-37.5">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-10 font-normal">
                          {t("common.currency")}{product.price.toFixed(2)}
                        </td>
                        <td className="py-6 px-10">
                          <div className="w-18 h-11 border border-black/40 dark:border-white/40 rounded flex items-center justify-between px-3">
                            <span className="font-normal leading-none select-none">
                              {String(quantity).padStart(2, "0")}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="hover:opacity-70 flex items-center justify-center cursor-pointer"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m18 15-6-6-6 6" />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="hover:opacity-70 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={quantity <= 1}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-10 font-normal">
                          {t("common.currency")}{(product.price * quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-6 md:hidden">
              {products.map((product) => {
                const quantity =
                  items.find((i) => i.id === product.id)?.quantity || 1;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 p-5 shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] rounded bg-white dark:bg-card text-black dark:text-card-foreground relative"
                  >
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-4 end-4 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                      title={t("cart.coupon.remove")}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-20 h-20 object-contain rounded-md bg-gray-50 dark:bg-gray-900/20"
                      />
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="font-medium text-lg truncate pr-6">{product.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          {t("cart.table.price")}: {t("common.currency")}{product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{t("cart.table.quantity")}</span>
                        <div className="w-24 h-10 border border-black/20 dark:border-white/20 rounded flex items-center justify-between px-3">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="text-primary disabled:opacity-30 p-1"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="text-primary p-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{t("cart.table.subtotal")}</p>
                        <p className="text-lg font-bold text-primary">
                          {t("common.currency")}{(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <Link to="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-14 w-full sm:px-12 border-black/50 dark:border-white/50 text-black dark:text-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all"
                >
                  {t("cart.return")}
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast.success(t("cart.clearSuccess"));
                }}
                className="h-14 w-full sm:px-12 border-black/50 dark:border-white/50 text-black dark:text-white bg-transparent hover:bg-destructive hover:text-white dark:hover:bg-destructive dark:hover:text-white font-medium transition-all"
              >
                {t("cart.clear")}
              </Button>
            </div>


            <div className="flex flex-col md:flex-row justify-between items-start mt-10 gap-10 md:gap-4">
              <CouponSection
                isCouponApplied={isCouponApplied}
                appliedCouponCode={appliedCouponCode}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
                className="flex flex-col gap-2 w-full max-w-125"
              />

              <div className="w-full md:max-w-117.5 border border-black/50 dark:border-white/50 rounded flex flex-col px-6 py-8 gap-6 text-black dark:text-white">
                <h3 className="text-xl font-medium">{t("cart.total.title")}</h3>

                <div className="flex justify-between border-b border-black/30 dark:border-white/30 pb-4">
                  <span className="font-normal">{t("cart.total.subtotal")}</span>
                  <span className="font-normal">{t("common.currency")}{subtotal.toFixed(2)}</span>
                </div>

                {isCouponApplied && (
                  <div className="flex justify-between border-b border-black/30 dark:border-white/30 pb-4 text-primary">
                    <span className="font-normal">{t("cart.total.discount")}</span>
                    <span className="font-normal">
                      -{t("common.currency")}{(subtotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b border-black/30 dark:border-white/30 pb-4">
                  <span className="font-normal">{t("cart.total.shipping")}</span>
                  <span className="font-normal">{t("cart.total.free")}</span>
                </div>

                <div className="flex justify-between pb-4">
                  <span className="font-normal">{t("cart.total.total")}</span>
                  <span className="font-normal">
                    {t("common.currency")}
                    {(isCouponApplied ? subtotal * 0.9 : subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-center mt-2">
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/checkout");
                      } else {
                        navigate("/login?redirect=/checkout");
                      }
                    }}
                    className="bg-primary h-14 px-12 text-white font-medium w-full sm:w-auto hover:bg-primary hover:-translate-y-1 transition-all"
                  >
                    {isAuthenticated ? t("cart.total.checkout") : t("cart.total.loginToCheckout")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
