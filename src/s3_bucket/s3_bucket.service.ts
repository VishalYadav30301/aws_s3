import { Injectable, Req, Res, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3BucketService {
  private readonly logger = new Logger(S3BucketService.name);
  private readonly AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  private readonly s3: S3Client;

  constructor() {
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ) {
      throw new Error('AWS credentials are not properly configured');
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file) {
    this.logger.log('uploading file ' + file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };
    try {
      const command = new PutObjectCommand(params);
      const s3Response = await this.s3.send(command);
      this.logger.log('Uploaded file successfully to s3 bucket!! ');
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async listObject(): Promise<any> {
    this.logger.log('Listing objects in S3 bucket');
    if (!this.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET is not defined in the environment variables');
    }
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Delimiter: '/',
    };
    const command = new ListObjectsV2Command(params);
    const result = await this.s3.send(command);
    console.log('List object: ' + JSON.stringify(result));
    return result;
  }

  async downloadFile() {
    this.logger.log('Downloading file from S3 bucket ');
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: 'example-file.txt',
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(this.s3, command, { expiresIn: 36000 });
    console.log('Url to download file: ' + url);
    return url;
  }

  async getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET is not defined');
    }
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn });
      this.logger.log(`Generated download URL for ${key}`);
      return url;
    } catch (e) {
      this.logger.error('Error generating download URL', e);
      throw e;
    }
  }

  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!this.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET is not defined');
    }
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(params);
    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn });
      this.logger.log(`Generated upload URL for ${key}`);
      return url;
    } catch (e) {
      this.logger.error('Error generating upload URL', e);
      throw e;
    }
  }
  async deleteObject(key: string): Promise<any> {
    this.logger.log(`Deleting file: ${key}`);
    if (!this.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET is not defined');
    }
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    try {
      const response = await this.s3.send(command);
      this.logger.log(`Deleted file ${key} successfully`);
      return response;
    } catch (e) {
      this.logger.error('Error deleting file', e);
      throw e;
    }
  }
}
