import {
  Card
} from "@/components/ui/card"
4
interface option {
    imgURL:string
    name: string
}

const CategoryOption = (props:option) => {
  return (
    <Card className="m-0 rounded-3xl hover:scale-110 transition-transform duration-300">
        <img src={props.imgURL} alt={props.name} className="w-full h-full object-cover"/>
    </Card>
    
  )
}

export default CategoryOption