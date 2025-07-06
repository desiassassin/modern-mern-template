import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Color from "cli-color";

const Bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;

const R2 = new S3Client({
     region: "auto",
     endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
     credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
     }
});

export async function uploadFileToCloudflareR2({ key, body }) {
     try {
          await R2.send(
               new PutObjectCommand({
                    Bucket,
                    Key: key,
                    Body: body
               })
          );

          console.log(Color.green(`[!] R2 | UPLOADED [!] ${key}`));
     } catch (error) {
          console.log(Color.red(`[!] R2 | UPLOAD ERROR [!] ${error.message}`));
     }
}

export async function deleteFileFromCloudflareR2({key}) {
     try {
          await R2.send(new DeleteObjectCommand({
               Bucket,
               Key: key
          }))

          console.log(Color.green(`[!] R2 | DELETED [!] ${key}`));
     } catch (error) {
          console.log(Color.red(`[!] R2 | DELETE ERROR [!] ${error.message}`));
     }
}

export default R2;
