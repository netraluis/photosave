import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import * as AWS from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { connectToDatabase } from "@/app/lib/db";
import { stat } from "fs";

export async function POST(request: Request) {
  const { filename, contentType, file } = await request.json();

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const uui = uuidv4();
    console.log({ uui });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${uui}.jpg`,
      Conditions: [
        ["content-length-range", 0, 10400000085760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        // acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log({ uploadResponse }, uploadResponse.ok);

    if (uploadResponse.ok) {
      const client = await connectToDatabase();
      const db = client.db();

      // delete imageManipulating[index].status;

      await db.collection("photos").insertOne({ filename, contentType, file });
      client.close();

      console.log("Upload successful!");
      return Response.json({ url, fields, status: "success" });
    } else {
      console.error("S3 Upload Error:", uploadResponse);
      console.log("Upload failed.");
      throw new Error("Upload failed.");
    }

    
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}

export async function GET(
  request: Request
) {
  const expiresIn = 60 * 5; // expiration time in seconds (e.g., 5 minutes)
  const client = new S3Client({ region: process.env.AWS_REGION });
  const listObjectCommand = new ListObjectsCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
  });
  const { Contents } = await client.send(listObjectCommand);
  if (!Contents) return Response.json([]);
  const objects = Contents.map(async(object) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: object.Key,
    });
    
    return {
      id: object.Key,
      name: 'name',
      href: 'href',
      price: 'price',
      imageSrc: await getSignedUrl(client, command, { expiresIn: 180 }),
      imageAlt: 'imageAlt',
      // url: await getSignedUrl(client, command, { expiresIn: 180 }),
      // Bucket: process.env.AWS_BUCKET_NAME!,
      // Key: object.Key,
      // Expires: expiresIn,
    };
  });

  const customizedObjects = await Promise.all(objects);

  return Response.json( customizedObjects );
}
// else {
//   return Response.json({ message: "No Name Found in Key" });
// }

// return Response.json({mess: params.imageId})
// }
