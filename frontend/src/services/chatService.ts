import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

export const chatService = {
  async fetchConversatons(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    console.log("RAW API:", res.data);
    return res.data;
  },
};
