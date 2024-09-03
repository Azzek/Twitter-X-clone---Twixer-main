import React, { ChangeEvent, FormEvent, ReactNode, useRef, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import api from '@/api'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { CiImageOn } from 'react-icons/ci'

interface CommentDialogProps {
    children: ReactNode;
    postId:number
}

const CommentDialog: React.FC<CommentDialogProps> = ({ children, postId }) => {
  const [inputValue, setInputValue] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
  }
  }
    
  const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData();
    
      formData.append("body", inputValue);

      formData.append("parent", `${postId}`);
      
      if (file) {
        formData.append("image", file);
      }
      
      const res = await api.post('/api/posts/new-post/', formData)
      const result = res.data
      console.log(result)
      if (res.status < 200 || res.status > 299) {
      } else {
        setInputValue("")
      }
    } catch(error) {
      console.log(error)
    }
  };

  const handleFileInputChange = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click()
    }
  };
  
  return (
     <Dialog>
        <DialogTitle className='hidden'>
          xdd
        </DialogTitle>
        <DialogTrigger>
            { children }
        </DialogTrigger>
        <DialogContent>
            <div className='items-center w-full pt-4 px-4 self-center'>
                <form 
                onSubmit={onSubmit}                      
                className='space-y-6' 
                >
                    <div className='space-y-4'>
                    <Input placeholder='Whats up?' onChange={(e: ChangeEvent<HTMLInputElement>) => {setInputValue(e.target.value)}} value={inputValue}/>
                    <div className='flex justify-end'>
                        <div >
                            <Input accept="image/jpeg,image/png,image/webp" onChange={handleOnChange} className='hover:bg-slate-200 sr-only' name='image' type='file' ref={fileInputRef}/>
                            <Button variant='ghost' onClick={handleFileInputChange}>
                            <CiImageOn />
                            </Button>
                        </div>
                        <Button type='submit' variant='ghost' disabled={!(inputValue.length > 0)}>Post</Button>
                    </div>
                    </div>
                </form>
            </div>
                {file && (
                <img src={URL.createObjectURL(file)} alt="Preview" className='w-4/6 h-1/2 z-20 self-center rounded-3xl' />
                )}
        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog