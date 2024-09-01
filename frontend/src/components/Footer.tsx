import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='container w-screen p-8 flex justify-between bg-slate-900 rounded-md mt-12'>
        <div className="flex justify-around">
            <FaGithub className="text-white w-9 h-9 mr-3 cursor-pointer"/>
            <FaFacebook className="text-white w-9 h-9 mr-3 cursor-pointer"/>
            <FaTwitter className="text-white w-9 h-9 mr-3 cursor-pointer"/>
            <FaInstagramSquare className="text-white w-9 h-9 mr-3 cursor-pointer"/>
        </div>
        <p className="text-white text-center mt-3">© 2024 Jan Chajęcki ;v</p>
    </div>
  )
}

export default Footer