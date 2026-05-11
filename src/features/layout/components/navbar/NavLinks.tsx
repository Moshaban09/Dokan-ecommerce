import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "nav.home", href: "/" },
  { label: "nav.contact", href: "/contact" },
  { label: "nav.about", href: "/about" },
];

interface NavLinksProps {
  className?: string;
  itemClassName?: string | ((props: { isActive: boolean }) => string);
  onItemClick?: () => void;
}

export const NavLinks = ({ className, itemClassName, onItemClick }: NavLinksProps) => {
  const { t } = useTranslation();
  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          onClick={onItemClick}
          className={({ isActive }) => cn(
            typeof itemClassName === 'function' ? itemClassName({ isActive }) : itemClassName,
            "py-1 text-base transition-colors md:relative",
            "md:after:absolute md:after:bottom-0 md:after:start-0 md:after:h-[1px] md:after:bg-black md:after:transition-all md:after:duration-300",
            isActive ? "md:after:w-full" : "md:after:w-0 md:hover:after:w-full"
          )}
        >
          {t(link.label)}
        </NavLink>
      ))}
    </nav>
  );
};
