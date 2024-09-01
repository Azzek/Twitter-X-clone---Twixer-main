import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormWrapper from './FormWrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { loginSchema } from "@/schema"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import api from '@/api'
import { ACCES_TOKEN, REFRESH_TOKEN } from "@/constans";
import { useAuth } from '@/components/AuthProvider'

const LoginPage = () => {
  
  const { getUserData } = useAuth()
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      email:"",
      password: "",
      confirmPassword:""
    },
  })
  const login = async (username:string, password:string) => {
    try{
        const res = await api.post('/api/accounts/token/', { username, password })
        localStorage.setItem(ACCES_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        getUserData()
        navigate('/')
      }
      catch(err) {
        setError(err.response.data.detail)
      } 
}

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    login(values.username, values.password)

  }

  return (
    <div className='bg-slate-900 w-screen h-screen flex justify-center align-middle items-center'>
        <FormWrapper title='Login' label={error? error : 'Login to your account'} backButtonLabel='Dont have an account? Register here' backButtonHref='/Register'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>

                  <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} type='text' placeholder='Andrew'/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  />

                  <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type='password' placeholder=''/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  />
                </div>
                <Button type='submit' className='w-full'>
                  Login
                </Button>
              </form>
            </Form>
        </FormWrapper>
    </div>
  )
}

export default LoginPage