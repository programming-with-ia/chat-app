'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Link } from '@lexz451/next-nprogress'

interface FriendRequestSidebarOptionsProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    pusherClient.bind('new_friend', addedFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_friend', addedFriendHandler)
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [sessionId])

  return (
    <Button
    asChild
    variant={"secondary"}
    size={"lg"}
    className="group justify-start gap-2 w-full px-4 hover:opacity-90 transition-all"
    >
    <Link
      href='/dashboard/requests'
    //   className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
      >
        <User className='h-6 w-6 group-hover:scale-110 transition' />
      {/* <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
      </div> */}
      <span className='truncate group-hover:translate-x-1'>Friend requests</span>

      {unseenRequestCount > 0 && (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-primary-foreground bg-primary ml-auto'>
          {unseenRequestCount}
        </div>
      )}
    </Link>
    </Button>
  )
}

export default FriendRequestSidebarOptions