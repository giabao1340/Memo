import { useFriendStore } from "@/store/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ReceivedRequests = () => {
  const { acceptRequest, declineRequest, loading, receivedList } =
    useFriendStore();
  if (!receivedList || receivedList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa có lời mời kết bạn nào.
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success("Bạn đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời kết bạn: ", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info("Bạn đã từ chối lời mời kết bạn.");
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời kết bạn: ", error);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {receivedList.map((req) => (
        <FriendRequestItem
          key={req._id}
          type="received"
          requestInfo={req}
          actions={
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleAccept(req._id)}
              >
                Chấp nhận
              </Button>
              <Button
                size="sm"
                variant="destructiveOutline"
                onClick={() => handleDecline(req._id)}
                disabled={loading}
              >
                Từ chối
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
