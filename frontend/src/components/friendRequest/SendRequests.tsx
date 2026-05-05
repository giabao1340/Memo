import { useFriendStore } from "@/store/useFriendStore";
import React from "react";
import FriendRequestItem from "./FriendRequestItem";

const SendRequests = () => {
  const { sentList } = useFriendStore();
  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào.
      </p>
    );
  }
  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            actions={
              <p className="text-muted-foreground text-sm">
                Đang chờ trả lời...
              </p>
            }
            type="sent"
          />
        ))}
      </>
    </div>
  );
};

export default SendRequests;
