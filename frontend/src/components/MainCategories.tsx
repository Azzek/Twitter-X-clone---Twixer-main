import CategoryOption from "./CategoryOption";

const categories:{url:string; name:string}[] = [
    {
        name:'cars',
        url:"https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'house',
        url:"https://images.unsplash.com/photo-1501635238895-63f29cfc06b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlJTIwaWNvbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'garden',
        url:"https://plus.unsplash.com/premium_photo-1680288884596-4ccbf5355297?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdhcmRlbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'electronisc',
        url:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'for free',
        url:"https://cdn.discordapp.com/attachments/639825645542703114/1249424088955486338/Bez_nazwy.png?ex=6667405b&is=6665eedb&hm=58558669c190c5144194f81c427c0a09c1cce4b32c8bbaa0b339e075aeeb411d&"
    },
    {
        name:'sport',
        url:"https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name:'for babies',
        url:"https://images.unsplash.com/photo-1583086762675-5a88bcc72548?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJhYnl8ZW58MHx8MHx8fDA%3D"
    },
    {
        name:'books',
        url:"https://plus.unsplash.com/premium_photo-1681825268400-c561bd47d586?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'cosmetics',
        url:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww"
    },
    {
        name:'fashion',
        url:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name:'for animals',
        url:"https://media.istockphoto.com/id/1441913203/pl/zdj%C4%99cie/corgi-walijski-pembroke-odosobniony.jpg?s=612x612&w=0&k=20&c=PynIiIoq8_UDvLL9JP3IrpPWazJy9Mtx8taHqTKfDHQ="
    },
    
]

const MainCategories = () => {

  return (
    <div className="container mb-14">
        <div className="container p-5 items-center flex justify-center">
            <h1 className="text-6xl font-bold">Main categories</h1>
        </div>
        <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-6 gap-4 px-3">
        {categories.map((category, index) => (
            <CategoryOption key={index} imgURL={category.url} name={category.name} />
        ))}
        </div>
        
    </div>
  )
}

export default MainCategories