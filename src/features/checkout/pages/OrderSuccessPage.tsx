import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { ArrowRight, CheckCircle, Package, Calendar, CreditCard, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

type OrderItem = {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

type SavedOrder = {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: string;
  paymentMethod?: string;
};

export default function OrderSuccessPage() {
  const { t, i18n } = useTranslation();
  useDocumentTitle(t("orderSuccess.title"));

  const [order] = useState<SavedOrder | null>(() => {
    try {
      const orders: SavedOrder[] = JSON.parse(
        localStorage.getItem("orders") || "[]",
      );
      return orders.length > 0 ? orders[orders.length - 1] : null;
    } catch {
      return null;
    }
  });

  const orderId = order?.id ?? "ORD-UNKNOWN";
  const orderDate = order?.date
    ? new Date(order.date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";
  const orderTotal = order?.total ?? 0;
  const paymentMethod =
    order?.paymentMethod === "bank" ? t("checkout.bankTransfer") : t("checkout.cashOnDelivery");

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-10 md:py-20 flex flex-col items-center gap-8 min-h-[70vh]">
      <div className="flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-ping" />
        </div>

        <div className="flex flex-col gap-3 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold font-inter text-black">
            {t("orderSuccess.title")}
          </h1>
          <p className="text-black/60 font-poppins text-base md:text-lg leading-relaxed">
            {t("orderSuccess.message")}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white border border-border rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-10 duration-1000 delay-300">
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest opacity-60 font-poppins">
              {t("orderSuccess.orderId")}
            </span>
            <span className="text-lg font-bold font-inter">{orderId}</span>
          </div>
          <div className="text-end">
            <span className="text-xs uppercase tracking-widest opacity-60 font-poppins">
              {t("orderSuccess.status")}
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium font-poppins">
                {t("checkout.processing")}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-black/50 text-sm font-poppins">
                <Calendar size={14} />
                {t("orderSuccess.date")}
              </div>
              <span className="font-medium text-black">{orderDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-black/50 text-sm font-poppins">
                <CreditCard size={14} />
                {t("orderSuccess.paymentMethod")}
              </div>
              <span className="font-medium text-black">{paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-black/80 font-poppins">
              <Package size={16} />
              {t("orderSuccess.itemsOrdered", { count: order?.items.length ?? 0 })}
            </div>

            <div className="flex flex-col gap-4">
              {order?.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-secondary rounded-lg p-1 shrink-0 group-hover:scale-110 transition-transform">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-black/50 font-poppins">
                      {item.quantity} x {t("common.currency")}{item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-bold font-inter text-black">
                    {t("common.currency")}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-black/50 font-poppins">{t("cart.total.subtotal")}</span>
              <span className="font-medium font-inter text-black">{t("common.currency")}{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black/50 font-poppins">{t("cart.total.shipping")}</span>
              <span className="text-green-600 font-medium font-poppins">{t("cart.total.free")}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-primary" />
                <span className="text-lg font-bold font-inter text-black">{t("orderSuccess.total")}</span>
              </div>
              <span className="text-2xl font-bold font-inter text-black">
                {t("common.currency")}{orderTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 p-4 text-center text-xs font-poppins text-black/40 italic">
          {t("footer.copyright")}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <Link to="/orders" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-14 border-black/20 font-semibold hover:bg-black hover:text-white transition-all duration-300 rounded-xl cursor-pointer"
          >
            {t("orderSuccess.viewOrders")}
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full h-14 bg-primary hover:bg-primary text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 rounded-xl shadow-lg shadow-primary/20 cursor-pointer active:scale-95 hover:-translate-y-1">
            {t("orderSuccess.continueShopping")}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
