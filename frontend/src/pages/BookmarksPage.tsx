import { useAuth } from '@/components/AuthProvider'
import React, { ChangeEvent, useState } from 'react'
import PagesLayout from './PagesLayout'
import IdPost from '@/components/IdPost'
import { CiSearch } from 'react-icons/ci'
import { Input } from '@/components/ui/input'
import api from '@/api'

const BookmarksPage = () => {
    const { userData } = useAuth()
    const [ inputFocus, setInputFocus ] = useState(false)
    const [ searchQuery, setSearchQuery ] = useState('')
    const [ bookmarks, setBookmarks ] = useState<number[] | undefined>(userData?.bookmarks)
     
    const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        handleSearch()
    }
    const displayBookmarks = () => {
        return 
    }

    const removeBookMark = (id:number) => {
        setBookmarks(bookmarks?.filter((b)=>b !== id))
    }

    const handleSearch = async () => {
        try {
            const response = await api.get(`/api/accounts/search/?search=${searchQuery}`);
            setBookmarks(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("There was an error fetching the search results!", error);
        }
    };  
  
  return (
    <PagesLayout>
        <div className='pl-4 thin-border border-y-0 border-l-0 h-full'>
            <div> 
                <h1 className='text-2xl'>Bookmarks</h1>
                <span className='text-sm text-gray-500'>{userData?.username}</span>
                <div className={`${inputFocus ? 'border-2 border-blue-500' : 'border-0'} flex xl:pr-14 md:pr-0 pl-6 bg-gray-900 rounded-2xl py-1 self-center mt-2`}>
                    <CiSearch className={`${inputFocus ? 'text-blue-500' : 'border-0'} h-9 w-9 self-start`} />
                    <Input onFocus={() => setInputFocus(true)}  onBlur={() => setInputFocus(false)} onChange={handleSearchChange} className="focus:outline-none border-transparent"/>
                </div>
            </div>
            <span>
                {bookmarks && bookmarks.map((b)=> (
                    <div>
                        <IdPost id={b} remove={()=>{}} removeBookmarkOnPage={(id:number) => removeBookMark(id)}/>
                    </div>
                ))}
            </span>
        </div>
    </PagesLayout>
  )
}

export default BookmarksPage