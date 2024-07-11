import { db } from "@/lib/db"
//!! create a new function getUserById `user:\$\{.+\}`

const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
  console.log(commandUrl, 'commandUrl')
  // let commandFunc = db[command]
  // console.log(args.join('/'), command)
  // console.log(await commandFunc(args.join('/')))
  
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })

  // console.log("response.status", response.status)

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }
  // console.log("response", response)
  const data = await response.json()
  // console.log("data", data)
  return data.result
}