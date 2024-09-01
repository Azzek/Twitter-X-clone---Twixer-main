import React, { useState, useEffect } from 'react';
import PagesLayout from './PagesLayout';
import api, {setAuthToken} from '@/api';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Post from '@/components/Post';
import { useAuth } from '@/components/AuthProvider';
import SetupProfileElement from '@/components/SetupProfileElement';
import { HiOutlineUserAdd } from "react-icons/hi";
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
import { BsThreeDots } from "react-icons/bs";

interface UsernameUserDataTypes {
  username: string,
  email:string,
  user: number,
  description:string | undefined
  avatar:string,
  banner:string,
  date_joined:string,
  followership:number[],
  followers:number[]
}

interface PostTypes {
  id: number;
  body: string;
  image: string;
  author: number;
  date: string
}

const ProfilePage = () => {
  const { profUsername } = useParams();
  const [posts, setPosts] = useState<PostTypes[]>();
  const [UsernameUserData, setUsernameUserData] = useState<UsernameUserDataTypes>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const { addFollow, removeFollow, userData, blockUser, unBlockUser } = useAuth();
  const [ followersCount, setFollowersCount ] = useState<number>(UsernameUserData?.followers ? UsernameUserData.followers.length : 0)
  
  useEffect(() => {
    if (profUsername) {
      getUsernameUserData(profUsername);
      getUserPosts(profUsername);
    }
  }, [profUsername, userData]);

  const getUsernameUserData = async (username: string) => {
    try {
      const res = await api.get(`/api/accounts/user-profile/${username}/`);
      const data = res.data;
      setUsernameUserData(data);
      setIsFollowed(data.followers.includes(userData?.user))
      
    } catch (err) {
        console.log(err);
    }
  };

  const getUserPosts = async (username: string) => {
    try {
      const res = await api.get(`/api/posts/posts/${username}/`);
      const data = res.data;
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const follow = () => {
    const ca = UsernameUserData
    if (userData) ca?.followers.push(userData?.user)
    setUsernameUserData(ca)
    if (UsernameUserData) addFollow(UsernameUserData?.user)
  }
  
  const unFollow = () => {
    const ca = UsernameUserData
    if (userData) ca?.followers.filter((f) => f!==userData.user)
    setUsernameUserData(ca)
    if (UsernameUserData) removeFollow(UsernameUserData?.user)
  }

  const date = UsernameUserData?.date_joined ? new Date(UsernameUserData?.date_joined) : null;
  const formattedDate = date ? format(date, 'MMMM yyyy', { locale: enUS }) : 'Invalid date';

  return (
    <PagesLayout>
      <div className='h-screen w-1/2 ml-[25%]'>
        <div className='w-full h-8 flex justify-start items-center pt-4 mb-5 '>
          <Link to='/'>
            <IoMdArrowRoundBack className='h-12 w-12 opacity-85 mr-10'/>
          </Link>
          <h1 className='text-xl font-bold'>{UsernameUserData?.username}</h1>
        </div>
        <div className='w-full relative thin-border'>
          {UsernameUserData?.banner ? (
            <img src={UsernameUserData?.banner} alt="Profile baner" className='w-full bg-gray-500 min-h-56 max-h-10 rounded-xl'/>
          ) 
          :
          (
            <div className='w-full bg-gray-500 min-h-56 rounded-xl'/>
          )}
          <div className='w-full flex justify-between min-h-11'>
            <div className='absolute top-1/2 transform -translate-y-[70px] -translate-x-[-30px]'>
              <Avatar className='h-44 w-44 border-4 border-black rounded-full'>
                <AvatarImage src={UsernameUserData?.avatar} />
                <AvatarFallback><RxAvatar /></AvatarFallback>
              </Avatar>
            </div>
            <div></div>
            <div className='w-1/3 text-center'>
              {userData?.user !== UsernameUserData?.user && UsernameUserData? 
              <div>
                 {
                    !isFollowed && profUsername && UsernameUserData && userData
                    ?
                    <Button className='text-lg font-bold mt-5 bg rounded-2xl bg-gray-200 text-black' onClick={() => { setIsFollowed(!isFollowed), addFollow(UsernameUserData.user), setFollowersCount(followersCount + 1)}}>
                      Follow
                    </Button>
                    :
                    <Button className='text-lg font-bold mt-5 bg rounded-2xl bg-gray-200 text-black' onClick={() => { setIsFollowed(!isFollowed), removeFollow(UsernameUserData?.user), setFollowersCount(followersCount - 1)}}>
                      Unfollow
                    </Button>
                  }

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="border-0">
                        <Button variant="outline" className="text-white rounded-full hover:bg-gray-800 p-2">                      
                          <BsThreeDots/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-black text-white">
                        <DropdownMenuGroup>              
                          {
                            userData && !userData.blocked_users.includes(UsernameUserData.user)?
                            <DropdownMenuItem onClick={() => blockUser(UsernameUserData? UsernameUserData?.user: NaN)}>
                              Block {UsernameUserData?.username}
                            </DropdownMenuItem>
                          :
                          <DropdownMenuItem onClick={() => unBlockUser(UsernameUserData? UsernameUserData?.user: NaN)}>
                            unBlock {UsernameUserData?.username}
                          </DropdownMenuItem>
                          }
                          
                          <DropdownMenuItem>
                            Report Post
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Save post
                          </DropdownMenuItem>
  
                        </DropdownMenuGroup>
                       
                      </DropdownMenuContent>
                    </DropdownMenu> 
              </div>
                  : 
                  <SetupProfileElement avatar={userData?.avatar} banner={userData?.banner} userDescription={userData?.description} id={userData?.user}>
                    <Button className='text-lg font-bold mt-5 bg rounded-2xl' variant='outline'>Set up profile</Button>
                  </SetupProfileElement>
              }
            </div>
          </div>
          {UsernameUserData ? (
            <div className='pl-7'>
              
              <h1 className='font-extrabold text-2xl pt-9 ml-1 mb-2'>{UsernameUserData?.username}</h1>
              <p>{UsernameUserData.description}</p>
              <p className='flex'><MdOutlineCalendarMonth className='h-5 w-5' /> Joined {formattedDate}</p>
              <div> 
                <span className='mr-4 font-bold'>{followersCount} Followers </span>
                <span className='font-bold'>{UsernameUserData?.followership ? UsernameUserData?.followership.length : "0"} Following</span>
              </div>
            </div>
          ) : (
            <h1>{profUsername}</h1>
          )}
        </div>
        <div>
          {posts ? (
            posts.map(post => (
              <Post
                id={post.id}
                key={post.id}
                body={post.body}
                image={post.image}
                authorId={post.author}
                date={post.date}
                remove={(id: number) => setPosts(posts.filter((p) => p.id !== id))}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </PagesLayout>
  );
}

export default ProfilePage;
