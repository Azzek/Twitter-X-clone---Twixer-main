// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { FaUserCircle } from "react-icons/fa";
// import api from "@/api";
// import { useContext, useEffect, useState } from "react";
// import { formatDistanceToNow } from 'date-fns';
// import { BsThreeDots } from "react-icons/bs";
// import { HiOutlineUserAdd } from "react-icons/hi";
// import { FaRegComment } from "react-icons/fa";
// import { BiRepost } from "react-icons/bi";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "./ui/button";
// import { useAuth } from "./AuthProvider";
// import CommentDialog from "./ReplyDialog";


// interface PostPropsTypes {
//   id: number;
//   body: string;
//   image: string;
//   authorId: number;
//   date:string,
//   remove: (id:number) => void;
// }

// interface UserDataTypes {
//     username: string,
//     email:string,
//     user:number,
//     id: number,
//     avatar:string,
//     baner:string,
//     date_joined:string,
//     followership:number[],
//     followers:number[]
//   }

// const Post = (props: PostPropsTypes) => {

//   const { userData, deletePost, addFollow, removeFollow, blockUser } = useAuth()
//   const [authorData, setAuthorData] = useState<UserDataTypes | null>(null);
//   const formattedDate = formatDistanceToNow (new Date(props.date), { addSuffix: true })
//   const [isLoading, setIsLoading] = useState<boolean>(true)

  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         getAuthorData();
//         setIsLoading(false)
//       } catch(err:any) {
//         console.log(err.response.detail)
//         setIsLoading(false)
//       }
//     }
//     fetchData()
//   }, [props.authorId, userData]);

//   const getAuthorData = async () => {
    
//     try {
//       const res = await api.get(`/api/accounts/id/${props.authorId}`);
//       setAuthorData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
    
//   };
//   const follow = () => {
//     const ca = authorData
//     if (userData) ca?.followers.push(userData?.user)
//     setAuthorData(ca)
//     addFollow(props.authorId)
//   }
  
//   const unFollow = () => {
//     const ca = authorData
//     if (userData) ca?.followers.filter((f) => f!==userData.user)
//     setAuthorData(ca)
//     removeFollow(props.authorId)
//   }
//   if (authorData && userData?.blocked_users.includes(authorData?.user)){
//     return (<></>)
//   }

//   return (
//           <>
//           {
//             isLoading?
//             <div role="status" className="w-full items-center">
//               <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
//                   <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
//               </svg>
//               <span className="sr-only">Loading...</span>
//             </div>
//             :
//           <Link to={`${authorData?.username}/tw/${props.id}`}>
//             <Card className="m-0 rounded-xl w-full bg-black flex thin-border pb-2 border-l-0 border-r-0 hover:bg-gray-950">
//               <div className="h-full mr-2">
//                 <Link className="h-full" to={`/${authorData?.username}/`}>
//                     <Avatar className="w-12 h-12 ml-2 mt-2">
//                         <AvatarImage src={authorData?.avatar || ''} />
//                         <AvatarFallback>
//                             <FaUserCircle />
//                         </AvatarFallback>
//                     </Avatar>
//                 </Link>
//               </div>
              
//               <div className="w-full mt-1 relative">
//                 <span className="text-white ml-2 font-semibold text-lg self-start m-0">{authorData?.username}</span>
//                 <span className="text-gray-100 opacity-70 pl-3 font-semibold text-sm m-0">{formattedDate}</span>
                
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild className="border-0">
//                     <Button variant="outline" className="text-white absolute top-[10px] right-[10px] rounded-full hover:bg-gray-800 transition duration-1000 p-2">                      
//                       <BsThreeDots/>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56 bg-black text-white">
//                     <DropdownMenuGroup>
//                       { userData?.user != props.authorId && authorData && userData
//                       ?
//                       !authorData.followers.includes(userData.user)
//                       ?
//                       (<DropdownMenuItem onClick={() => follow()}>
//                         <HiOutlineUserAdd className="w-6 h-6"/> <span className="font-bold ml-2">Follow</span>
//                       </DropdownMenuItem>)
//                       :
//                       (<DropdownMenuItem onClick={() => unFollow()}>
//                         <HiOutlineUserAdd className="w-6 h-6"/> <span className="font-bold ml-2">UnFollow</span>
//                       </DropdownMenuItem>)
//                       :
//                       null
//                       }
//                       {
//                         <DropdownMenuItem onClick={() => blockUser(authorData? authorData?.user: NaN)}>
//                         Block {authorData?.username}
//                       </DropdownMenuItem>
//                       }
                      
                      
//                       <DropdownMenuItem>
//                         Report Post
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         Save post
//                       </DropdownMenuItem>
//                       { 
//                       userData?.user == props.authorId &&
//                       <DropdownMenuItem 
//                       onClick={() => {deletePost(props.id); props.remove(props.id)}}
//                       >
//                         Delete post
//                       </DropdownMenuItem>}
//                     </DropdownMenuGroup>
                  
//                   </DropdownMenuContent>
//                 </DropdownMenu> 
                
//                 <CardDescription className="w-8/12 self-end ml-2 mt-1 text-gray-400 font-semibold">{props.body}</CardDescription> 
//                 <div className="w-full flex justify-center">
//                   {props.image && (
//                   <img className="w-full h-4/6 rounded-xl self-center mt-3 mb-2 mr-2" src={props.image} alt="Post image"/>
//                   )}     
//                 </div>
//                 <div className="h-full">
                
//                 <CommentDialog postId={props.id}>
//                 <><FaRegComment className="text-gray-300"/></> 
//                 </CommentDialog>
//                 <BiRepost />
//                 </div>
//               </div>     
//             </Card>
//           </Link>
//           }
//           </>
//   );
// };

// export default Post;
