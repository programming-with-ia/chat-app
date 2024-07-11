import * as React from "react"

import { cn } from "@/lib/utils"
import TextareaAutosize, {TextareaAutosizeProps} from 'react-textarea-autosize';

export interface TextareaProps
  extends TextareaAutosizeProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "flex w-full bg-transparent text-sm shadow-sm px-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
