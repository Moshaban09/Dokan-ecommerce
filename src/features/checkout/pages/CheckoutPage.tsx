import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth";
import { CouponSection, useCart } from "@/features/cart";
import { useCartProducts } from "@/features/cart/hooks/use-cart-products";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

import visaLogo from "@/assets/icons/visa.svg";
import mastercardLogo from "@/assets/icons/mastercard.svg";
import paypalLogo from "@/assets/icons/paypal.svg";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "checkout.errors.firstName"),
  companyName: z.string().optional(),
  streetAddress: z.string().min(5, "checkout.errors.streetAddress"),
  apartment: z.string().optional(),
  city: z.string().min(2, "checkout.errors.city"),
  phoneNumber: z.string().min(5, "checkout.errors.phoneNumber"),
  email: z.string().email("checkout.errors.email"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const generateOrderNumber = () =>
  "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

const FIELD_CONFIGS: {
  id: keyof CheckoutFormValues;
  type: string;
  required: boolean;
}[] = [
  { id: "firstName", type: "text", required: true },
  { id: "companyName", type: "text", required: false },
  { id: "streetAddress", type: "text", required: true },
  { id: "apartment", type: "text", required: false },
  { id: "city", type: "text", required: true },
  { id: "phoneNumber", type: "text", required: true },
  { id: "email", type: "email", required: true },
];

const CARD_LOGOS = [
  { src: visaLogo, alt: "Visa", h: "h-4" },
  { src: mastercardLogo, alt: "Mastercard", h: "h-6" },
  { src: paypalLogo, alt: "PayPal", h: "h-4" },
];

const SummaryRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex justify-between border-b border-black/30 pb-4",
      className,
    )}
  >
    <span className="font-normal">{label}</span>
    <span className="font-normal">{value}</span>
  </div>
);

