import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class S3Service {
  private s3Client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(fileBuffer: Buffer, mimetype: string): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const fileKey = `${uuidv4()}.jpg`; 
  
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(mimetype)) {
      throw new Error('Invalid file type. Only PNG and JPEG are allowed.');
    }
  
    // Ensure that the file buffer is not empty
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty');
    }
  
    try {
      // Resize the image using sharp
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ height: 1000, width: 1920, fit: 'cover' })
        .toBuffer();
  
      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: resizedBuffer,
        ContentType: mimetype,
      };
  
      // Upload the resized image to S3
      await this.s3Client.send(new PutObjectCommand(uploadParams));
  
      return `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to process and upload image');
    }
  }
  
  async uploadAudio(fileBuffer: Buffer, mimetype: string): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const fileKey = `${uuidv4()}.mp3`; // Save audio files as .mp3
  
    try {
      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimetype,
      };
  
      await this.s3Client.send(new PutObjectCommand(uploadParams));
  
      return `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw new Error('Failed to upload audio');
    }
  }
  
  

  // Metode til at slette filer fra S3
  async deleteFile(s3Key: string): Promise<void> {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,  
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new Error('Failed to delete file from S3');
    }
  }
}