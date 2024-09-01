import { useState } from 'react'
import FormWrapper from './FormWrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { registerSchema } from '@/schema'
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
import { useNavigate } from 'react-router-dom'
import api from '@/api'

type ErrorResponse = {
  username?: string[]; // Pola mogą być opcjonalne
  password?: string[];
  email?: string[];
  [key: string]: string[] | undefined; // Dla dodatkowych dynamicznych pól
};

const RegisterPage = () => {

  const [error, setError] = useState<ErrorResponse>();
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email:"",
      password: "",
      confirmPassword:""
    },
  })
  
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await api.post('/api/accounts/register/', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
  
      if (res.status >= 200 && res.status < 300) {
        navigate('/login');
      } else {
        // Set error from response data if the status code indicates failure
        setError(res.data);
      }
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
        console.log(err)
      } else {
        setError({ message: ['An unexpected error occurred. Please try again later.'] });
      }
    }
  };
  

  const handleError = () => {
    if (error) {
      return (
        <ul className="text-red-500 mb-4">
          {Object.entries(error).map(([key, value]) => {
            // Ensure value is an array; if not, convert it into an array
            const messages = Array.isArray(value) ? value : [value];
            return messages.map((errMsg, index) => (
              <li key={`${key}-${index}`}>{errMsg}</li>
            ));
          })}
        </ul>
      );
    }
    return null;
  };
  
  
    

  return (
    <div className='bg-slate-900 w-screen h-screen flex justify-center align-middle items-center'>
        <FormWrapper title='Register' label='Create an account' backButtonLabel='Already have an account? Login here' backButtonHref='/login'>
            <Form {...form}>
            <h1>{handleError()}</h1>
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
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type='email' placeholder='abc@gmail.com'/>
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

                  <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} type='password' placeholder=''/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  />

                </div>
                <Button type='submit' className='w-full'>
                  Register
                </Button>
              </form>
            </Form>
        </FormWrapper>
    </div>
  )
}

export default RegisterPage