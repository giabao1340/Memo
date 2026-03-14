import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import UnreadCountBadge from "./UnreadCountBadge";
import StatusBadge from "./StatusBadge";

const DirecteMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages } =
    useChatStore();

  if (!user) return null;

  const otherUser = convo.participants.find((p) => p._id !== user._id);// Tìm người còn lại trong cuộc trò chuyện
  console.log("participants:", convo.participants);
  console.log("current user:", user._id);
  if (!otherUser) return null;
  const unreadCount = convo.unreadCounts[user._id];
  const lastMessage = convo.lastMessage?.content || ""; // trả về content hoặc chuỗi rỗng
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      //
    }
  };
  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.displayName ?? ""}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage?.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={setActiveConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />
          <StatusBadge status="offline" />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-mote-foreground",
          )}
        >
          {lastMessage[0]}
        </p>
      }
    />
  );
};

export default DirecteMessageCard;
