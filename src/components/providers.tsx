'use client'

import { FC, ReactNode } from 'react'
import { Toaster as ToasterCN } from "@/components/ui/sonner"

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ToasterCN duration={100000} />
      {/* <Toaster position='top-center' reverseOrder={false} /> */}
      {children}
    </>
  )
}

export default Providers