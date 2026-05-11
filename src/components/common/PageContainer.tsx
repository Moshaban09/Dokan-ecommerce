import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("max-w-360 mx-auto w-full px-4", className)}>
      {children}
    </div>
  );
};
