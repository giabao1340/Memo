import { useChatStore } from "@/store/useChatStore";
import ChatWelComeScreen from "./ChatWelComeScreen";
import MessagesItem from "./MessagesItem";
import { useEffect, useState } from "react";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<"delivered" | "seen">("delivered");
  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

useEffect(() => {
  const lastMessage = selectedConvo?.lastMessage;
  if(!lastMessage) {
    return
  }

  const seenBy = selectedConvo?.seenBy ?? [];

  setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");

}, [selectedConvo]);

  if (!selectedConvo) {
    return <ChatWelComeScreen />;
  }

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-mured-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautful-scroll-bar">
        {messages.map((message, index) => (
          <MessagesItem
            key={message._id ?? index}
            message={message}
            index={index}
            messages={messages}
            selectedConvo={selectedConvo}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
