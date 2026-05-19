import React, { useRef } from "react";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/useUserStore";
import { Camera } from "lucide-react";

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatarUrl } = useUserStore();

  const handleClick = () => {
    fileInputRef.current?.click(); // Mở hộp thoại chọn file khi nhấn vào nút
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData(); // Tạo một đối tượng FormData để gửi file
    formData.append("file", file); // Thêm file vào FormData với key "avatar"

    await updateAvatarUrl(formData); // Gọi hàm cập nhật avatar trong store
  };
  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        onClick={handleClick}
        className="absolute top-18 left-17 size-8 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-background"
      >
        <Camera />
      </Button>
      <input type="file" hidden ref={fileInputRef} onChange={handleUpload} />
    </>
  );
};

export default AvatarUploader;
