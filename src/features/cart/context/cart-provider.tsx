import { useAuth } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartContextValue, CartItem } from "../types";
import { CartContext } from "./cart-context";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart_items") ?? "[]");
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const isGuest = !isAuthenticated || !user?.id;

  useEffect(() => {
    if (isGuest) {
      setItems([]);
      setIsCouponApplied(false);
      setAppliedCouponCode(null);
    }
  }, [isGuest]);

  useEffect(() => {
    if (isGuest) localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items, isGuest]);

  useEffect(() => {
    if (isGuest) return;

    let ignore = false;

    const fetchCart = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("cart_items")
        .select("product_id, quantity")
        .eq("user_id", user.id);

      if (ignore) return;

      const dbItems = (data ?? []).map((r) => ({
        id: r.product_id,
        quantity: r.quantity,
      }));
      const localItems: CartItem[] = JSON.parse(
        localStorage.getItem("cart_items") ?? "[]",
      );

      if (localItems.length > 0) {
        const merged = [...dbItems];
        const ops = localItems.map((local) => {
          const existing = merged.find((i) => i.id === local.id);
          if (existing) {
            existing.quantity += local.quantity;
            return supabase
              .from("cart_items")
              .update({ quantity: existing.quantity })
              .eq("user_id", user.id)
              .eq("product_id", existing.id);
          } else {
            merged.push(local);
            return supabase.from("cart_items").insert({
              user_id: user.id,
              product_id: local.id,
              quantity: local.quantity,
            });
          }
        });

        await Promise.all(ops);
        localStorage.removeItem("cart_items");
        setItems(merged);
      } else {
        setItems(dbItems);
      }

      setIsLoading(false);
    };

    fetchCart();
    return () => {
      ignore = true;
    };
  }, [isGuest, user?.id]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const addItem = async (id: number, quantity = 1) => {
    const existing = items.find((i) => i.id === id);
    const newQty = (existing?.quantity ?? 0) + quantity;

    if (user?.id) {
      await supabase
        .from("cart_items")
        .upsert(
          { user_id: user.id, product_id: id, quantity: newQty },
          { onConflict: "user_id,product_id" },
        );
    }

    setItems((prev) =>
      existing
        ? prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
        : [...prev, { id, quantity }],
    );
  };

  const removeItem = async (id: number) => {
    if (user?.id) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = async (id: number, quantity: number) => {
    const safeQty = Math.max(1, quantity);
    if (user?.id) {
      await supabase
        .from("cart_items")
        .update({ quantity: safeQty })
        .eq("user_id", user.id)
        .eq("product_id", id);
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: safeQty } : i)),
    );
  };

  const clearCart = async () => {
    if (user?.id) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    } else {
      localStorage.removeItem("cart_items");
    }
    setItems([]);
    setIsCouponApplied(false);
    setAppliedCouponCode(null);
  };

  const applyCoupon = (code: string, userCoupon: string) => {
    if (code.trim().toUpperCase() === userCoupon.trim().toUpperCase()) {
      setIsCouponApplied(true);
      setAppliedCouponCode(code.trim().toUpperCase());
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setAppliedCouponCode(null);
  };

  const value: CartContextValue = {
    items,
    count,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCouponApplied,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
