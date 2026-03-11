import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router";
const SigninFormSchema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SignUpFormValues = z.infer<typeof SigninFormSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SigninFormSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    // Gọi API từ phía backend
    const { username, password } = data;
    await signIn(username, password);
    navigate("/");
  };
  return (
    <div className={cn("flex flex-col gap-6 mt-10 ", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              {/* Header logo */}
              <div className="flex flex-col-items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl front-bold">
                  <p className="txt-mute-foreground txt-balance">
                    Chào mừng quay lại{" "}
                    <span className="text-primary">Memo</span> Đăng nhập vào tài
                    khoản của bạn
                  </p>
                </h1>
              </div>
              {/* User Name */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">
                  Tên người dùng
                </Label>
                <Input
                  id="username"
                  placeholder="Memo"
                  {...register("username")}
                />
                {/* error massage */}
                {errors.username && (
                  <p className="text-red-500 text-xs">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  placeholder="Mật khẩu"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Đăng nhập
              </Button>
              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a
                  href="/signup"
                  className="text-primary underline underline-offset-4"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover scale-80"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs px-6 text-center *[a]:text-mute-foreground *[a]:underline *[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
