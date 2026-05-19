import type { Conversation } from "@/types/chat";
import GroupChatAvatar from "./GroupChatAvatar";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  ChevronRight,
  TriangleAlert,
  UserRoundPlus,
  Users2,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";
import { Card } from "../ui/card";

const GroupChatDetails = ({ chat }: { chat: Conversation }) => {
  const { deleteConversation } = useChatStore();

  const handleLeaveGroup = async () => {
    try {
      await deleteConversation(chat._id);
      toast.success("Bạn đã rời nhóm ");
    } catch (error) {
      console.error("Lỗi khi rời nhóm:", error);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-4 justify-around items-center p-4">
        <GroupChatAvatar participants={chat.participants} type="detail" />
        <h2 className="font-semibold text-foreground text-2xl">
          {chat.group.name}
        </h2>
        <p className="text-sm text-muted-foreground">{chat.createdAt}</p>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Thành viên">
                <Users2 />
                <span>Thành viên</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 beautiful-scroll-bar">
                  {chat.participants.map((p) => (
                    <SidebarMenuSubItem key={p._id}>
                      <Card className="w-full border-none bg-sidebar hover:bg-sidebar-accent/60 transition-all duration-200 shadow-none rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between">
                          {/* Left Content */}
                          <div className="flex items-center gap-3 min-w-0">
                            <GroupChatAvatar participants={[p]} type="chat" />

                            <span className="text-sm font-medium text-sidebar-foreground truncate">
                              {p.displayName}
                            </span>
                          </div>

                          {/* Action Icon */}
                          <button
                            className="
                  flex items-center justify-center
                  w-9 h-9 rounded-full
                  bg-muted/60 hover:bg-primary
                  text-muted-foreground hover:text-white
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  shadow-sm
                "
                          >
                            <UserRoundPlus size={18} strokeWidth={2.2} />
                          </button>
                        </div>
                      </Card>
                    </SidebarMenuSubItem>
                  ))}
                </div>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLeaveGroup}
        >
          <TriangleAlert className="mr-2" /> Rời nhóm
        </Button>
      </div>
    </div>
  );
};

export default GroupChatDetails;
