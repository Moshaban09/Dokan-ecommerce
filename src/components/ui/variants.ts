import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary shadow-sm hover:shadow-md hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive shadow-sm hover:shadow-md hover:-translate-y-0.5",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-white hover:bg-success shadow-md hover:shadow-lg hover:-translate-y-0.5 border-none",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary hover:-translate-y-0.5",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0",
  {
    variants: {
      variant: {
        default: "bg-secondary text-black hover:bg-primary hover:text-white",
        outline: "border border-black/10 bg-white text-black hover:bg-black hover:text-white",
        ghost: "bg-transparent text-black hover:bg-black/5 shadow-none",
        primary: "bg-primary text-white hover:bg-primary hover:-translate-y-0.5",
      },
      size: {
        default: "w-11.5 h-11.5",
        sm: "w-9 h-9",
        lg: "w-14 h-14",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
