'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'sonner'
// import { toast } from 'react-hot-toast'
import { Button } from './ui/button'
import Image from 'next/image'
import UnseenChatToast from './UnseenChatToast'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = (newFriend: User) => {
      console.log("new friend request", newFriend)
      setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

      if (!shouldNotify) return

      // should be notified
      const toastId = toast(
        <div className='flex items-center justify-between w-full'>
          <a className='flex gap-1 flex-1 items-center' href={`/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`} onClick={()=>toast.dismiss(toastId)}>
            <div className='relative size-10'>
              <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={message.senderImg}
                    alt={`${message.senderName} profile picture`}
                  />
            </div>
            <div className='ml-3 flex-1'>
              <p className='text-sm font-medium'>{message.senderName}</p>
              <p className='mt-1 text-sm text-muted-foreground'>{message.text}</p>
            </div>
          </a>
          <Button onClick={()=>toast.dismiss(toastId)}>Close</Button>
        </div>
      // , {
        // closeButton: true,
        // cancel: <Button>Close</Button>,
        // action: {
        //   label: <Button>Close</Button>,
        //   onClick: ()=>toast.dismiss(toastId)
        // },
        // action: {
        //   label: 'Undo',
        //   onClick: () => console.log('Undo')
        // },
        // cancel: <Button>Close</Button>,
        // unstyled: false,
      // }
    )

      // toast(
      //   <>
      //     <div>
      //       {message.senderName} {message.text}
      //     </div>
      //   </>
      //   , {
      //     closeButton: true,
      //     cancel: <Button>Close</Button>,
      //     unstyled: false,
      //   }
      // )

      // toast.custom((id)=> (
      //   <div className='flex gap-2'>
      //     <div className='inline-flex'>
      //       {message.senderName} {message.text}
      //     </div>
      //     <Button onClick={()=>toast.dismiss(id)}>
      //       Close
      //     </Button>
      //   </div>
      // ), {unstyled: false})
      // toast.custom((t) => (
      //   <UnseenChatToast
      //     ToastId={t}
      //     // t={t}
      //     sessionId={sessionId}
      //     senderId={message.senderId}
      //     senderImg={message.senderImg}
      //     senderMessage={message.text}
      //     senderName={message.senderName}
      //   />
      // ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_message', chatHandler)
      pusherClient.unbind('new_friend', newFriendHandler)
    }
  }, [pathname, sessionId, router])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        return (
          <li key={friend.id}>
            <Button asChild variant={"secondary"} size={"lg"} className="group justify-start gap-2 w-full px-4 hover:opacity-90">
              <a
                href={`/dashboard/chat/${chatHrefConstructor(
                  sessionId,
                  friend.id
                )}`}>
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={friend.image}
                    alt={`${friend.name} profile picture`}
                    className="rounded-full !size-6 !static"
                  />
                {friend.name}
                {unseenMessagesCount > 0 && (
                  <Button asChild size={"icon"} className='font-medium w-4 h-4 rounded-full justify-self-end ml-auto'>
                    <div>
                      {unseenMessagesCount}
                    </div>
                  </Button>
                )}
              </a>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList