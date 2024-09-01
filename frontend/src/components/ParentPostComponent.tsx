import api from '@/api'
import { BiRepost } from "react-icons/bi";
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,         
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
import CommentDialog from './ReplyDialog';
import { FaRegComment, FaUserCircle } from 'react-icons/fa';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { BsThreeDots } from 'react-icons/bs';
import { useAuth } from './AuthProvider';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { BsChatRightQuote } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { IoBookmarksOutline } from 'react-icons/io5';


interface IdPostPropsTypes {
    id:number;
    reposted?:number
    remove:(id:number)=>any
    removeBookmarkOnPage?:(id:number)=>any
}
interface UserDataTypes {
    id:number;
    username: string,
    email:string,
    user: number,
    description:string | undefined
    avatar:string,
    banner:string,
    date_joined:string,
    followership:number[],
    followers:number[],
    blocked_users:number[]
  }

interface PostTypes {
  id: number;
  body: string;
  date: string; 
  image: string
  author: number; 
  parent:number
  replies:number[],
  author_name:string; 
  likes:number[]
}

const ParentPostComponent = ({removeBookmarkOnPage,  id, remove, reposted}:IdPostPropsTypes) => {
    const { userData, deletePost, addFollow, removeFollow, blockUser } = useAuth()
    const [ postData, setPostData ] = useState<PostTypes | null>(null)
    const [ authorData, setAuthorData ] = useState<UserDataTypes | null>(null)
    const [ repostedBy, setRepostedBy ] = useState()
    useEffect(() => {
      const fetchData = async () => {
          try {
              await getPostData();
              await isReposted()
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, []);

    const getAuthorData = async (id:number) => {
          try {
              const res = await api.get(`/api/accounts/id/${id}`)
              setAuthorData(res.data)

          } catch(err) {
              console.log(err)
          }
      }
    const getPostData = async () => {
        try {
         const res = await api.get(`/api/posts/post/${id}`)   
         setPostData(res.data)              
         if (res.data?.author) {
          await getAuthorData(res.data.author);
        }
        console.log(res.data)
        } catch(err) {
          console.log(err)      
        }
    }
    
    const like = async () => {
      
      try {
        api.post('/api/posts/like/', { post:postData?.id }).then(getPostData)
      //   if (postData && userData) {
      //   const updatedPostData = { ...postData }; 
      //   updatedPostData.likes = [...updatedPostData.likes, userData.user];
      //   setPostData(updatedPostData);
      // }
      console.log('like')
      } catch(err) {
        console.log(err)
      }
    }
    const unLike = async () => {
      try {
        api.delete(`/api/posts/unlike/${postData?.id}/`).then(getPostData)
      //   if (postData) {
      //   let pc = {...postData}
      //   pc.likes = pc.likes.filter((l)=> l!=userData?.user)
      //   setPostData(pc)
      //   await getPostData()
      // }
      console.log('unlike')
      } catch(err) {
        console.log(err)
      }
    }

    const addBookmark = async () => {
      try {
        const response = await api.post('/api/posts/bookmarks/', {post:id, user:userData?.user})
        getPostData()
        console.log(response.data)
      } catch(err) {
        console.log(err)
      }
    }

    const removeBookMark = () => {
      try {
        const response = api.delete(`/api/posts/bookmarks/${id}`)
        console.log(response)
        getPostData()
        removeBookmarkOnPage?.(id)
      } catch (err) {
        console.log(err)
      }
    }

    const handleBookmarkClick = () => {
      if (userData?.bookmarks.includes(id) && id) {
         removeBookMark() 
        } else {
         addBookmark()
          }
    }    
    const repost = () => {
      try {
        if (postData && userData){         
          api.post('/api/posts/repost/', {
            "reposted":userData?.user.toString(),
            "post_id": postData.id,
            "body": postData.body,
            "author_name": postData.author_name
          })
       }
      } catch(error) {
        console.log(error)
      }
    };
    
    const isReposted = async () => { 
      if (reposted) {
        try {
          const response = await api.get(`/api/accounts/id/${reposted}`)
          setRepostedBy(response.data.username)
        } catch (err) {
          console.log(err)
        }
      }
    }
    
  return (
    <Card className='rounded-xl w-full m-0 bg-black pb-2 hover:bg-gray-950 border-0'>
               {repostedBy && <span className='text-gray-600 flex ml-3'><BiRepost className='w-6 h-6'/>{repostedBy} reposted</span>}
               <div className="w-full flex">
                  <div className="h-full mr-2">
                    <Link className="h-full relative" to={`/${authorData?.username}/`}>
                    
                        <Avatar className="w-12 h-12 ml-2 mt-2 flex justify-start relative z-20">
                            <AvatarImage className="w-12 h-12 rounded-full" src={authorData?.avatar || ''} />
                            <AvatarFallback>
                                <FaUserCircle className="text-white w-12 h-12"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className='h-full w-[3px] bg-slate-500 mx-auto absolute left-[30px] z-0'></div>
                    </Link>
                    
                  </div>
                  
                  <div className="w-full mt-1 relative">
                    <Link to={`/${authorData?.username}/tw/${id}`}>
                    <span className="text-white ml-2 font-semibold text-lg self-start m-0">{postData?.author_name}</span>
                    <span className="text-gray-100 opacity-70 pl-3 font-semibold text-sm m-0">{postData && formatDistanceToNow (new Date(postData?.date), { addSuffix: true })}</span>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="border-0">
                        <Button variant="outline" className="text-white absolute top-[10px] right-[10px] rounded-full hover:bg-gray-800 transition duration-1000 p-2">                      
                          <BsThreeDots/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-black text-white">
                        <DropdownMenuGroup>
                          { userData?.user != postData?.author && authorData && userData
                          ?
                          !authorData.followers.includes(userData.user)
                          ?
                          (<DropdownMenuItem onClick={() => addFollow(authorData.id)}>
                            <HiOutlineUserAdd className="w-6 h-6"/> <span className="font-bold ml-2">Follow</span>
                          </DropdownMenuItem>)
                          :
                          (<DropdownMenuItem onClick={() => removeFollow(authorData.id)}>
                            <HiOutlineUserAdd className="w-6 h-6"/> <span className="font-bold ml-2">UnFollow</span>
                          </DropdownMenuItem>)
                          :
                          null
                          }
                          {
                            <DropdownMenuItem onClick={() => blockUser(authorData? authorData?.user: NaN)}>
                            Block {authorData?.username}
                          </DropdownMenuItem>
                          }
                          
                          
                          <DropdownMenuItem
                          onClick={() => repost()}>
                            Report Post
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Save post
                          </DropdownMenuItem>
                          { 
                          userData?.user == postData?.author &&
                          <DropdownMenuItem 
                          onClick={() => {deletePost(id); remove(id)}}
                          >
                            Delete post
                          </DropdownMenuItem>}
                        </DropdownMenuGroup>
                      
                      </DropdownMenuContent>
                    </DropdownMenu> \
                    <Link to={`/${authorData?.username}/tw/${id}`}>
                      <CardDescription className="w-8/12 self-end ml-3 mt-1 text-gray-400 font-semibold">
                        {postData?.body}
                      </CardDescription> 
                      <div className="w-full flex justify-center">
                        {postData?.image && (
                        <img className="w-full h-4/6 rounded-xl self-center mt-3 mb-2 mr-2" src={postData.image} alt="Post image"/>
                        )}     
                      </div>
                    </Link>
                  <div className="w-full flex justify-between items-start pr-3">
                    <CommentDialog postId={id}>
                      <Button variant={'ghost'} className='hover:bg-accent hover:text-accent-foreground '>
                        <FaRegComment className="text-gray-300 mt-1"/>
                      </Button>
                    </CommentDialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}>
                          <BiRepost className='text-gray-300 h-5 w-5'/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='bg-black'>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <div className='flex' onClick={() => repost()}>
                                <BiRepost className='mr-2 text-gray-300 h-6 w-6 self-center'/>
                                <span className='text-gray-300 text-base self-start'>Repost</span>
                              </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <div className='flex'>
                                <BsChatRightQuote  className='mr-2 text-gray-300 h-5 w-5 self-center'/>
                                <span className='text-gray-300 text-base self-start'>Quote</span>
                              </div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className={`${ userData && postData?.likes.includes(userData?.user)?'text-pink-700':'text-gray-300'} flex self-end`}>
                      <Button onClick={!postData?.likes.includes(userData?.user || NaN)? like : unLike} variant={'ghost'} className='hover:bg-pink-600'>
                        <FaRegHeart className='self-center w-4 h-4'/>
                        <span className='self-end'>
                          {postData?.likes.length}
                        </span>
                      </Button>
                    </div>
                    <Button variant={'ghost'} onClick={() => handleBookmarkClick()}>
                      <IoBookmarksOutline className={` ${userData?.bookmarks.includes(id)? 'text-blue-600' : 'text-gray-300'}`}/>
                    </Button>
                  </div>
                </div>     
              </div>
            </Card>
  )
}

export default ParentPostComponent