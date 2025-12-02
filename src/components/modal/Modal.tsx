import type { ReactNode } from "react";
import ModalTop from "./ModalTop";

interface ModalProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden 
        w-fit flex flex-col 
        border border-gray-600 shadow-lg`}
      onClick={(e) => e.stopPropagation()}
    >
      <ModalTop
        title={title}
        isMinimized={isMinimized}
        onClose={onClose}
        onMinimize={onMinimize}
      />

      <div className={`${isMinimized ? "h-0 p-0" : "h-auto p-2"}`}>
        {children}
      </div>
    </div>
  );
}
