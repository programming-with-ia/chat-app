"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react";
import { LoadingButton } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ className, ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <LoadingButton
      {...props}
      isLoading={isSigningOut}
      className={cn("rounded-full", className)}
      title="Sign Out"
      aria-label="Sign Out"
      icon={<LogOut className="w-4 h-4" />}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
    ></LoadingButton>
  );
};

export default SignOutButton;
