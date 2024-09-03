import React, { useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Input } from './ui/input';

interface ProfilePictureUploadProps {
    avatar: string | undefined;
    banner: string | undefined;
    setAvatarFile: (file: File | null) => void;
    setBannerFile: (file: File | null) => void;
    bannerFile: File | null;
    avatarFile: File | null;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ avatar, banner, setAvatarFile, setBannerFile, avatarFile, bannerFile }) => {
    const avatarFileInputRef = useRef<HTMLInputElement>(null);
    const bannerFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=> {
        console.log(banner)
    },[])
    const handleAvatarFileInputChange = () => {
        if (avatarFileInputRef.current) {
            avatarFileInputRef.current.click();
        }
    };
    
    const handleBannerFileInputChange = () => {
        if (bannerFileInputRef.current) {
            bannerFileInputRef.current.click();
        }
    };

    const handleOnChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatarFile(file);
        }
    };

    const handleOnChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setBannerFile(file);
        }
    };

    return (
        <div className='mt-3 relative mb-12'>
            <Label className='text-xl font-medium'>Pick a profile and header picture</Label>
            <div onClick={handleBannerFileInputChange}>
                {
                    bannerFile ? 
                        <img src={URL.createObjectURL(bannerFile)} alt="Profile baner" className='w-full min-h-56 rounded-2xl cursor-pointer'/>
                    :
                    banner?
                    <img src={banner} alt="Profile baner" className='w-full min-h-56 rounded-2xl'/>
                    :
                    <div className='w-full bg-gray-500 min-h-56 rounded-2xl'/>
                }
                <Input accept="image/jpeg,image/png,image/webp" onChange={handleOnChangeBanner} className='hover:bg-slate-200 sr-only' name='image' type='file' ref={bannerFileInputRef}/>
            </div>
            <Avatar onClick={handleAvatarFileInputChange} className='h-36 w-36 border-2 border-white absolute top-1/2 transform -translate-y-[-20px] -translate-x-[-30px]'>
                {
                    avatarFile?
                    <AvatarImage className='h-36 w-36' src={URL.createObjectURL(avatarFile)} />
                    :
                    <AvatarImage className='h-36 w-36' src={avatar} />
                }
                
                <AvatarFallback>
                    <FaUserCircle className='h-36 w-36 text-black'/>
                </AvatarFallback>
            </Avatar>
            <Input accept="image/jpeg,image/png,image/webp" onChange={handleOnChangeAvatar} className='hover:bg-slate-200 sr-only' name='image' type='file' ref={avatarFileInputRef}/>
        </div>
    );
};

export default React.memo(ProfilePictureUpload);
