import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";
import { useTranslation } from "react-i18next";

interface CouponSectionProps {
  isCouponApplied: boolean;
  appliedCouponCode: string | null;
  applyCoupon: (code: string, userCoupon: string) => boolean;
  removeCoupon: () => void;
  className?: string;
}

export const CouponSection = ({
  isCouponApplied,
  appliedCouponCode,
  applyCoupon,
  removeCoupon,
  className,
}: CouponSectionProps) => {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const { t } = useTranslation();

  const userCoupon = user?.name
    ? user.name.trim().split(" ")[0].toUpperCase()
    : "DISCOUNT10";

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error(t("cart.coupon.placeholder"), { id: "coupon-section" });
      return;
    }

    const success = applyCoupon(couponCode, userCoupon);
    if (success) {
      toast.success(t("cart.coupon.success"), { id: "coupon-section" });
      setCouponCode("");
    } else {
      toast.error(t("cart.coupon.invalid"), { id: "coupon-section" });
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col xs:flex-row gap-4">
        <input
          type="text"
          placeholder={t("cart.coupon.placeholder")}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
          className="flex-1 h-14 border border-black/50 dark:border-white/50 rounded px-6 outline-none focus:border-black dark:focus:border-white transition-all bg-transparent text-black dark:text-white placeholder:text-gray-500"
        />
        <Button
          type="button"
          onClick={handleApplyCoupon}
          className="bg-primary h-14 px-8 md:px-12 text-white font-medium hover:bg-primary hover:-translate-y-1 transition-all whitespace-nowrap"
        >
          {t("cart.coupon.apply")}
        </Button>
      </div>

      <div className="mt-2 min-h-6">
        {isCouponApplied ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-green-600 font-medium">
              {t("cart.coupon.success")} <span className="font-bold">{appliedCouponCode}</span>
            </p>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              [{t("cart.coupon.remove")}]
            </button>
          </div>
        ) : (
          <p className="text-xs text-black/50 dark:text-white/50">
            {t("cart.coupon.hint")}
            <span
              className="font-bold text-black dark:text-white cursor-pointer hover:underline mx-1"
              onClick={() => setCouponCode(userCoupon)}
            >
              {userCoupon}
            </span>{" "}
            {t("cart.coupon.forDiscount")}
          </p>
        )}
      </div>
    </div>
  );
};
