import { useChatStore } from "@/store/useChatStore";
import ChatWelComeScreen from "./ChatWelComeScreen";
import MessagesItem from "./MessagesItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthStore } from "@/store/useAuthStore";

const ChatWindowBody = () => {
  const { user } = useAuthStore();

  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");
  const [isScrollRestored, setIsScrollRestored] = useState(false);

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const key = `chat-scroll-${activeConversationId}`;

  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const MessageEndRef = useRef<HTMLDivElement>(null);
  const isRestoringScroll = useRef(false);

  // Reset trạng thái khi đổi conversation
  useEffect(() => {
    const hasSavedScroll = !!sessionStorage.getItem(key);
    setIsScrollRestored(!hasSavedScroll); // Nếu không có saved scroll thì không cần restore
  }, [key]);

  // Cập nhật trạng thái seen/delivered
  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;
    if (!lastMessage) return;
    const seenBy = selectedConvo?.seenBy ?? [];
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConvo]);

  // Scroll về cuối khi không có saved scroll
  useLayoutEffect(() => {
    if (isScrollRestored || sessionStorage.getItem(key)) return;
    MessageEndRef.current?.scrollIntoView({ block: "end" });
  }, [key, isScrollRestored]);

  //Cuộn xuống khi gửi tin nhắn
  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.senderId === user?._id) {
      MessageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);

  // Restore scroll position
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || isScrollRestored) return;

    const item = sessionStorage.getItem(key);
    if (!item) return;

    const { scrollTop } = JSON.parse(item);

    isRestoringScroll.current = true;
    container.scrollTop = scrollTop;

    if (Math.abs(container.scrollTop - scrollTop) < 1) {
      // scrollHeight đủ lớn, restore thành công
      isRestoringScroll.current = false;
      setIsScrollRestored(true);
    } else {
      // scrollHeight chưa đủ, đợi thêm messages
      isRestoringScroll.current = false;
    }
  }, [key, messages.length, isScrollRestored]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) return;
    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi khi load thêm tin nhắn");
    }
  };

  const handleScrollSave = () => {
    if (isRestoringScroll.current || !isScrollRestored) return;
    const container = containerRef.current;
    if (!container || !activeConversationId) return;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  if (!selectedConvo) return <ChatWelComeScreen />;

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-mured-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        // Ẩn container cho đến khi restore xong, tránh thấy animation scroll
        style={{
          opacity: isScrollRestored ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautful-scroll-bar"
      >
        <div ref={MessageEndRef} />
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>Đang tải...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessagesItem
              key={message._id ?? index}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;
