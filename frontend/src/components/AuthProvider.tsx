import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { ACCES_TOKEN, REFRESH_TOKEN } from "@/constans"; // Ensure this path is correct
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import Logo from "./Logo";
import LoginPage from "@/pages/auth/LoginPage";

interface AuthProviderProps {
  children: ReactNode; 
}

interface UserDataTypes {
    username: string,
    email:string,
    user: number,
    description:string | undefined
    avatar:string,
    banner:string,
    date_joined:string,
    follows:number[],
    followers:number[],
    blocked_users:number[],
    bookmarks:number[]
  }

interface ContextTypes {
    isAuthenticated: boolean;
    addFollow:(whoToFollow:number)=>any,
    removeFollow:(whoToUnfollow:number)=>any,
    blockUser:(whoToBlock:number)=>any,
    unBlockUser:(whoToUnBlock:number)=>any,
    deletePost:(postId:number)=>void,
    userData:UserDataTypes | null,
    logout:() =>void,
    getUserData:() =>void,
    login:(username:string, password:string)=>void
    // login:(username:string, password:string) =>any
  }
  
interface TokenTypes {
    exp: number,
    user_id:number
}

const AuthContext = createContext<ContextTypes | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserDataTypes | null>(null)

  useEffect(() => {
    const authenticate = async () => {
      try {
        await auth();
        await getUserData();
      } catch {
        navigate('/login');
      }
    };
    auth()
    authenticate()
    getUserData()
    setIsLoading(false)
  }, []);


  const getToken = () => {
    const token = localStorage.getItem(ACCES_TOKEN);
    if (!token) {
    setIsAuthenticated(false);
    navigate('/login');
    return
    }
    // console.log(token)
    return jwtDecode<TokenTypes>(token)
  } 

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      setIsAuthenticated(false);
      navigate('/login');
      return;
    }
    console.log(refreshToken)
    try {
      const res = await api.post('/api/accounts/token/refresh/', {
        refresh: refreshToken
      });
      if (res.status > 199 && res.status < 300) {
        localStorage.setItem(ACCES_TOKEN, res.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (err) {
      console.log(err)
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const auth = async (): Promise<void> => {
    const token = getToken()
    if (token){
        const tokenExpiration = token.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            getUserData()
            setIsAuthenticated(true);
        }
    } else {
      setIsAuthenticated(false)
      navigate('/login')
    }
  };

  const logout = () => {
      localStorage.clear();
      navigate('/login');
    };

  const login = async (username:string, password:string) => {
    try{
        const res = await api.post('/api/accounts/token/', { username, password })
        localStorage.setItem(ACCES_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        getUserData()
        setIsAuthenticated(true)
        navigate('/')
      }
      catch(err) {
        console.log(err)
      } 
  }
    
  const deletePost = async (postId:number) => {
      try {
        api.delete(`/api/posts/delete/${postId}/`)
      } 
      catch(err) {
        console.log(err)
      }
    }

  const getUserData = async () => {
    const token = getToken()
    try {
        const res = await api.get(`/api/accounts/id/${token?.user_id}`);
        setUserData(res.data);
        console.log(res.data)
    } catch (err) {
        console.error(err);
    }
  };

  const removeFollow = (whoToUnfollow:number) => {
    try {
      api.delete(`/api/accounts/unfollow/`, { data: {user_id:whoToUnfollow}  })
      if (whoToUnfollow && userData) {
        let uc = userData;
        uc.followers = userData.followers.filter((f)=> f!==userData?.user);
        setUserData(uc)
      }
      } catch(err) {
        console.log(err)
      }
      getUserData()
      
  } 
  
  const addFollow = (whoToFollow:number) => {
    try {
      api.post('/api/accounts/follow/', { follows:whoToFollow, follower:userData?.user})
      
      if (whoToFollow && userData) {
        let uc = userData;
        uc.follows.push(whoToFollow);
        setUserData(uc)
      } 
      getUserData()
      } 
      catch(err) {
          console.log(err)
      }
  }
    
  const blockUser = async (whoToBlock:number) => {
    try {
      await api.post(`/api/accounts/block/${whoToBlock}/`)
      let cu = userData
      cu?.blocked_users.push(whoToBlock)
      setUserData(cu)
    } catch(err) {
      console.log(err)
    }
  }  
  const unBlockUser = async (whoToUnBlock:number) => {
    try {
      await api.delete(`/api/accounts/block/${whoToUnBlock}/`)
      let cu = userData
      cu?.blocked_users.filter((f)=>f!=whoToUnBlock)
      setUserData(cu)
    } catch(err) {
      console.log(err)
    }
  }  
  
  const values: ContextTypes = {
    isAuthenticated,
    removeFollow,
    addFollow,
    blockUser,
    unBlockUser,
    deletePost,
    userData,
    logout,
    login,
    getUserData
  };

  return (
  <>
    {
      !isLoading?
      (
        <AuthContext.Provider value={values}>
          { isAuthenticated? children : <LoginPage/> }
        </AuthContext.Provider>
      )
      :
      (
        <div className="h-full w-full justify-center align-middle">
          <Logo/>
        </div>
        
    )
    }
  </>
  )
};

export default AuthProvider;
