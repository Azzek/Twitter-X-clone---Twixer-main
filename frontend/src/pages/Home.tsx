import Navbar from "../components/Navbar"
import MainCategories from "../components/MainCategories"
import RecentPosts from "../components/Posts"
import Footer from "../components/Footer"
import PagesLayout from "./PagesLayout"



const Home = () => {
  return (
    <PagesLayout>
        <RecentPosts/>
    </PagesLayout>
  )
}

export default Home