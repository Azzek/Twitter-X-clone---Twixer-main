import React, { ChangeEvent } from 'react'
import { Label } from "@/components/ui/label"
import { Textarea } from './ui/textarea';

interface ProfileDescriptionProps {
    description: string;
    setDescription: (description: string) => void;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({ description, setDescription }) => {
    const handleOnDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    return (
        <div>
            <Label className='text-xl font-medium'>Describe yourself</Label>
            <Textarea onChange={handleOnDescriptionChange} value={description} />
        </div>
    );
};

export default React.memo(ProfileDescription);
