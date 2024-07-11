"use client";
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

function SonnerTest() {
  return (
    <>
        <Button variant={"destructive"} onClick={()=> toast.error("thanks")}>error</Button>
        <Button variant={"destructive"} onClick={()=> toast.success("thanks")}>success</Button>
        <Button variant={"destructive"} onClick={()=> toast.info("thanks")}>info</Button>
        <Button variant={"destructive"} onClick={()=> toast.warning("thanks")}>warning</Button>
        <Button variant={"destructive"} onClick={()=> toast("thanks")}>show</Button>
        <Button variant={"destructive"} onClick={()=> toast.message("message")}>message</Button>
    </>
  )
}

export default SonnerTest