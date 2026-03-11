import { SignupForm } from "@/components/auth/signup-form";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 justify-center md:p-10 z-0 absolute inset-0 bg-gradient-purple">
      <div className="w-fullmax-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
