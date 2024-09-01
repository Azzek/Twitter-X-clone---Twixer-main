import { useContext, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { GrHomeRounded } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";  
import { FaRegUser } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoBookmarksOutline } from "react-icons/io5";
import Logo from './Logo';
import { useAuth } from './AuthProvider';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import { IoMdMail } from 'react-icons/io';
import PostDialogInput from './PostDialogInput';
import { LuLogOut } from 'react-icons/lu';

const Navbar = () => {
  const {isAuthenticated, userData, logout} = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return isMobile ? (
    <NavigationMenu className="w-full px-2" orientation="horizontal">
      <div className="w-screen">
        <NavigationMenuList className="mt-1 flex w-full justify-between bg-slate-900 p-2 rounded-md">
          <NavigationMenuItem>
            <Logo />
          </NavigationMenuItem>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Drawer direction="top">
                <DrawerTrigger>
                  <RxHamburgerMenu className="text-white w-7 h-7 transition duration-300 transform hover:scale-105" />
                </DrawerTrigger>
                <DrawerContent className="flex flex-col justify-center px-6 bg-slate-900 items-center mt-5 py-4 rounded-md shadow-lg">
                  <Logo />
                  {isAuthenticated ? (
                    <>
                      <Button size="lg" className="hover:bg-slate-100 hover:text-black transition duration-300 w-full" onClick={logout}>
                        <BiSolidLogInCircle className="mr-2 h-7 w-7" />
                        Logout
                      </Button>
                      {userData && (
                        <div className="mt-4 text-white text-center">
                          <p>{userData.username}</p>
                          <p>{userData.email}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <NavigationMenuItem>
                          <Button size="lg" className="hover:bg-slate-100 hover:text-black transition duration-300 w-full">
                            <BiSolidLogInCircle className="mr-2 h-7 w-7" />
                            Login
                          </Button>
                        </NavigationMenuItem>
                      </Link>
                      <Link to="/register">
                        <NavigationMenuItem>
                          <Button size="lg" className="hover:bg-slate-100 hover:text-black transition duration-300 w-full">
                            <FaUser className="mr-2 h-5 w-5" />
                            Register
                          </Button>
                        </NavigationMenuItem>
                      </Link>
                    </>
                  )}
                  <Link to="/new-post">
                    <NavigationMenuItem>
                      <Button size="lg" className="hover:bg-slate-100 hover:text-black transition duration-300 w-full">
                        <MdOutlinePostAdd className="mr-2 h-7 w-7" />
                        Add post
                      </Button>
                    </NavigationMenuItem>
                  </Link>
                </DrawerContent>
              </Drawer>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  ) : (
    <div className="h-screen bg-black flex flex-col justify-between items-center gap-3 pt-3 max-h-screen fixed left-0 top-0 lg:w-[20%] shadow-lg -z-2">
      
        <div className='pl-10 lg:pl-52 flex flex-col gap-6'>
          <Logo />
          <Link to={`/`} >
            <NavigationMenuItem className="flex flex-1 items-center justify-between space-x-2 ">
              <Button className="border-gray-700 bg-black text-2xl flex justify-start transition duration-300 hover:bg-gray-800">
                <GrHomeRounded className="h-7 w-7 text-gray-200" />
                <span className="ml-2 text-xl text-gray-200 hidden lg:flex">Home</span>
              </Button>
            </NavigationMenuItem>
          </Link>
          <Link to={`/${userData?.username}`}>
            <NavigationMenuItem className="w-full flex flex-1 items-center justify-between space-x-2">
              <Button className="w-80 border-gray-700 bg-black text-2xl flex justify-start transition duration-300 hover:bg-gray-800">
                <FaRegUser className="h-7 w-7 text-gray-200"/>
                <span className="ml-2 text-xl text-gray-200 hidden lg:flex">Profile</span>
              </Button>
            </NavigationMenuItem>
          </Link>
          <Link to="/bookmarks"> 
            <NavigationMenuItem className="w-full flex flex-1 items-center justify-between space-x-2">
              <Button className="hover:bg-gray-700 bg-black text-2xl flex justify-between relative transition duration-300 hover:bg-gray-800">
                <IoBookmarksOutline className="h-7 w-7 text-gray-200"/>
                <span className="ml-2 text-xl text-gray-200 hidden lg:flex">Bookmarks</span>
              </Button>
            </NavigationMenuItem>
          </Link>
          <Link to="/messages"> 
            <NavigationMenuItem className="w-full flex flex-1 items-center justify-between space-x-2">
              <Button className="hover:bg-gray-700 bg-black text-2xl flex justify-between relative transition duration-300 hover:bg-gray-800">
                <IoMdMail className="h-7 w-7 text-gray-200"/>
                <span className="ml-2 text-xl text-gray-200 hidden lg:flex">Messages</span>
              </Button>
            </NavigationMenuItem>
          </Link>
          <Link to="/explore"> 
            <NavigationMenuItem className="w-full flex flex-1 items-center justify-between space-x-2">
              <Button className="hover:bg-gray-700 bg-black text-2xl flex justify-between relative transition duration-300 hover:bg-gray-800">
                <LuLogOut  className="h-7 w-7 text-gray-200"/>
                <span className="ml-2 text-xl text-gray-200 hidden lg:flex">Logout</span>
              </Button>
            </NavigationMenuItem>
          </Link>
          <PostDialogInput/>
        </div>

      <div className="flex lg:justify-center lg:self-end w-[10%] hidden">
        <Avatar className='h-14 w-14 m-3 border border-gray-700 shadow-md'>
          <AvatarImage src={userData?.avatar} alt="avatar image" />
          <AvatarFallback>
            <FaUser />
          </AvatarFallback>
        </Avatar>
        {userData && (
          <div className="text-white mt-2 px-2 self-start hidden lg:flex">
            <div className='flex justify-between '>
              <p className='font-semibold'>{userData.username}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className='bg-transparent p-0'><BsThreeDots /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black">
                  <DropdownMenuGroup>
                    <DropdownMenuItem  className='text-gray-300' onClick={logout}>
                      <FiLogOut className='w-5 h-5 mr-2'/>
                      Log out
                    </DropdownMenuItem>
                    <Link to='https://github.com/Azzek'>
                      <DropdownMenuItem className='text-gray-300'>
                        Author
                      </DropdownMenuItem>
                    </Link>
                    
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className='text-gray-400'>{`@${userData.email.substring(0,20)}${userData.email.length >= 20 ? '...' : ''}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
