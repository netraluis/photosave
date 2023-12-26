"use client";
import { useEffect, useState } from "react";

function Image ({src}: {src: string}) {
  return (
    <div className="py-1">
      <img src={src} className='w-full aspect-square mt-4' alt="Portland skyline sunset" loading="lazy"/>
    </div>
  )
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
    <div className = 'columns-sm gap-2 bg-white'>
      {products.map((product: any)=>{
        return <Image  src={product.imageSrc}/>
      })}
    </div>
  );
}
