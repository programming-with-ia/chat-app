import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { Link } from '@lexz451/next-nprogress'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )

  return (
    <div className='container py-12'>
      <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <Link
            href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id )}`}
            key={friend.id}
            className='bg-card border border-border/50 transition shadow-md hover:shadow-xl hover:border-border px-5 py-3 rounded-md flex gap-3 items-center group'>
              <div className='relative size-10'>
                <Image
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                  alt={`${friend.name} profile picture`}
                  src={friend.image}
                  fill
                />
              </div>
              <div className='min-w-0'>
                <p className='text-lg font-semibold truncate'>{friend.name}</p>
                <p className='text-muted-foreground truncate'>
                  {friend.lastMessage.senderId === session.user.id && 'You: '}{friend.lastMessage.text}
                </p>
              </div>
            <ChevronRight className='h-7 w-7 text-muted-foreground ml-auto transition group-hover:translate-x-1' />
          </Link>
        ))
      )}
      {/* <pre className='overflow-scroll max-w-sm absolute bottom-0 right-0 rounded-lg border-2'>{JSON.stringify(session)}</pre> */}
    </div>
  )
}

export default page