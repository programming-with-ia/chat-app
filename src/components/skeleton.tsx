import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type StrNum = string | number

interface SkeletonProps {
  className?: string;
  width?: StrNum;
  height?: StrNum;
  borderRadius?: StrNum;
  style?: CSSProperties;
}

export const Skeleton = ({ className, width, height, borderRadius, style }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-md border border-border/60 bg-foreground/5 shadow-xl shadow-black/5 loadingIndcator",
        className,
      )}
      aria-busy
      style={{ width, height, borderRadius, ...style }}
    />
  );
};