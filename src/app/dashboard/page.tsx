import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

async function Page() {
  const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <pre>{JSON.stringify(session)}</pre>
  )
}

export default Page