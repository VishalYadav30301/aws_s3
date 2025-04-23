import { Test, TestingModule } from '@nestjs/testing';
import { S3BucketController } from './s3_bucket.controller';
import { S3BucketService } from './s3_bucket.service';

describe('S3BucketController', () => {
  let controller: S3BucketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3BucketController],
      providers: [S3BucketService],
    }).compile();

    controller = module.get<S3BucketController>(S3BucketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
