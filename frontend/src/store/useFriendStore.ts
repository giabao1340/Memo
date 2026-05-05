import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],
  searchByUsername: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchUserByUsername(username);
      return user;
    } catch (error) {
      console.error("Lỗi xãy ra khi tìm user bằng username");
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addFriend: async (to, message) => {
    set({ loading: true });
    try {
      const resultMessage = await friendService.sendFriendRequest(to, message);
      return resultMessage;
    } catch (error) {
      toast.error(
        "Bạn đã gửi lời mời kết bạn hoặc hai bạn đã là bạn bè với nhau rồi",
      );
      console.error("Lỗi khi gửi lời mời kết bạn");
    } finally {
      set({ loading: false });
    }
  },
  getAllFriendRequest: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequest();

      if (!result) {
        return;
      }
      const { sent, received } = result;
      set({ receivedList: received, sentList: sent });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lời mời kết bạn");
    } finally {
      set({ loading: false });
    }
  },
  acceptRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((req) => req.id !== requestId),
      }));
      await get().getAllFriendRequest();
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời kết bạn");
    } finally {
      set({ loading: false });
    }
  },
  declineRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((req) => req.id !== requestId),
      }));
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời kết bạn");
    } finally {
      set({ loading: false });
    }
  },
}));
