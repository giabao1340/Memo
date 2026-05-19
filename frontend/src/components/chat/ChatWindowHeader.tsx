import { useChatStore } from "@/store/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/store/useSocketStore";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import GroupChatDetails from "./GroupChatDetails";
import { List } from "lucide-react";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  let otherUser;
  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-index-10 gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }
  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
  }
  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientations=vertical]:h-4"
        />
        <div className="p-2 w-full flex items-center gap-3">
          {/* avatar */}
          <div className="relative">
            {chat.type === "direct" ? (
              <>
                <PhotoProvider>
                  {otherUser?.avatarUrl ? (
                    <PhotoView src={otherUser.avatarUrl}>
                      <div className="cursor-pointer">
                        <UserAvatar
                          type="sidebar"
                          name={otherUser?.displayName || "Memo"}
                          avatarUrl={otherUser.avatarUrl}
                        />
                      </div>
                    </PhotoView>
                  ) : (
                    <UserAvatar
                      type="sidebar"
                      name={otherUser?.displayName || "Memo"}
                      avatarUrl={undefined}
                    />
                  )}
                </PhotoProvider>
                {/* socket io */}
                <StatusBadge
                  status={
                    onlineUsers.includes(otherUser?._id ?? "")
                      ? "online"
                      : "offline"
                  }
                />
              </>
            ) : (
              <GroupChatAvatar
                participants={chat.participants}
                type="sidebar"
              />
            )}
          </div>

          {/* Name */}
          <h2 className="font-semibold text-foreground">
            {chat.type === "direct" ? otherUser?.displayName : chat.group.name}
          </h2>

          <Dialog>
            {chat.type === "group" && (
              <DialogTrigger className="ml-auto text-sm text-primary">
                <List />
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="justify-center items-center flex gap-2">
                  Thông tin nhóm
                </DialogTitle>
              </DialogHeader>
              <GroupChatDetails chat={chat} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default ChatWindowHeader;
