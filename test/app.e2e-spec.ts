import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Since we haven't defined a root Get('/') controller in AppModule, 
  // this is just an example check. 
  // Usually, you would test /v1/auth/login or similar endpoints here.
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404); // Expect 404 because we have no root route defined, confirming app is running
  });
});