import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessTokent = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseUrl, {
      auth: { token: accessTokent },
      transports: ["websocket"],
    });
    set({ socket });
    socket.on("connect", () => {
      // console.log("Đã kêt nối với socket");
      useChatStore.getState().fetchConversations();
    });
    //online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
    socket.on("invite-members", ({ conversation }) => {
      useChatStore.getState().updateConversationMembers(conversation);
      // Join room của conversation mới
      socket.emit("join-conversation", conversation._id);
    });
    socket.on("new-conversation", ({ conversation }) => {
      useChatStore.getState().addConvo(conversation);
    });
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().updateConversation(updatedConversation);
    });

    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };
      useChatStore.getState().updateConversation(updated);
      // console.log("conversation:", conversation);
      // console.log("updated:", updated);
    });
    socket.on("delete-message", ({ messageId, conversationId }) => {
      const { removeMessageRealtime } = useChatStore.getState();
      removeMessageRealtime(messageId, conversationId);
    });
    socket.on("conversation-updated", (conversation) => {
      useChatStore.getState().updateConversation(conversation);
    });
    // New group
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });

    socket.on("conversation-deleted", ({ conversationId }) => {
      useChatStore.getState().removeConversation(conversationId);
    });
    socket.on("group-left", ({ conversationId, userId }) => {
      const currentUser = useAuthStore.getState().user;
      if (userId.toString() === currentUser?._id.toString()) {
        // Người rời nhóm → remove conversation
        useChatStore.getState().removeConversation(conversationId);
      } else {
        // Thành viên còn lại → cập nhật participants
        useChatStore
          .getState()
          .removeMemberFromConversation(conversationId, userId);
      }
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
