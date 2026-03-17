import { useChatStore } from '@/store/useChatStore'
import ChatWelComeScreen from './ChatWelComeScreen';
import ChatWindowSkeleton from './ChatWindowSkeleton';
import { SidebarInset } from '../ui/sidebar';
import ChatWindowHeader from './ChatWindowHeader';
import ChatWindowBody from './ChatWindowBody';
import MessageInput from './MessageInput';

const ChatWindowLayout = () => {
  const {activeConversationId, conversations, messageLoading: loading, messages} = useChatStore();
  const selectedConvo = conversations.find((c) => c._id === activeConversationId);

  if((!selectedConvo)) {
    return <ChatWelComeScreen />
  }

  if(loading) {
    return <ChatWindowSkeleton />
  }
  return (
    <SidebarInset className="flex flex-col h-full overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader />
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>
      {/* Footer */}
      <MessageInput />
    </SidebarInset>
  );
}

export default ChatWindowLayout