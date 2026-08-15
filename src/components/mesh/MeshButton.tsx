import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const meshButtonVariants = cva(
  "press-3d inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium tracking-tight disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110",
        outline:
          "border border-border bg-surface/60 text-foreground shadow-[var(--shadow-soft)] hover:border-accent/60 hover:bg-surface",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-surface/70",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface MeshButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof meshButtonVariants> {
  asChild?: boolean;
}

export const MeshButton = forwardRef<HTMLButtonElement, MeshButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(meshButtonVariants({ variant, size }), className)} {...props} />
    );
  },
);
MeshButton.displayName = "MeshButton";
