import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import PagesLayout from './PagesLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardDescription,
} from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import api from '@/api';
import { useAuth } from '@/components/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegComment, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { BsChatRightQuote, BsThreeDots } from 'react-icons/bs';
import { HiOutlineUserAdd } from 'react-icons/hi';
import CommentDialog from '@/components/ReplyDialog';
import IdPost from '@/components/IdPost';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BiRepost } from 'react-icons/bi';
import { CiBookmark } from "react-icons/ci";
import ReplyPostComponent from '@/components/ReplyPostComponent';

interface UserDataTypes {
  username: string,
  email:string,
  id:number,
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
  author_name:string;
  parent:number;
  replies:number[];
  likes: number[]
}

const PostPage = () => {
  const { profUsername, paramsPostId } = useParams();
  const { userData, deletePost, addFollow, removeFollow, blockUser } = useAuth();
  const [authorData, setAuthorData] = useState<UserDataTypes | null>(null);
  const [postData, setPostData] = useState<PostTypes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAuthorData();
        await getPostData();
        setIsLoading(false);
      } catch (err: any) {
        console.log(err.response.detail);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [paramsPostId, userData]);

  const getAuthorData = async () => {
    try {
      const res = await api.get(`/api/accounts/user-profile/${profUsername}`);
      setAuthorData(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPostData = async () => {
    try {
      const res = await api.get(`/api/posts/post/${paramsPostId}/`);
      setPostData(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  };

  const follow = () => {
    if (userData && authorData) {
      const updatedAuthorData = { ...authorData };
      updatedAuthorData.followers.push(userData.user);
      setAuthorData(updatedAuthorData);
      addFollow(authorData.id);
    }
  };

  const unFollow = () => {
    if (userData && authorData) {
      const updatedAuthorData = { ...authorData };
      updatedAuthorData.followers = updatedAuthorData.followers.filter(f => f !== userData.user);
      setAuthorData(updatedAuthorData);
      removeFollow(authorData.id);
    }
  };
  const removePost = (id:number) => {
          if (postData) {
              const pdc = postData
              pdc.replies = pdc?.replies.filter((p) => p != id)
              setPostData(pdc)
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
      } catch(err) {
        console.log(err)
      }
    }
  if (
    authorData &&
    userData &&
    userData.blocked_users &&
    userData.blocked_users.includes(authorData.user)
  ) {
    return <></>;
  }

  return (
    <PagesLayout>
      <div className='h-screen'>
      <div className='w-full h-8 flex justify-start items-center pt-4 mb-5 '>
          <Link to='/'>
            <IoMdArrowRoundBack className='h-12 w-12 opacity-85 mr-10'/>
          </Link>
          <h1 className='text-xl font-bold'>Post</h1>
        </div>
        <Card className="m-0 rounded-xl w-full bg-black flex thin-border pb-2 border-l-0 border-r-0 hover:bg-gray-950">
             <div className="h-full mr-2">
               <Link className="h-full" to={`/${authorData?.username}/`}>
                   <Avatar className="w-12 h-12 ml-2 mt-2 flex justify-start">
                       <AvatarImage className="w-12 h-12 rounded-full" src={authorData?.avatar || ''} />
                       <AvatarFallback>
                           <FaUserCircle className="text-white w-12 h-12 ml-2 mt-1"/>
                       </AvatarFallback>
                   </Avatar>
               </Link>
             </div>
             
             <div className="w-full mt-1 relative">
               <Link to={`/${authorData?.username}/tw/${postData?.id}`}>
               <span className="text-white ml-2 font-semibold text-lg self-start m-0">{postData?.author_name}</span>
               <span className="text-gray-100 opacity-70 pl-3 font-semibold text-sm m-0">{postData && formatDistanceToNow (new Date(postData?.date), { addSuffix: true })}</span>
               
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
                     (<DropdownMenuItem onClick={() => follow()}>
                       <HiOutlineUserAdd className="w-6 h-6"/> <span className="font-bold ml-2">Follow</span>
                     </DropdownMenuItem>)
                     :
                     (<DropdownMenuItem onClick={() => unFollow()}>
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
                     
                     
                     <DropdownMenuItem>
                       Report Post
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                       Save post
                     </DropdownMenuItem>
                     { 
                     userData?.user == postData?.image && postData &&
                     <DropdownMenuItem 
                     onClick={() => {deletePost(postData?.id);}}
                     >
                       Delete post
                     </DropdownMenuItem>}
                   </DropdownMenuGroup>
                 
                 </DropdownMenuContent>
               </DropdownMenu> 
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
 
               <CommentDialog postId={postData? postData.id : NaN}>
                 <Button variant={'ghost'}>
                   <FaRegComment className="text-gray-300"/>
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
                         <div className='flex'>
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
               
               <div className='text-gray-300 flex self-end'>
                 <Button onClick={!postData?.likes.includes(userData?.user || NaN)? like : unLike} variant={'ghost'} className='hover:bg-pink-600'>
                   <FaRegHeart className='self-center w-4 h-4'/>
                   <span className='self-end'>
                     {postData?.likes.length}
                   </span>
                 </Button>
               </div>
               <Button variant={'ghost'}>
                  <CiBookmark title='Bookmark' className='text-gray-300 w-6 h-6'/>
               </Button>
             </div>
           </div>     
         </Card>
         <ReplyPostComponent postId={postData? postData.id : NaN}/>
        
        {
          postData?.replies.map((p) => (
            <IdPost id={p} remove={removePost} key={p}/>
          ))
        }
      </div>
    </PagesLayout>
  );
}

export default PostPage;