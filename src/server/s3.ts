import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuid } from "uuid"

const { S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_BUCKET_NAME, S3_REGION } =
  process.env

if (!S3_ACCESS_KEY_ID || !S3_ACCESS_KEY_SECRET || !S3_BUCKET_NAME || !S3_REGION)
  throw new Error("Missing or invalid keys for upload")

export const client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY_SECRET,
  },
})

export async function getDownloadUrl(client: S3Client, key: string) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  })

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 60,
  })

  return { signedUrl, key }
}

export async function getUploadUrl(
  client: S3Client,
  userId: string,
  fileType: string,
  byteLength: number
) {
  const key = `${userId}/${uuid()}.${fileType.split("/")[1]}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ContentLength: byteLength,
  })

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 30, // Expire URL after 60 seconds
  })

  return { signedUrl, key }
}

export async function deleteObject(client: S3Client, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  })

  await client.send(command)
}
