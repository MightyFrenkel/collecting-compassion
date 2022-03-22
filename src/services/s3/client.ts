import { S3Client } from "@aws-sdk/client-s3";
import settings from "./aws";
// Set the AWS Region.
const REGION = "eu-west-3"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
    region: REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
    }
});
export { s3Client };