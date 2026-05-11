export interface WishlistContextValue {
  ids: number[];
  count: number;
  toggle: (id: number) => void;
  isWished: (id: number) => boolean;
}
