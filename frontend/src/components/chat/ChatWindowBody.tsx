import { useChatStore } from "@/store/useChatStore";
import ChatWelComeScreen from "./ChatWelComeScreen";
import MessagesItem from "./MessagesItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedCovo = conversations.find(
    (c) => c._id === activeConversationId,
  );
  if (!selectedCovo) {
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
            selectedConvo={selectedCovo}
            lasteMessageStatus="delivered"
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
