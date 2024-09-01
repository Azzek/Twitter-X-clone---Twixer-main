import { CiSearch } from "react-icons/ci";
import React, { ChangeEvent, useState } from 'react'
import { Input } from "./ui/input";
import api from "@/api";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface UserDataTypes {
  username: string,
  email:string,
  user: number,
  avatar:string,
  baner:string,
  date_joined:string,
  followership:number[],
  followers:number[],
  description: string
}


const SearchInput = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<UserDataTypes[]>([]);
  const [inputFocus, setInputFocus] = useState<boolean>(false)

  const handleSearch = async () => {
      try {
          const response = await api.get(`/api/accounts/search/?search=${query}`);
          setResults(response.data);
          console.log(response.data)
      } catch (error) {
          console.error("There was an error fetching the search results!", error);
      }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      handleSearch()
  };

  return (
    <div className="W-[50%]">
      <div className={`${inputFocus ? 'border-2 border-blue-500' : 'border-0'} flex xl:pr-14 md:pr-0 pl-6 bg-gray-900 rounded-2xl py-1 self-center mt-2 w-[70%] mb-4`}>
        <CiSearch className={`${inputFocus ? 'text-blue-500' : 'border-0'} h-9 w-9 self-start`} />
        <Input onFocus={() => setInputFocus(true)}  onBlur={() => setInputFocus(false)} onChange={handleChange} className="focus:outline-none border-transparent w-full"/>
      </div>
      {
        query.length > 0?
        results.map((user) => (
          <Link to={`/${user.username}`} key={user.user} className="hover:bg-gray-700">
            <div className="flex pl-5">
            <Avatar>
              <AvatarImage src={user.avatar} alt="user avatar" className="flex w-12 h-12 rounded-full bg-muted self-end mt-3"/>
              <AvatarFallback><FaUserCircle className="w-12 h-12"/></AvatarFallback>
            </Avatar>

              <div className="pt-1 pl-4 flex flex-col">
                <span className='mt-1 text-lg font-bold'>{user.username}</span>
                <span className="font-thin text-gray-400">{ user.description.substring(0, 20) }</span>
              </div>  
            </div>
          </Link>
        ))
        :
        null
      }
    </div>
    
  )
}

export default SearchInput