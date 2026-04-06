import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const region = process.env.AWS_REGION || 'ap-northeast-2';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
export const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export class S3Service {
  /**
   * Uploads a file buffer to S3 and returns the public URL
   */
  static async uploadImage(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    if (!bucketName) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    // Safe extension extraction based on mimeType
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const extension = mimeToExt[mimeType] || 'png';
    const uniqueFileName = `artworks/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: mimeType,
      // For general public access without signed URLs:
      // ACL: 'public-read', // Deprecated in some S3 setups, usually bucket policies are better. Left out to rely on bucket policy.
    });

    await s3Client.send(command);

    // Construct the public URL
    // Format: https://[bucket-name].s3.[region].amazonaws.com/[key]
    return `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFileName}`;
  }

  /**
   * Deletes an image from S3 given its full URL
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    if (!bucketName) return;

    // Extract the key from the URL
    // URL format: https://bucket.s3.region.amazonaws.com/artworks/123-abc.png
    const urlParts = imageUrl.split('.amazonaws.com/');
    if (urlParts.length < 2) return;
    const key = urlParts[1];

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  }
}
