import Home from "./pages/Home"
import { Routes, Route} from "react-router-dom"
import RegisterPage from "./pages/auth/RegisterPage"
import LoginPage from "./pages/auth/LoginPage"
import AuthProvider from "./components/AuthProvider"
import ProfilePage from "./pages/ProfilePage"
import PostPage from "./pages/PostPage"
import FollowPage from "./pages/FollowPage"
import MessagesPage from "./pages/MessagesPage"
import BookmarksPage from "./pages/BookmarksPage"

export default function App() {
  return (
      <Routes>
        <Route path="/messages" element={<AuthProvider><MessagesPage/></AuthProvider>}/>
        <Route path="/messages/:chatId" element={<AuthProvider><MessagesPage/></AuthProvider>}/>
        <Route path="/" element={<AuthProvider><Home/></AuthProvider>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<AuthProvider><LoginPage/></AuthProvider>}/>
        <Route path='/bookmarks' element={<AuthProvider><BookmarksPage/></AuthProvider>}></Route>
        <Route path="/:profUsername" element={<AuthProvider><ProfilePage/></AuthProvider>}/>
        <Route path="/:profUsername/tw/:paramsPostId" element={<AuthProvider><PostPage/></AuthProvider>}/>
        <Route path="/:ProfUsername/fl" element={<AuthProvider><FollowPage/></AuthProvider>} />
     </Routes>
  )
}

