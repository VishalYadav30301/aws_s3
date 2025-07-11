import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3BucketModule } from './s3_bucket/s3_bucket.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [S3BucketModule,
   ConfigModule.forRoot({isGlobal:true})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
