"use client";
import { useEffect, useState } from "react";

function Image ({src}: {src: string}) {
  return (<li className=" h-40 grow-0 ">
    <a href="https://res.cloudinary.com/css-tricks/image/upload/f_auto,q_auto/v1568814785/photostream-photos/DSC05544_aczrb9.jpg" data-fancybox data-caption="Portland skyline sunset">
  <img src={src} className='max-h-full min-w-full object-cover align-bottom' alt="Portland skyline sunset" loading="lazy"/>
</a></li>)
}

export default function Images() {
  const [products, setProducts] = useState<any>([]);


  useEffect(() => {
    async function fetchUrls() {
      const response = await fetch("/api/upload");
      const data = await response.json();
      console.log({ data });
      setProducts(data);
    }

    fetchUrls();
  }, []);

  console.log({ products }, products.lenght === 0);
  if (products.lenght === 0) return <> vacio </>;
  return (
    <ul className = 'flex flex-wrap justify-center'>
      {products.map((product: any)=>{
        return <Image  src={product.imageSrc}/>
      })}
    </ul>
  );
}
