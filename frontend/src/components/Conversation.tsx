import api from '@/api'
import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

interface ConversatinTypes {
    id: number;
    created_at: string;
    user1:number;
    user2:number;
    setConversationId: ()=>void;
    setChatmate: (data:UserDataTypes)=>void;
  }

  interface UserDataTypes {
    username: string,
    email:string,
    user: number,
    avatar:string,
    baner:string,
    date:string,
    followership:number[],
    followers:number[],
    description: string
  }

const Conversation = ({id, user1, user2, setConversationId, setChatmate}:ConversatinTypes) => {

    const navigate = useNavigate()
    const { userData } = useAuth()
    const [ chatMateData, setChatMateData] = useState<UserDataTypes>()

  useEffect(() => {
      getChatmate()
  }, [userData])
  
  const getChatmate = async () => {
      try {
        if (userData) {
          const response = await api.get(`/api/accounts/id/${user1 == userData?.user? user2 : user1}`)
          console.log(user1 == userData?.user? user2 : user1)
          setChatMateData(response.data)
          setChatmate(response.data)
        }
          
      } catch (err) {
          console.log(err)
      }
  }

  const handleConversationOnClick = () => {
      navigate('/messages/'+id)
      setConversationId()
      getChatmate()
  }
    

  return (
    <div 
    className='flex mt-2 cursor-pointer hover:bg-gray-900 rounded-xl py-2'
    onClick={handleConversationOnClick}
    >
        <Avatar className='ml-7 mr-4'>
            <AvatarImage src={chatMateData?.avatar}/>
            <AvatarFallback><RxAvatar /></AvatarFallback>
        </Avatar>
        <h1>{chatMateData?.username}</h1>
    </div>
  )
}

export default Conversation