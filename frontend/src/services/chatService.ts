import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;
export const chatService = {
  async fetchConversatons(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    console.log("RAW API:", res.data);
    return res.data;
  },

  async fechMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const res = await api.get(
      `/conversations/${id}/messages?/limit=${pageLimit}&cursor=${cursor}`,
    );
    return {messages: res.data.messages, cursor: res.data.nextCursor}
  },
};
