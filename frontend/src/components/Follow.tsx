import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from '@/api';
import { RxAvatar } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from './AuthProvider';

interface UsernameUserDataTypes {
    username: string,
    email: string,
    user: number,
    description: string | undefined,
    avatar: string,
    banner: string,
    date_joined: string,
    follows: number[],
    followers: number[]
}

interface FollowProps {
    id: number,
    rfFn: () => void
}

const Follow = ({ id, rfFn }: FollowProps) => {
    const { userData, addFollow, removeFollow } = useAuth();
    const [usernameUserData, setUsernameUserData] = useState<UsernameUserDataTypes | null>(null);
    const [isFollowed, setIsFollowed] = useState<boolean>(false);

    useEffect(() => {
        getUsernameUserData();
    }, []);

    useEffect(() => {
        if (usernameUserData && userData) {
            setIsFollowed(usernameUserData.followers.includes(userData.user));
        }
    }, [usernameUserData, userData]);

    const getUsernameUserData = async () => {
        try {
            const res = await api.get(`/api/accounts/id/${id}/`);
            const data = res.data;
            setUsernameUserData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleFollow = async () => {
        if (usernameUserData) {
            if (isFollowed) {
                await removeFollow(usernameUserData?.user);
            } else {
                await addFollow(usernameUserData?.user);
            }
        }
        setIsFollowed(!isFollowed);
        rfFn();  // refresh data xd
    };

    return (
        <div className='flex self-center px-10 justify-between align-top thin-border rounded-xl border-x-0 py-3'>
            <Link className='flex' to={`/${usernameUserData?.username}`}>
                <Avatar className='w-12 h-12 mr-8'>
                    <AvatarImage src={usernameUserData?.avatar} />
                    <AvatarFallback><RxAvatar /></AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <span className='text-base font-bold tracking-wider self-start'>{usernameUserData?.username}</span>
                    <span className='text-sm text-gray-500'>{usernameUserData?.description?.substring(0, 20)}</span>
                </div>
            </Link>
            {usernameUserData?.user !== userData?.user && (
                <Button
                    className='text-lg font-bold bg rounded-2xl bg-gray-200 text-black'
                    onClick={handleFollow}
                >
                    {isFollowed ? 'Unfollow' : 'Follow'}
                </Button>
            )}
        </div>
    );
};

export default Follow;