export default function CheckoutPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("checkout.title"));
  const { user } = useAuth();
  const {
    clearCart,
    isCouponApplied,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
    items,
  } = useCart();
  const {
    isLoading,
    subtotal,
    itemsWithProducts: products,
  } = useCartProducts();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { email: user?.email ?? "" },
  });

  const discount = isCouponApplied ? subtotal * 0.1 : 0;
  const totalAmount = subtotal - discount;

  useEffect(() => {
    if (!isLoading && items.length === 0 && !isSubmitting && !isSuccess) {
      toast.error(t("checkout.errors.emptyCart"));
      navigate("/cart");
    }
  }, [items.length, navigate, isLoading, isSubmitting, isSuccess, t]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user?.id) return;
    try {
      toast.loading(t("checkout.verifyingPayment"), { id: "payment" });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.loading(t("checkout.processingSecurely"), { id: "payment" });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const orderNumber = generateOrderNumber();

      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          first_name: data.firstName,
          company_name: data.companyName ?? null,
          street_address: data.streetAddress,
          apartment: data.apartment ?? null,
          city: data.city,
          phone: data.phoneNumber,
          email: data.email,
          is_default: false,
        })
        .select("id")
        .single();

      if (addressError) throw new Error(addressError.message);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: addressData?.id ?? null,
          order_number: orderNumber,
          status: "pending",
          payment_method: paymentMethod,
          subtotal,
          discount,
          total: totalAmount,
          coupon_code: appliedCouponCode,
        })
        .select("id")
        .single();

      if (orderError || !orderData) throw new Error(orderError?.message);

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(
          products.map(({ product, quantity }) => ({
            order_id: orderData.id,
            product_id: product.id,
            title: product.title,
            price: product.price,
            quantity,
            image: product.thumbnail,
          })),
        );

      if (orderItemsError) throw new Error(orderItemsError.message);

      await clearCart();

      const savedOrder = {
        id: orderNumber,
        date: new Date().toISOString(),
        total: totalAmount,
        status: "pending",
        paymentMethod,
        items: products.map(({ product, quantity }) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
          thumbnail: product.thumbnail,
        })),
      };
      const prevOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem(
        "orders",
        JSON.stringify([...prevOrders, savedOrder]),
      );

      toast.success(t("checkout.paymentSuccess"), { id: "payment" });
      setIsSuccess(true);
      navigate("/order-success");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const msg =
        error instanceof Error ? error.message : t("checkout.failedOrder");
      toast.error(msg, { id: "payment" });
    }
  };

  const breadcrumbItems = [
    { label: t("common.home"), href: "/" },
    { label: t("cart.title"), href: "/cart" },
    { label: t("checkout.title"), active: true },
  ];

  return (
    <div className="container mx-auto px-4 py-20 font-poppins text-start">
      <div className="flex flex-col gap-10">
        <Breadcrumb items={breadcrumbItems} className="mb-10" />
        <h2 className="text-4xl font-medium font-inter mb-8 text-black">
          {t("checkout.billingDetails")}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="flex flex-col gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-20"
          >
            <div className="flex flex-col gap-8 max-w-117.5">
              {FIELD_CONFIGS.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label className="text-base text-black/70">
                    {t(`checkout.${field.id}`)}{" "}
                    {field.required && <span className="text-primary">*</span>}
                  </label>
                  <input
                    {...register(field.id)}
                    type={field.type}
                    className="w-full h-12 bg-secondary rounded text-base text-black px-4 outline-none focus:ring-1 focus:ring-black/20 transition-all"
                  />
                  {errors[field.id] && (
                    <span className="text-xs text-red-500 font-poppins">
                      {t(errors[field.id]?.message as string)}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  id="saveInfo"
                  className="w-5 h-5 accent-primary cursor-pointer rounded border-black/30"
                />
                <label
                  htmlFor="saveInfo"
                  className="text-base font-normal cursor-pointer text-black"
                >
                  {t("checkout.saveInfo")}
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:mt-12 max-w-105">
              <div className="flex flex-col gap-6">
                {products.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-12.5 h-12.5 object-contain"
                      />
                      <span className="font-normal truncate max-w-50 text-black">
                        {product.title}
                      </span>
                    </div>
                    <span className="font-normal text-black">
                      {t("common.currency")}
                      {(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 mt-4 text-black">
                <SummaryRow
                  label={t("cart.total.subtotal")}
                  value={`${t("common.currency")}${subtotal.toFixed(2)}`}
                />
                {isCouponApplied && (
                  <SummaryRow
                    label={t("cart.total.discount")}
                    value={`-${t("common.currency")}${discount.toFixed(2)}`}
                    className="text-primary"
                  />
                )}
                <SummaryRow
                  label={t("cart.total.shipping")}
                  value={t("cart.total.free")}
                />
                <div className="flex justify-between pb-4">
                  <span className="text-lg font-medium">
                    {t("cart.total.total")}
                  </span>
                  <span className="text-lg font-medium">
                    {t("common.currency")}
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                    <span
                      className={cn(
                        "text-base transition-colors",
                        paymentMethod === "bank"
                          ? "text-black font-medium"
                          : "text-black/70",
                      )}
                    >
                      {t("checkout.bankTransfer")}
                    </span>
                  </label>
                  <div className="flex gap-2 items-center opacity-80">
                    {CARD_LOGOS.map((logo) => (
                      <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className={cn(
                          logo.h,
                          "object-contain grayscale hover:grayscale-0 transition-all",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />
                  <span
                    className={cn(
                      "text-base transition-colors",
                      paymentMethod === "cod"
                        ? "text-black font-medium"
                        : "text-black/70",
                    )}
                  >
                    {t("checkout.cashOnDelivery")}
                  </span>
                </label>
              </div>

              <CouponSection
                isCouponApplied={isCouponApplied}
                appliedCouponCode={appliedCouponCode}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
                className="flex flex-col gap-2 mt-2"
              />

              <div className="mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary h-14 px-12 text-white font-medium disabled:opacity-70 hover:bg-primary hover:-translate-y-1 transition-all rounded w-full md:w-auto"
                >
                  {isSubmitting
                    ? t("checkout.processing")
                    : t("checkout.placeOrder")}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
