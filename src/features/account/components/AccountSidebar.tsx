import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

export function AccountSidebar() {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-1/4 flex flex-col gap-6 shrink-0">
      <div>
        <h3 className="font-medium text-black mb-4">
          {t("account.sidebar.manageAccount")}
        </h3>
        <ul className="flex flex-col gap-2 ps-8 text-black/50 text-sm">
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "hover:text-black cursor-pointer transition-colors"
            }
          >
            {t("account.sidebar.myProfile")}
          </NavLink>
          <li className="hover:text-black cursor-pointer transition-colors">
            {t("account.sidebar.addressBook")}
          </li>
          <li className="hover:text-black cursor-pointer transition-colors">
            {t("account.sidebar.paymentOptions")}
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-medium text-black mb-4">
          {t("account.sidebar.myOrders")}
        </h3>
        <ul className="flex flex-col gap-2 ps-8 text-black/50 text-sm">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "hover:text-black cursor-pointer transition-colors"
            }
          >
            {t("account.sidebar.myOrders")}
          </NavLink>
          <li className="hover:text-black cursor-pointer transition-colors">
            {t("account.sidebar.myReturns")}
          </li>
          <NavLink
            to="/cancellations"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "hover:text-black cursor-pointer transition-colors"
            }
          >
            {t("account.sidebar.myCancellations")}
          </NavLink>
        </ul>
      </div>
      <div>
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium text-black hover:text-primary transition-colors"
          }
        >
          {t("account.sidebar.myWishlist")}
        </NavLink>
      </div>
      <div>
        <h3 className="font-medium text-black mb-4">
          {t("account.sidebar.myReviews")}
        </h3>
        <ul className="flex flex-col gap-2 ps-8 text-black/50 text-sm">
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "hover:text-black cursor-pointer transition-colors"
            }
          >
            {t("account.sidebar.myReviews")}
          </NavLink>
        </ul>
      </div>
    </div>
  );
}
