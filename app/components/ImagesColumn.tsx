"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const CustomizeImage = (image: any) => {

  const downloadPhoto = async (id: any) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/api/upload/${id}`,
        // process.env.NEXT_PUBLIC_BASE_URL + '/api/upload/hello',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ filename: file.name, contentType: file.type, file: file }),
        }
      );
      const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

      const imageUrl = url;

      // Create a new anchor element and set its href to the image URL
      const anchor = document.createElement('a');
      anchor.href = imageUrl;
      anchor.download = 'image.jpg';
      anchor.target = '_blank'; // Open the link in a new tab
  
      // Trigger a click event on the anchor element to start the download
      anchor.click();

      // console.log({ response: await response.json() });
      // setUrl(res.url);
    } catch (e: any) {
      console.log({ e });
    }
  };
  return (
    <div key={image.name} className="relative  w-full ">
      <Image
        key={image.id}
        width={500}
        height={500}
        src={image.src}
        className="w-full aspect-square mb-1"
        alt="Portland skyline sunset"
        loading="lazy"
        // fill={true}
      />
      <div className="absolute inset-x-0 bottom-0 flex  items-end justify-end  rounded-lg p-4">
        <p className="relative text-lg font-semibold text-white">
          <button
            className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            type="button"
            onClick={() => downloadPhoto(image.id)}
          >
            Download
          </button>
          {/* </span> */}
        </p>
      </div>
    </div>
  );
};

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
    <div className="columns-sm gap-1 bg-white">
      {products.map((product: any) => {
        console.log({ product })
        return (
          <CustomizeImage
            key={product.id}
            width={500}
            height={500}
            src={product.imageSrc}
            className="w-full aspect-square mb-1"
            alt="Portland skyline sunset"
            loading="lazy"
            id={product.id}
          />
        );
      })}
    </div>
  );
}
