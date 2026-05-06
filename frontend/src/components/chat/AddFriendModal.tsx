import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import { useFriendStore } from "@/store/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchFrom from "../addFriendModal/SearchFrom";
import SendFriendRequestForm from "../addFriendModal/SendFriendRequestForm";
export interface IFormValue {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User | null>(null);
  const [searchedUsername, setsearchedUsername] = useState<string>("");
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValue>({
    defaultValues: {
      username: "",
      message: "",
    },
  });

  const usernameValue = watch("username");
  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setsearchedUsername(username);

    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
        return;
      }
      setIsFound(false);
    } catch (error) {
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;
    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      if (message) {
        toast.success(message);
      }
      reset();
      handleCancel();
    } catch (error) {
      console.error("Lỗi xãy ra kkhi gửi request từ form, ", error);
    }
  });

  const handleCancel = () => {
    reset();
    setIsFound(null);
    // setSearchUser(null);
    setsearchedUsername("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex justify-center items-center size-5 rounded-full
         hover: bg-sidebar-accent cursor-pointer z-10"
        >
          <UserPlus className="size-4" />
          <span className="sr-only"> Kết bạn </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Kết bạn</DialogTitle>
          <DialogDescription></DialogDescription>
          {!isFound && (
            <>
              <SearchFrom
                register={register}
                errors={errors}
                loading={loading}
                usernameValue={usernameValue}
                isFound={isFound}
                searchedUsername={searchedUsername}
                onSubmit={handleSearch}
                onCancel={handleCancel}
              />
            </>
          )}
          {isFound && (
            <>
              <SendFriendRequestForm
                register={register}
                loading={loading}
                onSubmit={handleSend}
                searchedUsername={searchedUsername}
                onBack={() => setIsFound(null)}
              />
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
