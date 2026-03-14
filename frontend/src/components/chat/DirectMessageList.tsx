import { useChatStore } from "@/store/useChatStore";
import DirecteMessageCard from "./DirecteMessageCard";

const DirectMessageList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;
  const directConversations = conversations.filter(
    (convo) => convo.type === "direct",
  );
  console.log("Direct chat: ", directConversations);
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConversations.map((convo) => (
        <DirecteMessageCard convo={convo} />
      ))}
    </div>
  );
};

export default DirectMessageList;
