import { useFriendStore } from "@/store/useFriendStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import SelectedUsersList from "../newGroupChat/SelectedUsersList";
import { toast } from "sonner";
import { useChatStore } from "@/store/useChatStore";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { loading, createConversation } = useChatStore();
  const handleGetFriends = async () => {
    await getFriends();
  };

  const filterFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLocaleLowerCase()) &&
      !invitedUsers.some((u) => u._id === friend._id),
  );

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length === 0) {
        toast.warning("Vui lòng chọn ít nhất một thành viên để tạo nhóm chat");
        return;
      }
      await createConversation(
        "group",
        groupName,
        invitedUsers.map((u) => u._id),
      );
      toast.success("Nhóm chat đã được tạo thành công");
      setSearch("");
      setInvitedUsers([]);
      setGroupName("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo nhóm chat");
    }
    // Handle form submission logic here
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleGetFriends}
          className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer"
        >
          <Users className="size-4" />
          <span className="sr-only">Tạo nhóm chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Tạo nhóm chat</DialogTitle>
        </DialogHeader>
        <form action="" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Tên nhóm
            </Label>
            <Input
              id="groupName"
              placeholder="Nhập tên nhóm chat"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="glass border-boder/50 focus:border-primary/50 transition-smooth"
              required
            ></Input>
            {/* Moi thanh vien */}
            <div className="space-y-2">
              <Label htmlFor="invite" className="text-sm font-semibold">
                Mời thành viên
              </Label>
              <Input
                id="invite"
                placeholder="Tìm theo tên hiển thị"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              ></Input>

              {/* Danh sach goi y */}
              {search && filterFriends.length > 0 && (
                <InviteSuggestionList
                  filterFriends={filterFriends}
                  onSelect={handleSelectFriend}
                />
              )}

              {/* Danh sach user da chon */}
              <SelectedUsersList
                invitedUsers={invitedUsers}
                onRemove={handleRemoveFriend}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
            >
              {loading ? (
                <span>Đang tạo...</span>
              ) : (
                <>
                  {" "}
                  <UserPlus className="size-4 mr-2" /> Tạo Nhóm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;
