import { Skeleton } from '@/components/skeleton'
import { FC } from 'react'

const loading: FC<{}> = () => {
  return (
    <div className='w-full flex flex-col gap-3'>
      <Skeleton className='mb-4' height={60} width={500} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
    </div>
  )
}

export default loading