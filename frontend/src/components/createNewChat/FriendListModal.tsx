import { useFriendStore } from "@/store/useFriendStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MessageCircle, MessageCircleMore, Users } from "lucide-react";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/store/useChatStore";
import { fr } from "zod/v4/locales";

const FriendListModal = () => {
  const { friends } = useFriendStore();
  const { createConversation } = useChatStore();
  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
  };
  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-md">
          <MessageCircleMore className="size-6" />
          Bắt đầu cuộc trò chuyện mới
        </DialogTitle>
      </DialogHeader>

      {/* Friend list content would go here  */}
      <div className="space-y-4">
        <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Danh sach bạn bè
        </h1>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {friends.map((friend) => (
            <Card
              key={friend._id}
              onClick={() => handleAddConversation(friend._id)}
              className="p-3 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard"
            >
              <div className="flex items-center gap-3">
                {/* avatar */}
                <UserAvatar
                  type="sidebar"
                  name={friend.displayName}
                  avatarUrl={friend.avatarUrl}
                />
                {/* info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h2 className="font-semibold text-sm truncate">
                    {friend.displayName}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    @{friend.username}
                  </span>
                </div>
              </div>
            </Card>
          ))}
          {friends.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              Bạn chưa có bạn bè nào. Hãy thêm bạn bè để bắt đầu trò chuyện!
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
