import UserInfo from "../components/profile/UserInfo";
import UserProfile from "../components/profile/UserProfile";
import { useAuth } from "../contexts";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;
  return (
    <div>
      <UserProfile user={user} />
      <UserInfo user={user} />
    </div>
  );
}
