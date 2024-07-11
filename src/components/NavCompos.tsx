import React from 'react'
import SidebarChatList from './SidebarChatList';
import { Button } from './ui/button';
import { Link } from '@lexz451/next-nprogress';
import FriendRequestSidebarOptions from './FriendRequestSidebarOptions';
import { SessionType, SidebarOption } from '@/types/types';
import { Icons } from './Icons';
import { type Session } from "next-auth";
function NavCompos({friends, sidebarOptions, session, unseenRequestCount}:{friends:User[], unseenRequestCount:number, session:Session, sidebarOptions:SidebarOption[]}) {
  return (
    <>
            {friends.length > 0 && (
          <div className="text-xs font-semibold leading-6 text-muted-foreground px-6">
            Your chats
          </div>
        )}

        <nav className="flex flex-1 flex-col px-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-muted-foreground">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Button
                        asChild
                        variant={"secondary"}
                        size={"lg"}
                        className="group justify-start gap-2 w-full px-4 hover:opacity-90 transition-all"
                      >
                        <Link href={option.href}>
                          <Icon className="h-6 w-6 group-hover:scale-110 transition" />
                          {/* <span className='text-muted-foreground group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium'>
                        </span> */}

                          <span className="truncate group-hover:translate-x-1 transition">{option.name}</span>
                        </Link>
                      </Button>
                    </li>
                  );
                })}

                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

          </ul>
        </nav>
    </>
  )
}

export default NavCompos