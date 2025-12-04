import type { ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import ModalTop from "./ModalTop";
import type { ModalProps } from "../../types/modal";

export default function Modal({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  title,
  children,
  className = "",
  width = "w-fit",
  height,
}: ModalProps & {
  title: string;
  children: ReactNode;
  className?: string;
  width?: string;
  height?: string;
}) {
  const dragControls = useDragControls();

  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragListener={false}
      dragConstraints={{
        current: document.querySelector("[data-modal-container]"),
      }}
      className={`
        fixed
        bg-white rounded-lg overflow-hidden
        ${width} flex flex-col
        border border-gray-600 shadow-lg
        z-50
        `}
      onClick={(e) => e.stopPropagation()}
    >
      <div onPointerDown={(e) => dragControls.start(e)}>
        <ModalTop
          title={title}
          isMinimized={isMinimized}
          onClose={onClose}
          onMinimize={onMinimize}
        />
      </div>

      <div
        className={`
          p-2 ${height} ${className}
        `}
      >
        {children}
      </div>
    </motion.div>
  );
}
