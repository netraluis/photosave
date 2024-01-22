"use client";

import { useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

export default function Page() {
  const [imageShow, setImageShow] = useState<any>([]);
  const [file, setFile] = useState<File[] | string[]>([]);
  const [url, setUrl] = useState("");
  const { data, status }: any = useSession();

  const uploadImage = async (fileToUpload: any, index: number) => {

    const imageManipulating = [...imageShow];
    imageManipulating[index].status = "uploading";
    setImageShow(imageManipulating);

    const formData = new FormData();
    formData.append("file", fileToUpload);

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
      {
        method: "POST",

        body: formData,
      }
    );

    const { url, fields, status } = await response.json();

    if(status === "success"){
      imageManipulating[index].status = "uploaded";
    }else{
      imageManipulating[index].status = "failed";
    }
    setImageShow(imageManipulating);
    

    console.log("llego", { url, fields });

    return { url, fields };

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ file, imageShow });
    if (!file || file.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const photosUploading: any = [];
    imageShow.forEach((image: any, index: number) => {
      photosUploading.push(uploadImage(image.file, index));
    });

    Promise.race(photosUploading)
      .then((result) => {
        console.log("The first promise resolved:", result);
      })
      .catch((error) => {
        console.error("The first promise rejected:", error);
      });
    return;

  };

  const seePhoto = async () => {
    console.log("aqui so");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/api/upload/c5e0d8f2-5759-49a0-8056-2c368a8ee7b6.jpg",
        // process.env.NEXT_PUBLIC_BASE_URL + '/api/upload/hello',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ filename: file.name, contentType: file.type, file: file }),
        }
      );
      const res = await response.json();

      // console.log({ response: await response.json() });
      setUrl(res.url);
    } catch (e: any) {
      console.log({ e });
    }
  };

  const seePhotos = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
        // process.env.NEXT_PUBLIC_BASE_URL + '/api/upload/hello',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ filename: file.name, contentType: file.type, file: file }),
        }
      );
      const res = await response.json();
      console.log({ res });
      // console.log({ response: await response.json() });
      // setUrl(res.url);
    } catch (e: any) {
      console.log({ e });
    }
  };

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const allFiles = [];
      for (let i = 0; i < event.target.files.length; i++) {
        const allFile = {
          name: event.target.files[i].name,
          url: URL.createObjectURL(event.target.files[i]),
          file: event.target.files[i],
          status: "pending",
        };
        allFiles.push(allFile);
      }

      setImageShow(allFiles);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Hi {data?.user?.email}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                onChange={(e: any) => {
                  const files = e.target.files;
                  console.log({ files });
                  if (files) {
                    setFile(files);
                  }
                }}
              >
                <div className="text-center">
                  <div className="columns-sm gap-1 bg-white rounded-md">
                    {imageShow &&
                      imageShow.length > 0 &&
                      imageShow.map((image: any) => {
                        return (
                          <div key={image.name} className="relative  w-full ">
                            <img
                              key={image.name}
                              className="w-full aspect-square mb-1 "
                              src={image.url}
                              alt=""
                              // className="w-full h-48 object-center object-cover rounded-md"
                            />
                            <div className="absolute inset-x-0 bottom-0 flex  items-end justify-end  rounded-lg p-4">
                              <p className="relative text-lg font-semibold text-white">
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {image.status}
                              </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600 text-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <div>Upload a file</div>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only text-center"
                        multiple
                        accept="image/png, image/jpeg"
                        onChange={onImageChange}
                      />
                    </label>
                    {/* <p className="pl-1">or drag and drop</p> */}
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
