import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  clearState: () => void;
  signUp: (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
  setAccessToken: (accessToken: string) => void;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  loading: boolean;
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll
      nextCursor?: string | null; // phân trang
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    recipientId: string,
    content: string,
    files?: File[],
    conversationId?: string,
  ) => Promise<void>;

  sendGroupMessage: (
    conversationId: string,
    content: string,
    files?: File[],
  ) => Promise<void>;

  // add message
  addMessage: (message: Message) => Promise<void>;
  // delete message
  deleteMessage: (messageId: string) => Promise<void>;
  // 👇 định nghĩa ở đây
  removeMessageRealtime: (messageId: string, conversationId: string) => void;
  // update conversation
  updateConversation: (conversation: any) => void;
  markAsSeen: () => Promise<void>;
  addConvo: (convo: Conversation) => void;
  createConversation: (
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
  updateConversationMembers: (conversation: Conversation) => void;
  addGroupMembers: (
    conversationId: string,
    memberIds: string[],
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  leaveGroup: (conversationId: string) => Promise<void>;
  removeConversation: (conversationId: string) => void;
  removeMemberFromConversation: (
    conversationId: string,
    userId: string,
  ) => void;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  friends: Friend[];
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequest: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
}
