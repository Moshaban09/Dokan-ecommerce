import { useAuth } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { cn } from "@/lib/utils";
import { Heart, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { NavLinks } from "./navbar/NavLinks";
import { SearchBar } from "./navbar/SearchBar";
import { TopHeader } from "./navbar/TopHeader";
import { UserMenu } from "./navbar/UserMenu";
import { LanguageSelector } from "./navbar/LanguageSelector";

export const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error(t("nav.loginRequired"), { id: "wishlist-auth" });
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 transition-all duration-300">
      <TopHeader />

      <div className="border-b border-black/10">
        <div className="max-w-360 mx-auto flex items-center justify-between px-2 md:px-4 h-23.5">
          <div className="flex items-center gap-4 md:gap-47.5">
            <Link to="/" className="text-[24px] font-bold text-black shrink-0">
              {t("nav.brand")}
            </Link>

            <NavLinks
              className="hidden md:flex items-center gap-12"
              itemClassName={({ isActive }) =>
                cn(
                  "text-base leading-6 transition-all text-black",
                  isActive && "font-medium",
                )
              }
            />
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <SearchBar className="hidden lg:flex w-60.75" />

            <div className="flex items-center gap-0.5 md:gap-4">
              <LanguageSelector />
              <Link
                to="/wishlist"
                onClick={handleWishlistClick}
                className="relative p-1.5 md:p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                aria-label={t("nav.wishlist")}
              >
                <Heart size={22} className="text-black" />
                {wishlistCount > 0 && (
                  <span
                    key={wishlistCount}
                    className="absolute top-0 inset-e-0 w-4.5 h-4.5 rounded-full bg-primary text-white text-[12px] flex items-center justify-center font-medium animate-badge-pop"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-1.5 md:p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                aria-label={t("nav.cart")}
              >
                <ShoppingCart size={22} className="text-black" />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute top-0 inset-e-0 w-4.5 h-4.5 rounded-full bg-primary text-white text-[12px] flex items-center justify-center font-medium animate-badge-pop"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-black hover:text-primary transition-colors px-2 py-1"
                >
                  {t("nav.login")}
                </Link>
              )}

              <button
                className="md:hidden text-black p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden bg-white border-b border-black/10 transition-all duration-500 ease-in-out overflow-hidden",
          mobileOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-6 gap-6">
          <SearchBar
            className="flex lg:hidden w-full"
            onSearchComplete={() => setMobileOpen(false)}
          />

          <div className="flex flex-col gap-2">
            <NavLinks
              className="flex flex-col gap-2"
              itemClassName={({ isActive }) =>
                cn(
                  "text-[18px] font-medium py-3 px-5 transition-all rounded-lg",
                  isActive
                    ? "bg-black text-white translate-x-2 shadow-md"
                    : "bg-secondary text-black hover:bg-gray-200",
                )
              }
              onItemClick={() => setMobileOpen(false)}
            />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-[18px] font-medium py-3 px-5 bg-secondary text-black hover:bg-gray-200 transition-all rounded-lg text-start flex items-center gap-3"
              >
                <LogOut size={20} />
                {t("nav.logout")} ({user?.name})
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-[18px] font-medium py-3 px-5 transition-all rounded-lg",
                    isActive
                      ? "bg-black text-white"
                      : "bg-secondary text-black hover:bg-gray-200",
                  )
                }
              >
                {t("nav.login")}
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
