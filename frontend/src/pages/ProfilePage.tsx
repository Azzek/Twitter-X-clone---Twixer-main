import React, { useState, useEffect } from 'react';
import PagesLayout from './PagesLayout';
import api from '@/api';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import IdPost from '@/components/IdPost';
import { useAuth } from '@/components/AuthProvider';
import SetupProfileElement from '@/components/SetupProfileElement';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from "react-icons/bs";
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogContent } from '@/components/ui/dialog';

interface UsernameUserDataTypes {
  username: string,
  email:string,
  user: number,
  description:string | undefined
  avatar:string,
  banner:string,
  date:string,
  follows:number[],
  followers:number[]
}

interface PostTypes {
  id: number;
  body: string;
  image: string;
  author: number;
  date: string;
  reposted: number;
  parent: number;
}

const ProfilePage = () => {
  const { profUsername } = useParams();
  const [posts, setPosts] = useState<PostTypes[]>();
  const [UsernameUserData, setUsernameUserData] = useState<UsernameUserDataTypes>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const [ postsDisplay, setPostsDisplay ] = useState<'posts' | 'replies' | 'likes' | 'media'>('posts')
  const { addFollow, removeFollow, userData, blockUser, unBlockUser } = useAuth();
  const [ followersCount, setFollowersCount ] = useState<number>(UsernameUserData?.followers ? UsernameUserData.followers.length : 0)
  const [ likedPosts, setLikedPosts ] = useState<PostTypes[]>()

  useEffect(() => {
    if (profUsername) {
      getUsernameUserDataAndPosts(profUsername)
      getLikedPosts()
    }
  }, [profUsername, userData]);
  

  const getUsernameUserDataAndPosts = async (username: string) => {
    try {
        const res = await api.get(`/api/accounts/user-profile/${username}/`);
        const data = res.data;
        setUsernameUserData(data);
        console.log(data)
        setIsFollowed(data.followers.includes(userData?.user));
        setFollowersCount(data?.followers.length);
        const postsRes = await api.get(`/api/posts/posts/${username}/`);
        setPosts(postsRes.data);
        // console.log('xddd',postsRes.data)
    } catch (err) {
        console.log(err);
    }
};

const getLikedPosts = async () => {
  try {
    const res = await api.get(`/api/posts/liked/${profUsername}/`);
    console.log('wwdqwdqwdqwdqwdqwefwefgwefg',res.data)
    setLikedPosts(res.data)
  } catch (err) {
    console.log(err)
  }
}

  const follow = () => {
    if (UsernameUserData) {
      setIsFollowed(!isFollowed) 
      addFollow(UsernameUserData.user)
      setFollowersCount(followersCount + 1)
    }
  }
    
  const unFollow = () => {
    if (UsernameUserData) {
      setIsFollowed(!isFollowed)
      removeFollow(UsernameUserData?.user) 
      setFollowersCount(followersCount - 1)
    } 
  }
   const removePost = (id:number) => {
    if (posts) {
      let pc = posts
      pc = pc.filter((p) => p.id != id)
      setPosts(pc)
    }
    
  }
  const date = UsernameUserData?.date ? new Date(UsernameUserData?.date) : null;
  const formattedDate = date ? format(date, 'MMMM yyyy', { locale: enUS }) : 'Invalid date';

  return (
    <PagesLayout>
      <div className='h-screen w-100 flex-shrink-0 w-full thin-border rounded-none border-t-0'>
        <div className='w-full h-8 flex justify-start items-center pt-4 mb-5 '>
          <Link to='/'>
            <IoMdArrowRoundBack className='h-12 w-12 opacity-85 mr-10'/>
          </Link>
          <h1 className='text-xl font-bold'>{UsernameUserData?.username}</h1>
        </div>
        <div className='w-full relative border-b-0'>
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
                    <Button className='text-lg font-bold mt-5 bg rounded-2xl bg-gray-200 text-black'
                     onClick={() => follow()}>
                      Follow
                    </Button>
                    :
                    <Button className='text-lg font-bold mt-5 bg rounded-2xl bg-gray-200 text-black'
                     onClick={() => unFollow()}>
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
                  <SetupProfileElement avatar={userData?.avatar} banner={userData?.banner} userDescription={userData?.description} id={userData?.user} username={userData?.username} refresh={()=>getUsernameUserDataAndPosts(profUsername? profUsername : '')}>
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
                <Link to={`/${UsernameUserData.username}/fl`}>
                  <span className='mr-4 font-bold hover:underline'>
                      {followersCount} Followers 
                  </span>
                </Link>
                <Link to={`/${UsernameUserData.username}/fl`}>
                  <span className='font-bold hover:underline'>
                    {UsernameUserData?.follows ? UsernameUserData?.follows.length : "0"} Following
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <h1>{profUsername}</h1>
          )}
        </div>
        <div className='thin-border'>
        <div className='flex  pt-2 w-full'>
                <div className={`w-full hover:bg-slate-900 text-center h-16 flex rounded-lg ${postsDisplay == 'posts'? 'bg-slate-800' : ''}`}
                 onClick={() => setPostsDisplay('posts')}
                >
                    <span className=' text-gray-400 self-center mx-auto'>
                    Posts
                    </span>
                </div>
                <div className={`w-full hover:bg-slate-900 text-center h-16 flex rounded-lg ${postsDisplay == 'replies'? 'bg-slate-800' : ''}`}
                 onClick={() => setPostsDisplay('replies')}
                >
                  <span className=' text-gray-400 self-center mx-auto'>
                    Replies
                  </span>
                </div>
                <div className={`w-full hover:bg-slate-900 text-center h-16 flex rounded-lg ${postsDisplay == 'likes'? 'bg-slate-800' : ''}`}
                 onClick={() => setPostsDisplay('likes')}
                >
                  <span className=' text-gray-400 self-center mx-auto'>
                    likes
                  </span>
                </div>
                <div className={`w-full hover:bg-slate-900 text-center h-16 flex rounded-lg ${postsDisplay == 'media'? 'bg-slate-800' : ''}`}
                 onClick={() => setPostsDisplay('media')}
                >
                  <span className=' text-gray-400 self-center mx-auto'>
                    Media
                  </span>
                </div>
        </div>
          {
          posts ? 
            
              postsDisplay === 'posts'?
              
                posts.map(post => (
                  !post.reposted && !post.parent?
                  <IdPost
                  key={post.id}
                    id={post.id}
                    remove={removePost}
                  />
                  :
                  null
                ))
              :
              postsDisplay === 'replies'?
               
                posts.map(post => (
                  post.reposted || post.parent?
                  <IdPost
                  reposted={post.reposted? post.reposted : undefined}
                  key={post.id}
                    id={post.id}
                    remove={removePost}
                  />
                  :
                  null
                ))
    
                :

                postsDisplay === 'likes' && likedPosts?
                likedPosts.map(post => (
                  <IdPost
                  reposted={post.reposted? post.reposted : undefined}
                  key={post.id}
                    id={post.id}
                    remove={removePost}
                  />)
                 
                )
                :
                postsDisplay === 'media'?
                <div className='grid grid-cols-3 gap-4'>
                  {posts.map((post) => (
                    post.image?
                    <Dialog>
                      <DialogTrigger>
                        <img src={post.image} className='w-full h-full rounded-xl hover:scale-105 transition'/>
                      </DialogTrigger>
                      <DialogContent >
                        <img src={post.image} className='w-full h-full rounded-xl '/>
                      </DialogContent >
                    </Dialog>
                      
                    :
                    null
                  ))}
                  </div>
                  :
                  null
            
           : 
            <></>
          }
        </div>
      </div>
    </PagesLayout>
  );
}

export default ProfilePage;
