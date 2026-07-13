import { AccountLayout } from "../components/AccountLayout";
import { useAuth } from "@/features/auth";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

type OrderWithItems = Order & { order_items: OrderItem[] };

export default function OrdersPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("account.orders.title"));
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as OrderWithItems[]) ?? []);
      setIsLoading(false);
    };

    fetchOrders();
  }, [user?.id]);

  return (
    <AccountLayout
      title={t("account.orders.title")}
      breadcrumbItems={[
        { label: t("common.home"), to: "/" },
        { label: t("account.sidebar.manageAccount"), to: "/account" },
        { label: t("account.orders.title"), active: true },
      ]}
    >
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <p className="text-center font-normal text-[16px] text-black max-w-2xl">
            {t("account.orders.empty")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-black/10 rounded p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                <div>
                  <p className="text-sm font-medium text-black">
                    {t("account.orders.orderId")}: {order.order_number}
                  </p>
                  <p className="text-xs text-black/50 mt-1">
                    {new Date(order.created_at).toLocaleDateString(
                      t("common.locale", { defaultValue: "en-US" })
                    )}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-primary">
                    {t(`account.orders.statuses.${order.status}`, { defaultValue: order.status })}
                  </p>
                  <p className="text-sm font-bold text-black mt-1">
                    {t("common.currency")}{order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-contain border border-black/5 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black line-clamp-1">{item.title}</p>
                      <p className="text-sm text-black/50 mt-1">
                        {t("account.orders.qty")}: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-black">
                      {t("common.currency")}{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
