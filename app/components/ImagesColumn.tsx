"use client";
import { useEffect, useState } from "react";

function Image ({src}: {src: string}) {
  return (
    // < className="py-0">
      <img src={src} className='w-full aspect-square mb-1' alt="Portland skyline sunset" loading="lazy"/>
    // </>
  )
}

export default function Images() {
  const [products, setProducts] = useState<any>([]);


  useEffect(() => {
    async function fetchUrls() {
      const response = await fetch("/api/upload");
      const data = await response.json();
      setProducts(data);
    }

    fetchUrls();
  }, []);

  if (products.lenght === 0) return <> vacio </>;
  return (
    <div className = 'columns-sm gap-1 bg-white'>
      {products.map((product: any)=>{
        return <Image key={product.imageSrc}  src={product.imageSrc}/>
      })}
    </div>
  );
}
