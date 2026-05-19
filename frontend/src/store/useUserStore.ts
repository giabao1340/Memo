import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create<UserState>((set, get) => ({
    updateAvatarUrl: async (formData) => {
        try {
            const {user, setUser} = useAuthStore.getState();
            const data = await userService.uploadAvatar(formData);
            if(user) {
                setUser({
                    ...user,
                    avatarUrl: data.avatarUrl,
                })
            }
        } catch (error) {
            console.error("Failed to update avatar URL:", error);
        }
    }
}))