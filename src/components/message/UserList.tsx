import { NoProfile } from "../../assets/Icon";
import type { User } from "../../types/user";

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  messageCount: Map<string, number>;
  handleUserClick: (user: User) => void;
}

export default function UserList(props: UserListProps) {
  const { users, selectedUser, messageCount, handleUserClick } = props;
  return (
    <div
      className="w-70 h-full border-gray-400 border bg-gray-100
                rounded-xl shadow-lg"
    >
      <div className="px-4 py-3 border-b border-gray-400">
        <h2 className="text-xl font-bold">전체 사용자 목록</h2>
        <p className="text-sm mt-1">총 {users.length}명의 사용자</p>
      </div>
      <div className="divide-y divide-gray-200">
        {users.map((u) => (
          <UserListItem
            key={u.id}
            user={u}
            messageCount={messageCount.get(u.id) || 0}
            isSelected={selectedUser?.id === u.id}
            onClick={handleUserClick}
          />
        ))}
      </div>
    </div>
  );
}

interface UserListItemProps {
  user: User;
  messageCount: number;
  isSelected: boolean;
  onClick: (user: User) => void;
}

function UserListItem({
  user,
  messageCount,
  isSelected,
  onClick,
}: UserListItemProps) {
  return (
    <button
      onClick={() => onClick(user)}
      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-100" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.username}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <NoProfile className="size-10" />
        )}

        <div className="flex-1">
          <div className="text-gray-900">{user.username}</div>
          <div className="text-sm text-gray-500">메시지 {messageCount}개</div>
        </div>
        {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
      </div>
    </button>
  );
}
