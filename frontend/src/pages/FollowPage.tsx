import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PagesLayout from './PagesLayout';
import { IoMdArrowRoundBack } from 'react-icons/io';
import api from '@/api';
import Follow from '@/components/Follow';

interface UsernameUserDataTypes {
    username: string,
    email:string,
    user: number,
    description:string | undefined
    avatar:string,
    banner:string,
    date_joined:string,
    follows:number[],
    followers:number[]
  }
  
const FollowPage = () => {
    const { ProfUsername } = useParams();
    const [UsernameUserData, setUsernameUserData] = useState<UsernameUserDataTypes>();
    const [flDisplay, setFlDisplay] = useState<'followers' | 'followed'>('followers')

    useEffect(() => {
        if (ProfUsername) {
          getUsernameUserData();
        } 
      }, [ProfUsername, flDisplay]);

    const getUsernameUserData = async () => {
        try {
          const res = await api.get(`/api/accounts/user-profile/${ProfUsername}/`);
          const data = res.data;
          setUsernameUserData(data);
          console.log(data)          
        } catch (err) {
            console.log(err);
        }
      };
  return (
    <PagesLayout>
        <div className='h-screen thin-border'>
            <div className='w-full h-8 flex justify-start items-center pt-4 mb-5 '>
                <Link to='/'>
                    <IoMdArrowRoundBack className='h-12 w-12 opacity-85 mr-10'/>
                </Link>
                <h1 className='text-xl font-bold'>{UsernameUserData?.username}</h1>
            </div>
            <div className='flex'>
                <div className={`w-[50%] hover:bg-slate-900 text-center h-16 flex rounded-lg ${flDisplay == 'followed'? 'bg-slate-800' : ''}`}
                 onClick={() => setFlDisplay('followed')}
                >
                    <span className=' text-gray-400 self-center mx-auto'>
                    Followed
                    </span>
                </div>
                <div className={`w-[50%] hover:bg-slate-900 text-center h-16 flex rounded-lg ${flDisplay == 'followers'? 'bg-slate-800' : ''}`}
                 onClick={() => setFlDisplay('followers')}
                >
                    <span className=' text-gray-400 self-center mx-auto'>
                    Followerss
                    </span>
                </div>
            </div>
            <div>
                {
                    flDisplay === 'followed'?
                        UsernameUserData?.follows.map((f) => (
                            <Follow id={f} rfFn={getUsernameUserData}/>
                        ))
                    :
                    UsernameUserData?.followers.map((f) => (
                        <Follow id={f} rfFn={getUsernameUserData}/>
                    ))
                }
            </div>
        </div>
    </PagesLayout>
      
  )
}

export default FollowPage