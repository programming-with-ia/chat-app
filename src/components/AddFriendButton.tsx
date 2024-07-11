'use client'

import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { FC, useState } from 'react'
import {Button} from './ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner'

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (formData:FormData) => {
    try {
      const validatedEmail = addFriendValidator.parse(formData)

      await axios.post('/api/friends/add', {
        email: validatedEmail,
      })

      setShowSuccessState(true)
      return "Friend request sent."
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        throw new Error('email: '+ error.message)
        return
      }
      
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        throw new Error('email: '+ error.response?.data)
        return
      }
      
      setError('email', { message: 'Something went wrong.' })
      console.error("!Add Friend", error)
      throw new Error('Something went wrong.')
    }
  }
  // toast.promise(addFriend({email:""}))

//   const onSubmit = (data: FormData) => {
//     addFriend(data)
//   }

  return (
    <form 
        onSubmit={handleSubmit((data:FormData)=>toast.promise(addFriend(data), {loading: "Loading...", success: resp=>resp, error: error=>error.message}))} 
        >
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-card-foreground'>
        Add friend by E-Mail
      </label>

      <div className='mt-2 flex gap-4'>
        <Input
          {...register('email')}
          className='max-w-xs'
          type='text'
          placeholder='you@example.com'
        />
        <Button type='submit'>Add</Button>
      </div>
      {/* {errors.email && <p className='max-w-full mt-1 text-sm text-destructive-foreground truncate'>{errors.email.message}</p>}
      {!errors.email && showSuccessState && <p className='mt-1 text-sm text-success-foreground'>Friend request sent.</p>} */}
    </form>
  )
}

export default AddFriendButton