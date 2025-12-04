import { useHeaderStore } from "../../stores/headerStore";
import { motion } from "motion/react";
import ModalNavigation from "./ModalNavigation";
import Notifications from "./Notifications";
import PageNavigation from "./PageNavigation";

export default function Header() {
  const { displayText, key } = useHeaderStore();
  return (
    <header className="flex w-full justify-between items-center p-1.5 pb-0 space-x-3">
      <PageNavigation />

      <div className="flex flex-1 overflow-hidden mx-2">
        <div className="flex w-full h-8 items-center justify-center">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
          >
            {displayText}
          </motion.div>
        </div>
      </div>

      <ModalNavigation />
      <Notifications />
    </header>
  );
}
