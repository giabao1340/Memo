import { useFriendStore } from "@/store/useFriendStore";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import UserAvatar from "./UserAvatar";
import { useChatStore } from "@/store/useChatStore";
import type { Conversation } from "@/types/chat";

const FriendList = ({ chat }: { chat: Conversation }) => {
  const { friends, getFriends } = useFriendStore();
  const { addGroupMembers, loading } = useChatStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const participantIds = chat.participants.map((p) => p._id);
  const filteredFriends = friends.filter(
    (friend) => !participantIds.includes(friend._id) // chỉ hiện người chưa trong nhóm
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleInvite = async () => {
    if (selectedIds.size === 0) return;
    try {
      await addGroupMembers(chat._id, [...selectedIds]);
      setSelectedIds(new Set()); // reset sau khi mời
    } catch (error) {
      console.error("Lỗi mời thành viên:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1 beautiful-scroll-bar">
        {filteredFriends.map((friend) => (
          <Card
            key={friend._id}
            onClick={() => toggleSelect(friend._id)}
            className={`p-3 cursor-pointer transition-smooth hover:shadow-soft group/friendCard
              ${selectedIds.has(friend._id)
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                : "glass hover:bg-muted/30"
              }`}
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                type="sidebar"
                name={friend.displayName}
                avatarUrl={friend.avatarUrl}
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <h2 className="font-semibold text-sm truncate">
                  {friend.displayName}
                </h2>
                <span className="text-sm text-muted-foreground">
                  @{friend.username}
                </span>
              </div>

              {/* Checkbox tròn */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${selectedIds.has(friend._id)
                  ? "bg-blue-500 border-blue-500"
                  : "border-muted-foreground"
                }`}
              >
                {selectedIds.has(friend._id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Nút mời */}
      <button
        onClick={handleInvite}
        disabled={selectedIds.size === 0 || loading}
        className="mt-2 w-full py-2 rounded-md bg-blue-500 text-white text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {loading ? "Đang mời..." : `Mời ${selectedIds.size > 0 ? `(${selectedIds.size})` : ""}`}
      </button>
    </div>
  );
};

export default FriendList;