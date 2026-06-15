import type { ClassValue } from "clsx"
import emptyGrid from "../assets/iconoir_grid-add.png"
import { cn } from "../lib/lib"

export const Empty = ({ message, className }: { message: string, className?: ClassValue }) => {
  return (
    <div className={cn("flex flex-col items-center gap-y-2 text-lg", className)}>
      <img src={emptyGrid} />
      <p>{message}</p>
    </div>
  )
}
