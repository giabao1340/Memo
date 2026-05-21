import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Ellipsis, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChatStore } from "@/store/useChatStore";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessagesItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === messages.length - 1 || // tin nhắn cũ nhất luôn hiện time
    new Date(prev?.createdAt || 0).getTime() -
      new Date(message.createdAt).getTime() >
      5 * 60 * 1000; // 5 phút (3000ms quá ngắn)

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;
  console.log("Render MessageItem", { content: message.content, isGroupBreak });
  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  const deleteMessage = useChatStore((state) => state.deleteMessage);

  const handleDeleteMessage = async () => {
    if (!message._id) return;

    // const confirmDelete = confirm("Bạn có chắc muốn xóa tin nhắn này?");
    // if (!confirmDelete) return;

    await deleteMessage(message._id);
  };

  return (
    <div>
      {isShowTime && (
        <span className="flex justify-center text-xs text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "flex gap-3 message-bounce mt-1 mr-1 group/row", // thêm group/row
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Moji"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* Button bên trái - tin của mình */}
        {message.isOwn && (
          <div className="self-center pt-1">
            {" "}
            {/* self-start thay vì self-center */}
            <Popover>
              <PopoverTrigger asChild={false}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-0 group-hover/row:opacity-100 transition hover:bg-primary/10"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={4}
                className="w-36 p-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteMessage}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="size-4 mr-2" />
                  Xóa
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          {/* CONTENT */}
          <div className="flex flex-col gap-1">
            {/* ẢNH */}
            <PhotoProvider>
              {Array.isArray(message.imgUrls) && message.imgUrls.length > 0 && (
                <div
                  className={cn(
                    "flex flex-col gap-2",
                    message.isOwn ? "items-end" : "items-start",
                  )}
                >
                  {message.imgUrls.map((url: string, index: number) => (
                    <PhotoView key={index} src={url}>
                      <Card className="p-0 border-0 overflow-hidden cursor-pointer">
                        <img
                          src={url}
                          alt="Attached"
                          className="max-w-[400px] h-auto rounded-xl object-cover hover:opacity-90 transition"
                        />
                      </Card>
                    </PhotoView>
                  ))}
                </div>
              )}
            </PhotoProvider>
            {/* TEXT */}
            {message.content && (
              <Card
                className={cn(
                  "p-3 w-fit",
                  message.isOwn
                    ? "chat-bubble-sent border-0  border-0 self-end"
                    : "chat-bubble-received",
                )}
              >
                <p className="text-sm leading-relaxed break-words">
                  {message.content}
                </p>
              </Card>
            )}
          </div>

          {/* seen/delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0.5 h-4 border-0",
                lastMessageStatus === "seen"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {lastMessageStatus === "delivered" ? "Đã gửi" : "Đã nhận"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesItem;
