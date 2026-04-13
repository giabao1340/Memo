import api from "axios";

export const friendService = {
    async searchUserByUsername (username: string) {
        const res = await api.get(`/users/rearch?username=${username}`);
        return res.data.user;
    },

    async senFriendRequest(to: string, message?: string) {
        const res = await api.post("/friends/requests", {to, message});
        return res.data.message;
    }
}