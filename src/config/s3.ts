import {S3Client} from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: 'eu-central',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    },
})

console.log(s3);