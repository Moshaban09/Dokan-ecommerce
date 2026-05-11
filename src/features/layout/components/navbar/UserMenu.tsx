import { useAuth } from "@/features/auth";
import { LogOut, ShoppingBag, Star, User, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";

export const UserMenu = () => {
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="flex items-center gap-2 relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-2 rounded-full transition-all duration-200 cursor-pointer relative z-50",
          isOpen
            ? "bg-primary text-white shadow-md"
            : "hover:bg-gray-100 text-black"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t("nav.userMenu")}
      >
        <User size={22} />
      </button>

      <div
        className={cn(
          "absolute top-[calc(100%+8px)] end-0 rounded-xl flex flex-col min-w-[240px] transition-all duration-200 z-50 overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100",
          isOpen
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="px-4 py-4 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-black font-semibold text-sm truncate">
                {user?.name || t("account.profile.guest")}
              </span>
              <span className="text-gray-500 text-[11px] truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-1.5">
          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <User size={18} strokeWidth={1.5} />
            <span className="text-sm">{t("account.sidebar.manageAccount")}</span>
          </Link>

          <Link
            to="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="text-sm">{t("account.sidebar.myOrders")}</span>
          </Link>

          <Link
            to="/cancellations"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <XCircle size={18} strokeWidth={1.5} />
            <span className="text-sm">{t("account.sidebar.myCancellations")}</span>
          </Link>

          <Link
            to="/reviews"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <Star size={18} strokeWidth={1.5} />
            <span className="text-sm">{t("account.sidebar.myReviews")}</span>
          </Link>

          <div className="h-px bg-gray-100 my-1.5 mx-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-primary hover:bg-red-50 transition-colors font-medium text-start cursor-pointer"
          >
            <LogOut size={18} strokeWidth={2} />
            <span className="text-sm">{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </div>


  );
};
