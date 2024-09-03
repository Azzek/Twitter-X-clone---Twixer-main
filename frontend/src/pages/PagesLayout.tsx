import Navbar from '@/components/Navbar'
import SearchInput from '@/components/SearchUsersInput';
import React, { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider';
import Trends from '@/components/Trends';
interface PagesLayoutProps {
  children: React.ReactNode;
}


const PagesLayout: React.FC<PagesLayoutProps> = ({ children }) => {  
  const { isAuthenticated } = useAuth()
  useEffect(()=> {
    console.log(isAuthenticated)
  },[])
  return (
    <div className='w-screen h-screen max-h-screen flex max-w-screen'>
        <Navbar/>
        <div className='lx:max-w-[2/5] lg:w-2/5 w-3/5 sm:mr-12 sm:mt-16 lg:mt-0 ml-[20%] z-50'>
          {children}
        </div>
        <div className='justify-start flex-col items-start w-[30%] px-5 hidden lg:flex flex-shrink-0 fixed right-0 top-0'>
          <SearchInput/>
          <Trends/>
        </div>
    </div>

  )
}

export default PagesLayout