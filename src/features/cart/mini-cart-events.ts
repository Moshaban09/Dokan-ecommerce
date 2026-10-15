export const OPEN_MINI_CART_EVENT = "dokan:open-mini-cart";

export const openMiniCart = () => {
  window.dispatchEvent(new Event(OPEN_MINI_CART_EVENT));
};
