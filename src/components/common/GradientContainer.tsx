import type { ReactNode } from "react";

interface GradientContainerProps {
  children: ReactNode;
  className?: string;
  outerClassName?: string;
}

export default function GradientContainer({
  children,
  className,
  outerClassName,
}: GradientContainerProps) {
  return (
    <div
      className={`
        shadow bg-linear-to-r
         from-blue-400 to-indigo-400 ${outerClassName}`}
    >
      <div className={`bg-white ${className}`}>{children}</div>
    </div>
  );
}
