import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;  
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { isRtl } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className={cn("flex mb-10", className)}>
      <ol className="flex items-center text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-black/50">
                {isRtl ? (
                  <ChevronRight size={14} className="rotate-180" />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            )}
            {item.active || (!item.href && !item.path) ? (
              <span className="text-black font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.href ?? item.path ?? "/"}
                className="text-black/50 hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
