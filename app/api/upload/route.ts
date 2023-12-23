import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const { filename, contentType, file } = await request.json()

  try {
    const client = new S3Client({ region: process.env.AWS_REGION })
    const uui = uuidv4()
    console.log({uui})
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${uui}.jpg`,
      Conditions: [
        ['content-length-range', 0, 10400000085760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })

    return Response.json({ url, fields })
    // // if (response.ok) {
    // //   const { url, fields } = await response.json()

    // console.log('llego')
    //   const formData = new FormData()
    //   Object.entries(fields).forEach(([key, value]) => {
    //     formData.append(key, value as string)
    //   })
    //   formData.append('file', file)


    //   const uploadResponse = await fetch(url, {
    //     method: 'POST',
    //     body: formData,
    //   })

    //   if (uploadResponse.ok) {
    //     console.log('Upload successful!')
    //     return Response.json({ res: 'Upload successful!', url, fields})
    //   } else {
    //     console.error('S3 Upload Error:', uploadResponse)
    //     console.log('Upload failed.')
    //     return Response.json({ res: 'Upload failed.'})
    //   }
  } catch (error: any) {
    return Response.json({ error: error.message })
  }
}

export async function GET(request: Request, response: Response) {

}

