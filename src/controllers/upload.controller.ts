import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.ts";

export const  uploadVideo = async (req, res) => {
    const file = req.file;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3.send(command);
    res.json({ message: "Video uploaded successfully" });
}