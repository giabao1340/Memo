import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
          setActiveConversation: (id) => set({ activeConversationId: id }),
        });
      },
      fetchConversation: async () => {
        try {
            set({ loading: true });
            const {conversations} = await chatService.fetchConversatons();

            set({conversations, loading: false});

        } catch (error) {
            console.error("Lỗi xãy ra khi fetchConversations");
            set({loading: false});
        }

      }
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
