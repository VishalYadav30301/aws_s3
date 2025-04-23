import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3BucketService } from './s3_bucket.service';

@Controller()
export class S3BucketController {
  private readonly logger = new Logger(S3BucketController.name);
  constructor(private readonly S3BucketService: S3BucketService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log('Received request to upload file ' + file);
    return this.S3BucketService.uploadFile(file);
  }

  @Get('list')
  async listObjects(): Promise<any> {
    this.logger.log('Listing content of bucket ');
    let responseData = await this.S3BucketService.listObject();
    this.logger.log('Response Data ' + responseData);
    return responseData;
  }

  @Get('download')
  async getObjects(): Promise<any> {
    this.logger.log('Downloading file from s3 bucket ');
    let responseData = await this.S3BucketService.downloadFile();
    this.logger.log('Response Data ' + responseData);
    return responseData;
  }

  @Get('signed-url')
  async getSignedUploadUrl(): Promise<any> {
    this.logger.log('Generating signed URL for file');

    const key = 'example-file.txt';
    const contentType = 'text/plain';
    const expiresIn = 3600;

    const responseData = await this.S3BucketService.getSignedUploadUrl(
      key,
      contentType,
      expiresIn,
    );
    this.logger.log('Response Data ' + responseData);
    return responseData;
  }

  @Get('download-url')
  async getDownloadUrl(@Query('key') key: string): Promise<any> {
    this.logger.log(`Generating download URL for file: ${key}`);
    const expiresIn = 3600;
    const responseData = await this.S3BucketService.getDownloadUrl(
      key,
      expiresIn,
    );
    this.logger.log('Response Data ' + responseData);
    return responseData;
   }
   
  @Get('delete')
  async deleteObject(@Query('key') key  : string): Promise<any> {
    this.logger.log(`Deleting file: ${key}`);
    const responseData = await this.S3BucketService.deleteObject(key);
    this.logger.log('Response Data ' + responseData);
    return responseData;
  }



}
