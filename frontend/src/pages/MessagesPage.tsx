import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useAsyncValue, useParams } from 'react-router-dom'
import PagesLayout from '../PagesLayout'
import Navbar from '@/components/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CiImageOn, CiSearch } from 'react-icons/ci';
import { Input } from '@/components/ui/input';
import api from '@/api';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/components/AuthProvider';
import { MdOutlineUnsubscribe } from 'react-icons/md';
import Conversation from '@/components/Conversation';
import { get } from 'http';
import { IoSend } from 'react-icons/io5';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { BsEmojiSmile } from 'react-icons/bs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RxAvatar } from 'react-icons/rx';
import { format, formatDate, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"

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

  interface ConversationTypes {
    id: number;
    created_at: string;
    user1:number;
    user2:number;
  }

  interface Message {
    id: number;
    conversation: number;
    sender: number;
    text: string;
    timestamp: string;
    image:string;
  }

const MessagesPage = () => {
    const { chatId } = useParams()
    const [ messages, setMessages ] = useState<Message[]>()
    const [ message, setMessage ] = useState('')
    const [ query, setQuery ] = useState<string>('');
    const [ results, setResults ] = useState<UserDataTypes[]>([]);
    const [ inputFocus, setInputFocus ] = useState<boolean>(false)
    const [ conversations, setConversations ] = useState<ConversationTypes[]>()
    const [ conversationId, setConversationId ] = useState<number>()
    const [ chatmeteData, setChatmateData ] = useState<UserDataTypes>()
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { userData } = useAuth()
    const chatSocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        getConversationList()
        getMessagesList()
        if (chatId) {
            chatSocket.current = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);

            chatSocket.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                getMessagesList();
                console.log(data.message);
            };

            chatSocket.current.onclose = () => {
                console.error('Chat socket closed unexpectedly');
            };
        }
        
    
        // return () => {
        //     chatSocket.close();
        // };
        

    },[chatId])
    
    

   
    const onSubmit = async () => {
        if (chatSocket.current) {
            chatSocket.current.send(JSON.stringify({ message }));
            console.log('senjdedednedneed')
        }
        try { 
             
            const formData = new FormData()
            if (chatId && userData?.user) {
                formData.append('sender',userData?.user.toString() )
                formData.append("conversation",chatId)
                formData.append('text',message,)
                if (file) {
                    formData.append('image', file)
                }
            }
    
            const response = await api.post('/api/messages/send/', formData) 
            console.log(response)
        } catch(err) {
            console.log(err)
        }
        setMessage('')
        setFile(null)
    }

    
    const createConversation = async (id:number) => {
        try {
            const response = await api.post('/api/messages/conversation/', {
                user2: id,
                user1:userData?.user
            });
            setInputFocus(!inputFocus)
            getConversationList()
        } catch (err) {
            console.log(err)
        }
    };

    const getConversationList = async () => {
        const data = await fetchApiData('/api/messages/conversation/list/');
        if (data) setConversations(data);
    };
    
    const getMessagesList = async () => {
        if (chatId) {
            const data = await fetchApiData('/api/messages/conversation/messages/', 'GET', { params: { conversation: chatId } });
            if (data) setMessages(data);
        }
    };

    const fetchApiData = async (url: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
        try {
            const response = method === 'GET'
                ? await api.get(url, data)
                : await api.post(url, data);
            return response.data;
        } catch (err) {
            console.error(`Error fetching data from ${url}`, err);
            return null;
        }
    };


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
        }
    }

    const handleSearch = useCallback(async () => {
        const data = await fetchApiData(`/api/accounts/search/?search=${query}`);
        if (data) setResults(data);
    }, [query]);
    
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        handleSearch();
    }, [handleSearch]);
    
    const handleMessageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }, []);
    
    const handleFileInputChange = useCallback(() => {
        fileInputRef.current?.click();
    }, []);
    
    const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    }, [])

    const isAlreadyInConversations = (id: number): boolean => {
        return conversations?.some((c) => id === c.user1 || id === c.user2) || false;
    };

    const formatDate = (date:string) => {
        const dt = chatmeteData?.date ? new Date(chatmeteData?.date) : null;
        return dt ? format(dt, 'MMMM yyyy', { locale: enUS }) : 'Invalid date';
    }

  return (
        <div className='w-screen h-screen max-h-screen flex max-w-screen'>
        <Navbar/>
        <div className='w-3/12 sm:mr-12 sm:mt-16 lg:mt-2 ml-[32%] z-50'>
            <div>
                <div className='pl-4 text-lg'>
                    <h1 className='font-bold text-white'>Messages</h1>
                </div>
                {
                    inputFocus &&
                    <Button variant={'ghost'} onClick={() => setInputFocus(!inputFocus)}>
                        <IoMdArrowRoundBack className='h-12 w-12 opacity-85 mr-10'/>
                    </Button>
                }
                <div className={`${inputFocus ? 'border-2 border-blue-500' : 'border-0'} flex xl:pr-6 md:pr-0 pl-6 bg-gray-900 rounded-2xl py-1 self-center mt-2 w-full`}>
                    <CiSearch className={`${inputFocus ? 'text-blue-500' : 'border-0'} h-9 w-9 self-start`} />
                    <Input onFocus={() => setInputFocus(true)}  onChange={handleChange} className="focus:outline-none border-transparent"/>
                    {/* onBlur={() => setInputFocus(false)} */}
                </div>
                    {   inputFocus?
                        query.length > 0 ?
                        results.map((user) => (
                                <div 
                                    key={user.user} 
                                    onClick={() => createConversation(user.user)} 
                                    className='cursor-pointer flex'
                                >
                                    <div className="flex pl-5">
                                        {/* <Link to={`/${user.username}`} key={user.user}> */}
                                        <Avatar>
                                            <AvatarImage src={user.avatar} alt="user avatar" className="flex w-12 h-12 rounded-full bg-muted self-end mt-3"/>
                                            <AvatarFallback><FaUserCircle className="flex w-12 h-12 rounded-full bg-muted self-end mt-3"/></AvatarFallback>
                                        </Avatar>
                                        {/* </Link> */}
                                    </div> 
                                    <div className="pt-1 pl-4 flex flex-col">
                                        <span className='mt-1 text-lg font-bold'>
                                            {user.username}
                                        </span>
                                        <span className="font-thin text-gray-400">
                                            {user.description.substring(0, 20)}
                                        </span> 
                                    </div>
                                </div>
                        ))
                        :
                        <p>Try searching for peoplee</p>
                    :
                    <div>
                        {
                            conversations && conversations.map((c) => (
                                <div className={`${c.id.toString() == chatId? 'bg-gray-800' : ''} rounded-2xl`}>
                                    <Conversation
                                        id={c.id} 
                                        user1={c.user1} 
                                        user2={c.user2} 
                                        key={c.id}
                                        created_at={c.created_at}
                                        setConversationId={()=>setConversationId(c.id)}
                                        setChatmate={(data:UserDataTypes)=>setChatmateData(data)}
                                    />
                                </div>
                                
                            ))
                        }
                    </div>
        
                    }
            </div>
        </div>
        <div className='h-screen justify-between flex-col items-center w-2/5 hidden lg:flex flex-shrink-0'>
            <div className='w-[50%] max-h-screen'>
                <div className='h-[90vh]'>
                    <ScrollArea className='h-[90%] flex flex-col space-y-2'>
                        { chatmeteData && chatId? 
                            <div className='w-full hover:bg-gray-800 h-40 flex justify-center flex-col items-center'>
                            <Avatar className='h-28 w-28'>
                                    <AvatarImage src={chatmeteData?.avatar} className='rounded-full'/>
                                    <AvatarFallback><RxAvatar className='w-28 h-28'/></AvatarFallback>
                                </Avatar> 
                                <span>{chatmeteData?.username}</span>
                                <span>{ formatDate(chatmeteData.date) } | {chatmeteData?.followers.length} Follows</span>
                            </div>
                            : 
                            <div className='mt-[50%]'>
                                <h1 className='text-3xl text-white'>Select a message</h1> 
                                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                            </div>
                            }
                            {messages?.map((m) => (
                                <div>
                                    <div className={`flex ${m.sender == userData?.user ? 'justify-end' : 'justify-start'}`} key={m.id}>
                                        <div className={`max-w-xs break-words p-2 my-1 rounded-3xl ${m.sender == userData?.user ? 'bg-blue-500 rounded-br-none mr-5' : 'bg-gray-800 rounded-bl-none'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                    <span className={`flex ${m.sender == userData?.user ? 'justify-end' : 'justify-start'} text-xs text-gray-500 mr-5`}>
                                        {chatmeteData && formatDistanceToNow (new Date(m.timestamp), { addSuffix: true })}
                                    </span>
                                    <Dialog>
                                        <DialogTrigger>
                                            {m.image && <img src={'http://127.0.0.1:8000' + m.image} className='rounded-xl mt-2 w-[50%] block' />}
                                        </DialogTrigger>
                                        <DialogContent>
                                            {m.image && <img src={'http://127.0.0.1:8000' + m.image} className='rounded-xl mt-2 w-[50%] block h-full' />}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                
                            ))}
                    </ScrollArea>
                </div>
                
                {file && (
                <img src={URL.createObjectURL(file)} alt="Preview" className='w-4/6 h-1/2 rounded-3xl mt-2' />
                )}
                <div className='flex justify-between pr-3 pl-6 bg-gray-800 rounded-2xl py-1 mt-2 self-end'>
                    <Input 
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleOnChange} 
                        className='hidden' 
                        name='image' 
                        type='file' 
                        ref={fileInputRef}
                    />
                    <Button type='button' variant='ghost' onClick={handleFileInputChange}>
                        <CiImageOn />
                    </Button>
                    <Button variant='ghost' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <BsEmojiSmile className='w-6 h-6' />
                    </Button>
                    {showEmojiPicker && (
                        <div className='absolute z-10 bottom-12'>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <Input onChange={handleMessageChange} value={message} className="focus:outline-none border-transparent w-full px-2"/>
                    <IoSend className='w-8 h-8 cursor-pointer hover:text-gray-600' onClick={()=>onSubmit()} />
                </div>
            </div>
        </div>

        
    </div>
  )
}

export default MessagesPage