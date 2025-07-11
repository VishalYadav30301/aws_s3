import { Inject, Module } from '@nestjs/common';
import { S3BucketService } from './s3_bucket.service';
import { S3BucketController } from './s3_bucket.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
        throttlers:[{
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
        }]
      }),
    }),
  ],
  controllers: [S3BucketController],
  providers: [S3BucketService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class S3BucketModule {}
