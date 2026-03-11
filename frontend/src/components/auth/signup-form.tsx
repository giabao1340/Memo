import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
const SignupFormSchema = z
  .object({
    firstName: z.string().min(1, "Họ tên không được để trống"),
    lastName: z.string().min(1, "Họ tên không được để trống"),
    username: z
      .string()
      .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
      .max(20, "Tên người dùng không được vượt quá 20 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới",
      ),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?  &])[A-Za-z\d@$!%*?&]+$/,
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt",
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof SignupFormSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { username, password, email, firstName, lastName } = data;
    await signUp(username, password, email, firstName, lastName);
    navigate("/signin");
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
                    Chào mừng bạn đến với{" "}
                    <span className="text-primary">Memo</span> hãy đăng ký để
                    bắt đầu
                  </p>
                </h1>
              </div>
              {/* Ho ten */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm">
                    Họ tên
                  </Label>
                  <Input
                    id="firstname"
                    placeholder="Họ"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-sm">
                    Tên
                  </Label>
                  <Input
                    id="lastname"
                    placeholder="Tên"
                    {...register("lastName")}
                  />

                  {errors.lastName && (
                    <p className="text-red-500 text-xs">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
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
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="memo@gmail.com"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
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
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  type="password"
                  {...register("confirmPassword")}
                />
                {/* error massage */}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {/* Button submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Đăng ký
              </Button>
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a
                  href="/signin"
                  className="text-primary underline underline-offset-4"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
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
