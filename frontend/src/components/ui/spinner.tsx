import * as React from "react"
import { cn } from "../../lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: "h-3 w-3 border-2",
  default: "h-4 w-4 border-2",
  lg: "h-6 w-6 border-3"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-current border-t-transparent",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
