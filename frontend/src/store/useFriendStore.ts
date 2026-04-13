import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
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
      const resultMessage = await friendService.senFriendRequest(to, message);
      return resultMessage;
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn");
    } finally {
      set({ loading: false });
    }
  },
}));
