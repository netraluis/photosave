import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { GetObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  // const maxExpireTime = 604800; //7 days maximum expire time
  const region = "eu-central-1";
  const s3client = new S3Client({
    region,
  } as S3ClientConfig);

  if (params.imageId) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: params.imageId as string,
    });
    const url = await getSignedUrl(s3client, command, { expiresIn: 180 });
    return Response.json({ url: url });
  } else {
    return Response.json({ message: "No Name Found in Key" });
  }

  // return Response.json({mess: params.imageId})
}
