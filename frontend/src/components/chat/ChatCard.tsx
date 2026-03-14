import React from "react";
import { Card } from "../ui/card";
import { formatOnlineTime, cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

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
  return (
    <Card
      key={convoId}
      className={cn(
        "border-none p-3, cursor-pointer transition-smooth hover:bg-mute/30",
        isActive &&
          "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground",
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex ittem-center gap-3">
        <div className="relative">{leftSection}</div>
        <div className="flext-1 min-w-0">
          <div className="flrx item-center justify-between mb-1">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                unreadCount && unreadCount > 0 && "text-foregro",
              )}
            >
              {name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}{" "}
            </span>
          </div>

          <div className="flex item-center justyfy-between">
            <div className="flex item-center gap-1 flex-1 min-w-0">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
