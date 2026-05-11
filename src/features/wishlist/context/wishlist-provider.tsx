import { useAuth } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState, type ReactNode } from "react";
import { WishlistContext } from "./wishlist-context";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [ids, setIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist_items") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      localStorage.setItem("wishlist_items", JSON.stringify(ids));
    }
  }, [ids, isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let ignore = false;

    const fetchWishlist = async () => {
      const { data } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", user.id);

      if (ignore) return;

      const dbIds = (data ?? []).map((r) => r.product_id);
      const localIds: number[] = JSON.parse(
        localStorage.getItem("wishlist_items") ?? "[]"
      );

      if (localIds.length > 0) {
        const newIds = localIds.filter((id) => !dbIds.includes(id));
        if (newIds.length > 0) {
          await supabase
            .from("wishlist_items")
            .insert(newIds.map((id) => ({ user_id: user.id, product_id: id })));
        }
        localStorage.removeItem("wishlist_items");
        setIds(Array.from(new Set([...dbIds, ...localIds])));
      } else {
        setIds(dbIds);
      }
    };

    fetchWishlist();
    return () => { ignore = true; };
  }, [isAuthenticated, user?.id]);

  const toggle = async (id: number) => {
    const exists = ids.includes(id);

    if (user?.id) {
      await (exists
        ? supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", id)
        : supabase.from("wishlist_items").insert({ user_id: user.id, product_id: id }));
    }

    setIds((prev) => exists ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <WishlistContext.Provider
      value={{
        ids,
        count: ids.length,
        toggle,
        isWished: (id) => ids.includes(id),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
