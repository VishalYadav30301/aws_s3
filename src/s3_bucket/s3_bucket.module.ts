import { Module } from '@nestjs/common';
import { S3BucketService } from './s3_bucket.service';
import { S3BucketController } from './s3_bucket.controller';

@Module({
  controllers: [S3BucketController],
  providers: [S3BucketService],
})
export class S3BucketModule {}
