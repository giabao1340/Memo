import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      loading: false,
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          setActiveConversation: (id) => set({ activeConversationId: id }),
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();

          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Lỗi xãy ra khi fetchConversations");
          set({ convoLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );

          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchMessages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },
      sendDirectMessage: async (
        recipientId,
        content,
        files,
        conversationId,
      ) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            files,
            conversationId ?? activeConversationId ?? undefined,
          );
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi khi gửi tin nhắn trực tiếp", error);
          throw error; // throw để MessageInput bắt được lỗi
        }
      },

      sendGroupMessage: async (conversationId, content, files) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, files);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi khi gửi tin nhắn nhóm", error);
          throw error;
        }
      },
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();

          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[convoId]?.items ?? [];
          }
          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xãy ra khi add mesasge: ", error);
        }
      },

      removeMessageRealtime: (messageId: string, conversationId: string) => {
        set((state) => {
          const prevItems = state.messages[conversationId]?.items ?? [];

          return {
            messages: {
              ...state.messages,
              [conversationId]: {
                ...state.messages[conversationId],
                items: prevItems.filter((m) => m._id !== messageId),
              },
            },
          };
        });
      },

      deleteMessage: async (messageId: string) => {
        try {
          await chatService.deleteMessage(messageId);
          const convoId = get().activeConversationId;
          if (!convoId) return;

          get().removeMessageRealtime(messageId, convoId);
        } catch (error) {
          console.error(error);
        }
      },
      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },
      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!convo) {
            return;
          }

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
            return;
          }

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi khi mark as seen useChatStore", error);
        }
      },
      addConvo: (convo) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id.toString() === convo._id.toString(),
          );
          return {
            conversations: exists
              ? state.conversations
              : [convo, ...state.conversations],
            activeConversationId: convo._id,
          };
        });
      },
      createConversation: async (type, name, memberIds) => {
        try {
          set({ loading: true });
          const conversation = await chatService.createConversation(
            type,
            name,
            memberIds,
          );
          get().addConvo(conversation); // chỉ add cho người tạo, các thành viên khác nhận qua socket
        } catch (error) {
          console.error("Lỗi khi tạo cuộc trò chuyện:", error);
        } finally {
          set({ loading: false });
        }
      },
      deleteConversation: async (conversationId) => {
        try {
          set({ loading: true });
          await chatService.deleteConversation(conversationId);
          // Không cần update state, socket "conversation-deleted" sẽ xử lý
        } catch (error) {
          console.error("Lỗi khi xóa cuộc trò chuyện:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      leaveGroup: async (conversationId) => {
        try {
          set({ loading: true });
          await chatService.leaveGroup(conversationId);
          // Không cần update state, socket "group-left" sẽ xử lý
        } catch (error) {
          console.error("Lỗi khi rời nhóm:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      removeConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.filter(
            (c) => c._id !== conversationId,
          ),
          activeConversationId:
            state.activeConversationId === conversationId
              ? null
              : state.activeConversationId,
        }));
      },

      removeMemberFromConversation: (conversationId, userId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversationId
              ? {
                  ...c,
                  participants: c.participants.filter(
                    (p) => p._id.toString() !== userId.toString(),
                  ),
                }
              : c,
          ),
        }));
      },
      // Đổi tên để tránh nhầm lẫn - đây là action cập nhật state local
      addGroupMembers: async (conversationId: string, memberIds: string[]) => {
        try {
          set({ loading: true });
          await chatService.addGroupMembers(conversationId, memberIds);
          // Không cần cập nhật state ở đây
          // vì socket "invite-members" sẽ tự cập nhật realtime
        } catch (error) {
          console.error("Lỗi khi thêm thành viên vào nhóm:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateConversationMembers: (conversation) => {
        const { conversations } = get();

        const exists = conversations.some((c) => c._id === conversation._id);

        if (exists) {
          // Cập nhật conversation đã có
          set({
            conversations: conversations.map((c) =>
              c._id === conversation._id ? conversation : c,
            ),
          });
        } else {
          // Thêm conversation mới vào danh sách
          set({
            conversations: [conversation, ...conversations],
          });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
