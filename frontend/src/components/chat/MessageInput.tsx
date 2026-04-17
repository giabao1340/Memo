import { useAuthStore } from "@/store/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  // Thêm state preview URLs
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cập nhật handleFileChange
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    console.log(
      "📁 Files đã chọn:",
      files.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)}KB`,
        type: f.type,
      })),
    );
    // Tạo preview URLs
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  // Xóa 1 ảnh khỏi preview
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]); // Giải phóng memory
      return prev.filter((_, i) => i !== index);
    });
  };
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim() && !selectedFiles.length) return;
    const currValue = value;
    const currFiles = selectedFiles;
    setValue("");
    setSelectedFiles([]);
    setPreviewUrls([]);

    try {
      if (selectedConvo.type === "direct") {
        const otherUser = selectedConvo.participants.filter(
          (p) => p._id !== user._id,
        )[0];
        await sendDirectMessage(otherUser._id, currValue, currFiles);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue, currFiles);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-background">
      {previewUrls.length > 0 && (
        <div className="flex gap-2 px-3 pt-3 flex-wrap">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`preview-${index}`}
                className="size-16 object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-destructive 
                         text-white text-xs flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 p-3  bg-background">
        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth"
          onClick={handleOpenFile}
        >
          <ImagePlus className="size-4" />
        </Button>

        <div className="flex-1 relative">
          <Input
            onKeyPress={handleKeyPress}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Soạn tin nhắn..."
            className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
          ></Input>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-primary/10 transition-smooth"
            >
              <div>
                <EmojiPicker
                  onChange={(emoji: string) => setValue(`${value}${emoji}`)}
                />
              </div>
            </Button>
          </div>
        </div>

        <Button
          onClick={sendMessage}
          className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
          // disabled={!value.trim()}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
