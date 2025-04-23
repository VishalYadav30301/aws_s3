import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3BucketModule } from './s3_bucket/s3_bucket.module';

@Module({
  imports: [S3BucketModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
