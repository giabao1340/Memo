import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValue } from "../chat/AddFriendModal";
import type React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValue>;
  errors: FieldErrors<IFormValue>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchFrom = ({
  register,
  errors,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          Tìm bằng username
        </Label>
        <Input
          id="username"
          placeholder="Gõ tên username người bạn cần tìm"
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          {...register("username", {
            required: "Username không được bỏ trống",
          })}
        ></Input>
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}
        {isFound === false && (
          <span className="error-massage">
            Không tìm thấy
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 goass hover:text-destructive"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
        >
          {loading ? (
            <span>Đang tìm ...</span>
          ) : (
            <>
              {" "}
              <Search className="size-4 mr-2" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchFrom;
