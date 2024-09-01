import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatsPage = () => {

    const [message, setMessage] = useState<string>('')
    const navigate = useNavigate()

    const onSubmit = () => {
        navigate('/chats/' + message)
    }

    const HandleMessagehange = (e:ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }
  return (
    <div>
    What chat room would you like to enterr?<br/>
    <form action="#" onSubmit={onSubmit}>
        <input type="text" size={100} onChange={HandleMessagehange}/><br/>
        <input type="button" value="Enter"/>
    </form>
    </div>
  )
}

export default ChatsPage