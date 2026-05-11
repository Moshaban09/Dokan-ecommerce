import * as React from "react";
import { cn } from "@/lib/utils";

export interface UnderlineInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const UnderlineInput = React.forwardRef<HTMLInputElement, UnderlineInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <input
          className={cn(
            "w-full border-0 border-b border-black/30 py-2 focus:border-primary outline-none transition-all placeholder:text-black/50 font-poppins text-base text-black",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 font-poppins">{error}</span>
        )}
      </div>
    );
  }
);

UnderlineInput.displayName = "UnderlineInput";

export { UnderlineInput };
