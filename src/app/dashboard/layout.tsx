import { Icon, Icons } from "@/components/Icons";
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from "@/lib/auth";
import { getServerSession, type Session } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { SidebarOption } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Link } from "@lexz451/next-nprogress";
import { orUndefined } from "@/lib/utils";
import SidebarChatList from '@/components/SidebarChatList'
import MobileChatLayout from '@/components/MobileChatLayout'
import MobileChatSheetLayout from "@/components/MobileMenu";
import NavCompos from "@/components/NavCompos";
interface LayoutProps {
  children: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const friends = await getFriendsByUserId(session.user.id);
  console.log("friends", friends);

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      <div className='md:hidden'>
        <MobileChatSheetLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
        {/* <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        /> */}
      </div>

      <div className="hidden md:flex w-96 h-full flex-col gap-y-5 overflow-y-auto border-r bg-card">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center px-6">
          <Icons.Logo className="h-8 w-auto text-info-foreground" />
        </Link>

        <NavCompos session={session} sidebarOptions={sidebarOptions} friends={friends} unseenRequestCount={unseenRequestCount} />
        {/* <hr className="" /> */}
        <div key={"profile"} className="flex items-center justify-start p-2 border-t gap-2">
          {/* <div className="flex items-center gap-x-4 text-sm font-semibold leading-6"> */}
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
                >{session.user.name}</span>
              <span
                className="text-xs text-muted-foreground truncate"
                title={orUndefined(session.user.email)}
                aria-label={orUndefined(session.user.email)}
                aria-hidden="true"
              >
                {session.user.email}
              </span>
            </div>
          {/* </div> */}
          <SignOutButton className='h-full aspect-square flex-shrink-0 ml-auto' />
        </div>
      </div>

      <aside className="max-h-screen container pt-16 md:pt-0 w-full">
        {children}
      </aside>
    </div>
  );
};

export default Layout;
