import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import api from '@/api';
import { ScrollArea } from "@/components/ui/scroll-area"
import ProfilePictureUpload from './ProfilePictureUpload';
import ProfileDescription from './ProfileDescription';
import { useNavigate } from 'react-router-dom';


interface SetupProfileProps {
    children: React.ReactNode;
    avatar: string | undefined;
    banner: string | undefined;
    userDescription: string | undefined;
    id: number | undefined;
    username:string | undefined;
    refresh:()=>void;
}   

const SetupProfileElement: React.FC<SetupProfileProps> = ({ children, banner, avatar, userDescription, id, username, refresh }) => {
    const [description, setDescription] = useState(userDescription ? userDescription : "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("description", description);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }
            if (bannerFile) {
                formData.append("banner", bannerFile);
            }
            api.patch(`/api/accounts/update-profile/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
            } 
        }   
        )
        navigate(`/${username}/`)
        } catch (error) {
            console.log(error);
        } finally {
            refresh()
        }
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col justify-start items-center">
                <ScrollArea className='w-full'>
                    <form className='w-full' onSubmit={handleSubmit}>
                        <ProfilePictureUpload
                            avatar={avatar}
                            banner={banner}
                            setAvatarFile={setAvatarFile}
                            setBannerFile={setBannerFile}
                            avatarFile={avatarFile}
                            bannerFile={bannerFile}
                        />
                        <ProfileDescription
                            description={description}
                            setDescription={setDescription}
                        />
                        <DialogFooter>
                            <DialogClose>
                                <Button variant="default" className='w-full mt-3'>Sssave profile</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default SetupProfileElement;
