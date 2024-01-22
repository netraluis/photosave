
import { GetObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// export async function GET(
//   request: Request,
//   { params }: { params: { imageId: string } }
// ) {
//   // const maxExpireTime = 604800; //7 days maximum expire time
//   const region = "eu-central-1";
//   const s3client = new S3Client({
//     region,
//   } as S3ClientConfig);

//   if (params.imageId) {
//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: params.imageId as string,
//     });
//     const url = await getSignedUrl(s3client, command, { expiresIn: 180 });
//     const writeStream = createWriteStream("./downloaded-image.jpg");
//     writeStream.pipe(writeStream);
//     return Response.json({ url: url });
//   } else {
//     return Response.json({ message: "No Name Found in Key" });
//   }

//   // return Response.json({mess: params.imageId})
// }

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

    // use fetch to get a response
  const response = await fetch(url);
 
  return new Response(response.body, {
    headers: {
      ...response.headers, // copy the previous headers
      "content-disposition": `attachment; filename="${params.imageId}"`,
    },
  });
    // return Response.json({ url: url });
  } else {
    return Response.json({ message: "No Name Found in Key" });
  }

}
