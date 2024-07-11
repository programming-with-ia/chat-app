import { Skeleton } from '@/components/skeleton'
import { FC } from 'react'

const loading: FC<{}> = () => {
  return (
    <div className='w-full flex flex-col gap-3 pt-8'>
      <Skeleton className='mb-4' height={60} width={500} />
      <Skeleton height={20} width={150} />
      <Skeleton height={50} width={400} />
    </div>
  )
}
export default loading