import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface BackButtonProps {
    href:string,
    label:string
}

const BackButton = ({label, href}:BackButtonProps) => {
  return (
    <Button variant="link">
        <Link to={href}>{ label }</Link>
    </Button>
)
}

export default BackButton