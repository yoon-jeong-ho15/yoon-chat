import { useAuth } from "../../contexts/useAuth";
import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { isAdmin } from "../../lib/data/message";
import { useModalStore, type ModalType } from "../../stores/modalStore";
import GradientContainer from "../common/GradientContainer";
import { useHeaderStore } from "../../stores/headerStore";

type TabItem = {
  title: string;
  icon: React.ForwardRefExoticComponent<any>;
  href?: string;
  modalKey?: ModalType;
  headerText?: string;
};

const regularUserTabs: TabItem[] = [
  {
    title: "메시지",
    modalKey: "message",
    icon: ChatBubbleLeftRightIcon,
    headerText: "저와 대화를 나눌 수 있습니다.",
  },
  {
    title: "트랙커",
    modalKey: "tracker",
    icon: FireIcon,
    headerText: "운동을 기록해보세요",
  },
];

const adminTabs: TabItem[] = [
  { title: "메시지", href: "/admin/message", icon: ChatBubbleLeftRightIcon },
  { title: "대시보드", href: "/admin/dashboard", icon: UsersIcon },
];

export default function Navigation() {
  const { user } = useAuth();
  const { setText } = useHeaderStore();

  const openModal = useModalStore((state) => state.openModal);

  // Determine which tabs to show based on user role
  const tabs = user && isAdmin(user.id) ? adminTabs : regularUserTabs;

  return (
    <GradientContainer
      outerClassName="p-[3px] rounded-full w-fit"
      className="rounded-full flex"
    >
      {tabs.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            onClick={() => {
              if (item.modalKey) {
                openModal(item.modalKey);
              }
            }}
            onMouseEnter={() => setText(item.headerText || "")}
            className="
              px-3 py-1 cursor-pointer border-none 
              outline-none flex items-center gap-2
              rounded-full
              transition-colors hover:bg-gray-200"
          >
            <Icon className="size-7" />
            <span className="text-sm">{item.title}</span>
          </button>
        );
      })}
    </GradientContainer>
  );
}
