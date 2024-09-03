import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmile } from 'react-icons/bs';
import api from '@/api';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import './ReplyPostComponent.css';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

interface ReplyPostComponentProps {
  postId: number;
}

const ReplyPostComponent: React.FC<ReplyPostComponentProps> = ({ postId }) => {

  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userData } = useAuth()

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("body", inputValue);
      formData.append("parent", `${postId}`);
      if (file) {
        formData.append("image", file);
      }
      const res = await api.post('/api/posts/new-post/', formData);
      if (res.status >= 200 && res.status < 300) {
        setInputValue('');
        setFile(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileInputChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue(inputValue + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <div className='items-center w-full self-center flex'>
        <Link className="h-full items-start" to={`/${userData?.username}/`}>
            <Avatar className="w-12 h-12 mb-5">
                <AvatarImage src={userData?.avatar || ''} />
                <AvatarFallback>
                        <FaUserCircle />
                </AvatarFallback>
            </Avatar>
        </Link>
        <form onSubmit={onSubmit} className=' w-full pt-3 pl-3'>
          <div>
            <Input
                className='border-0'
                placeholder='Whats up?'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                value={inputValue}
            />
            <div className='flex justify-end pt-2'>
              <div className='flex items-center'>
                <Button variant='ghost' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <BsEmojiSmile />
                </Button>
                {showEmojiPicker && (
                  <div className='absolute z-10 emoji-picker-react'>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <Input
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleOnChange}
                  className='hover:bg-slate-200 sr-only'
                  name='image'
                  type='file'
                  ref={fileInputRef}
                />
                <Button variant='ghost' onClick={handleFileInputChange}>
                  <CiImageOn />
                </Button>
              </div>
              <Button type='submit' variant='ghost' disabled={inputValue.length === 0}>
                Post
              </Button>
            </div>
          </div>
        </form>
      </div>
      {file && (
        <img src={URL.createObjectURL(file)} alt="Preview" className='w-4/6 h-1/2 z-20 self-center rounded-3xl' />
      )}
    </>
  );
};

export default ReplyPostComponent;
