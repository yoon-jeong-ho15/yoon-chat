import type { ReactNode } from "react";

interface GrayContainerProps {
  children: ReactNode;
  className?: string;
}

export default function GrayContainer({
  children,
  className,
}: GrayContainerProps) {
  return (
    <div
      className={`border-gray-400 border bg-gray-100
          rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
