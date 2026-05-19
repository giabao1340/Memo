import api from "@/lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/users/uploadAvatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }, // Đảm bảo rằng header được đặt đúng để gửi FormData
    });
    if (res.status === 400) {
      throw new Error(res.data.message || "Failed to upload avatar");
    }
    return res.data;
  },
};
