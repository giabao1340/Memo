import React from "react";
import { Card } from "../ui/card";
import { formatOnlineTime, cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";

interface ChatCardProps {
  convoId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection?: React.ReactNode;
  subtitle: React.ReactNode;
}
const ChatCard = ({
  convoId,
  name,
  timestamp,
  isActive,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  const { conversations, deleteConversation, leaveGroup } = useChatStore();
  const convo = conversations.find((c) => c._id === convoId);
  if (!convo) return null;

  const handleDeleteConversation = async () => {
    try {
      await deleteConversation(convo._id);
      toast.success("Đã xóa cuộc trò chuyện");
    } catch (error) {
      console.error("Lỗi khi rời nhóm:", error);
    }
  };
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(convo._id);
      toast.success("Đã rời nhóm");
    } catch (error) {
      console.error("Lỗi khi rời nhóm:", error);
    }
  };

  return (
    <Card
      key={convoId}
      className={cn(
        "border-none p-3 cursor-pointer transition-smooth glass hover:bg-mute/30",
        isActive &&
          "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground",
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                unreadCount && unreadCount > 0 && "text-foreground",
              )}
            >
              {name}
            </h3>

            <span className="text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {subtitle}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth" />
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={4}
                className="w-fit p-2"
              >
                {convo.type === "group" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLeaveGroup}
                    className="justify-center text-destructive text-sm border-0 hover:text-destructive hover:bg-destructive/10 border-0 whitespace-nowrap"
                  >
                    Rời nhóm
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteConversation}
                    className="justify-center text-destructive text-sm border-0 hover:text-destructive hover:bg-destructive/10 border-0 whitespace-nowrap"
                  >
                    Xóa cuộc trò chuyện
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
