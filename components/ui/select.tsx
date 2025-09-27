import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils.ts"

const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        default: "h-10 py-2",
        sm: "h-9 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectVariants> {
  value?: string
  placeholder?: string
  children?: React.ReactNode
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <button
        className={cn(selectVariants({ className }))}
        ref={ref}
        {...props}
      >
        <span>{props.value || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    )
  }
)
Select.displayName = "Select"

export { Select, selectVariants }