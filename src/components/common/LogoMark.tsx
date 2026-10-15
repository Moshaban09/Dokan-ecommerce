import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

export const LogoMark = ({ className }: LogoMarkProps) => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className={cn("size-7 shrink-0", className)}
  >
    <rect width="64" height="64" rx="14" className="fill-primary" />
    <path
      d="M22 16h12c10 0 16 6 16 16s-6 16-16 16H22z M30 24v16h4c5 0 8-3 8-8s-3-8-8-8z"
      fill="#F4EFE6"
      fillRule="evenodd"
    />
    <circle cx="48" cy="17" r="5" fill="#C8512B" />
  </svg>
);
