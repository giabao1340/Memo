import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
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
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  loading: boolean;
  searchByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
}
