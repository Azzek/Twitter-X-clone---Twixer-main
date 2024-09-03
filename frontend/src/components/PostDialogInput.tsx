import { ChangeEvent, useState, FormEvent, useRef} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CiImageOn } from "react-icons/ci"
import api from '@/api'
import { ACCES_TOKEN } from '@/constans'
import { useAuth } from './AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import { Textarea } from './ui/textarea'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { RiQuillPenLine } from "react-icons/ri";

  const PostDialogInput = () => {
  const [inputValue, setInputValue] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userData } = useAuth()
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

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
      
      if (file) {
        formData.append("image", file);
      }
      
      const token = localStorage.getItem(ACCES_TOKEN)
      const res = await api.post('/api/posts/new-post/',formData, { 
        
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      const result = res.data
      setInputValue("")
      setFile(null)
    } catch(error) {
      console.log(error)
    }
  };

  const handleFileInputChange = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click()
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue(inputValue + emojiData.emoji);
    setShowEmojiPicker(false);
  };
    
  return (
      <Dialog>
        <DialogTrigger>
          <span className='bg-blue-400 px-12 py-3 rounded-3xl w-[50%] hidden lg:flex justify-center'>
            Post
          </span>
          <RiQuillPenLine className='bg-blue-400 h-11  rounded-full p-3 ml-2 lg:hidden w-11'/>
        </DialogTrigger>
        <DialogContent>
          <div className='pt-4 px-4 flex  w-full h-full'>
            <div className='h-full'>
                <Link className="h-full" to={`/${userData?.username}/`}>
                    <Avatar className="w-12 h-12 ml-2 mt-2">
                        <AvatarImage src={userData?.avatar || ''} />
                        <AvatarFallback>
                            <FaUserCircle />
                        </AvatarFallback>
                    </Avatar>
                </Link>
              </div>
            <form 
            onSubmit={onSubmit}                      
            className='space-y-6 w-full items-end flex flex-col' 
            >
              <div className=' w-full h-full'>
                <div className='items-end'>
                  <Textarea className='no-scrollbar text-xl font-extralight text-gray-400 border-0 mt-2' 
                  placeholder='What is happening?'
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {setInputValue(e.target.value)}} value={inputValue}
                  />
                  {file && (
                  <img src={URL.createObjectURL(file)} alt="Preview" className='w-4/6 h-1/2 rounded-3xl' />
                  )}
                </div>
                <div className='flex justify-end'>
                  <Button type='button' variant='ghost' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <BsEmojiSmile />
                  </Button>
                  {showEmojiPicker && (
                    <div className='absolute z-10 emoji-picker-react'>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                    <div >
                      <Input 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handleOnChange} 
                        className='hover:bg-slate-200 sr-only' 
                        name='image' 
                        type='file' 
                        ref={fileInputRef}
                      />
                      <Button type='button' variant='ghost' onClick={handleFileInputChange}>
                        <CiImageOn />
                      </Button>
                    </div>
                    <DialogFooter>
                      <DialogClose type='submit'  disabled={!(inputValue.length > 0)}>
                        Post
                      </DialogClose>
                    </DialogFooter>
                    
                
                </div>           
              </div>
            </form>         
          </div>
        </DialogContent>
        
      </Dialog>
    )
  }

  export default PostDialogInput