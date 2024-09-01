import React, { ChangeEvent, useState } from 'react'
import { Textarea } from './ui/textarea'

interface PostInputTextareaProps {
    inputValue: string
    setInputValue: (value:string)=>void
}

const PostInputTextarea = ({setInputValue, inputValue}: PostInputTextareaProps) => {

    
  return (
    <Textarea 
    className='no-scrollbar text-xl font-extralight text-gray-400 border-0 mt-2' 
    placeholder='What is happening?' 
    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {setInputValue(e.target.value)}} 
    value={inputValue}/>
  )
}

export default PostInputTextarea