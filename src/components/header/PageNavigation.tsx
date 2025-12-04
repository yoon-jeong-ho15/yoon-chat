import {
  HomeIcon,
  PowerIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthContext, useAuth } from "../../stores/authStore";
import { isAdmin } from "../../utils/user";

export default function PageNavigation() {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
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
  );
}
