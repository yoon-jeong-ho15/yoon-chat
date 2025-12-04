import {
  HomeIcon,
  PowerIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { useHeaderStore } from "../../stores/headerStore";
import { motion } from "motion/react";
import { isAdmin } from "../../utils/user";
import ModalNavigation from "./ModalNavigation";
import Notification from "./Notification";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <header className="flex w-full justify-between items-center p-1.5 pb-0">
      <div className="flex w-fit h-full border border-gray-500 bg-gray-100 items-center rounded-xl gap-2 px-2">
        <button
          onClick={() => navigate("/")}
          className="flex p-2 hover:bg-gray-200 rounded-full transition-colors space-x-1"
        >
          <HomeIcon className="size-5" />
        </button>
        {isAdmin(user.id) && (
          <button
            onClick={() => navigate("/admin")}
            className="flex p-2 hover:bg-gray-200 rounded-full transition-colors space-x-1"
          >
            <WrenchScrewdriverIcon className="size-5" />
          </button>
        )}
        <div className="h-full w-[1px] bg-gray-400"></div>

        <button
          onClick={handleLogout}
          className="relative p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Logout"
        >
          <PowerIcon className="size-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden mx-2">
        <HeaderAnimation />
      </div>

      <div className="pr-3">
        <ModalNavigation />
      </div>

      <Notification />
    </header>
  );
}

function HeaderAnimation() {
  const { displayText, key } = useHeaderStore();

  return (
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
  );
}
