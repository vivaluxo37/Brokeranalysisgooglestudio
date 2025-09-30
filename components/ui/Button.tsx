import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md focus-visible:ring-blue-500",
        primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md focus-visible:ring-blue-500",
        destructive:
          "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow-md focus-visible:ring-red-500",
        outline:
          "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950",
        secondary:
          "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800",
        link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }