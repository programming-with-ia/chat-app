"use client";

// import { Transition, Dialog } from '@headlessui/react'
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { FC, Fragment, useEffect, useState } from "react";
import { Icons } from "./Icons";
import SignOutButton from "./SignOutButton";
import { Session } from "next-auth";
import { SidebarOption } from "@/types/types";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { Link } from "@lexz451/next-nprogress";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "./ui/sheet";
import { orUndefined } from "@/lib/utils";
import NavCompos from "./NavCompos";

interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
}

const MobileChatSheetLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  sidebarOptions,
  unseenRequestCount,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed bg-secondary border-b top-0 right-0 left-0 py-2 px-4">
      <div className="w-full flex justify-between items-center">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          <Icons.Logo className="h-6 w-auto" />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} className="h-auto w-auto p-2">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"}>
            <SheetHeader className="flex-row items-center">
              <SheetTitle>Dashboard</SheetTitle>
              <SheetClose asChild>
                <Button
                  className="ml-auto"
                  variant={"ghost"}
                  size={"icon"}
                  type="button"
                >
                  <span className="sr-only">Close panel</span>
                  <X className="size-6" aria-hidden="true" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="mt-4 flex-1 -mx-2">
              {/* Content */}

              <NavCompos
                session={session}
                friends={friends}
                sidebarOptions={sidebarOptions}
                unseenRequestCount={unseenRequestCount}
              />
              <SheetFooter
                key={"profile"}
                className="flex items-center justify-start border-t gap-2 absolute bottom-0 right-0 left-0 py-2 px-6"
              >
                <div className="relative min-h-8 min-w-8">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col min-w-0">
                  <span
                    aria-hidden="true"
                    title={orUndefined(session.user.name)}
                    aria-label={orUndefined(session.user.name)}
                  >
                    {session.user.name}
                  </span>
                  <span
                    className="text-xs text-muted-foreground truncate"
                    title={orUndefined(session.user.email)}
                    aria-label={orUndefined(session.user.email)}
                    aria-hidden="true"
                  >
                    {session.user.email}
                  </span>
                </div>
                <SignOutButton className="h-full aspect-square flex-shrink-0 ml-auto" />
              </SheetFooter>
              {/* content end */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileChatSheetLayout;
