export interface CartItem {
  id: number;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  isLoading: boolean;
  addItem: (id: number, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isCouponApplied: boolean;
  appliedCouponCode: string | null;
  applyCoupon: (code: string, userCoupon: string) => boolean;
  removeCoupon: () => void;
}

