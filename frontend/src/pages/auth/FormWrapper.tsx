import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import BackButton from './BackButton'

interface FormWrapperProps {
  title:string,
  label:string,
  backButtonLabel:string,
  backButtonHref:string,
  children: React.ReactNode
}

const FormWrapper = ({title,label,backButtonLabel,backButtonHref,children}:FormWrapperProps) => {
  return (
    <Card className='lg:w-1/4 md:w-1/2 '>
        <CardHeader className='flex justify-center'>
            <CardTitle className='text-center font-bold text-3xl'>
                {title}
            </CardTitle>
            <CardDescription className='text-center text-md'>
                {label}
            </CardDescription>
            <CardContent>
              {children}
            </CardContent>
            <CardFooter className='text-center flex justify-center'>
              <BackButton href={backButtonHref} label={backButtonLabel}></BackButton>
            </CardFooter>
        </CardHeader>
    </Card>
  )
}

export default FormWrapper