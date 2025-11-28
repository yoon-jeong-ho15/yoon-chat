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
        rounded-2xl shadow bg-linear-to-r
         from-blue-400 to-indigo-400 p-1.5 ${outerClassName}`}
    >
      <div
        className={`bg-white rounded-xl overflow-hidden ${className} shadow`}
      >
        {children}
      </div>
    </div>
  );
}
