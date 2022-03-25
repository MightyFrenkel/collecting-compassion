import { S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from "src/config";
// Set the AWS Region.
const REGION = "eu-west-3";

const s3Client = new S3Client({
    region: REGION, credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY_SECRET
    }
});
export { s3Client };