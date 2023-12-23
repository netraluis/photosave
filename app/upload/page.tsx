"use client";

import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          file: file,
        }),
      }
    );

    // console.log(await response.json());

    // if (response.ok) {
    const { url, fields } = await response.json();

    console.log("llego");
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);
    console.log("llego 2 ");
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log({uploadResponse})

    if (uploadResponse.ok) {
      console.log("Upload successful!");
      // return Response.json({ res: 'Upload successful!'})
    } else {
      console.error("S3 Upload Error:", uploadResponse);
      console.log("Upload failed.");
      // return Response.json({ res: 'Upload failed.'})
    }
    setUploading(false);
  };

  const seePhoto = async () => {
    console.log("aqui so");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/upload/c5e0d8f2-5759-49a0-8056-2c368a8ee7b6.jpg",
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

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setFile(files[0]);
            }
          }}
          accept="image/png, image/jpeg"
        />
        <button type="submit" disabled={uploading}>
          Upload
        </button>
      </form>

      <>
        <p>URL:{url}</p>
        <button onClick={seePhoto} />
      </>
    </main>
  );
}
