import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface ProfileResponse {
  phone: string;
}

interface BusinessResponse {
  name: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    [key: string]: unknown;
  };
}

describe('App (E2E)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/auth/login (POST) - Success', () => {
      return request(app.getHttpServer() as string)
        .post('/auth/login')
        .send({
          phone: '0901111111',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          const body = res.body as AuthResponse;
          expect(body.access_token).toBeDefined();
          authToken = body.access_token;
        });
    });

    it('/auth/profile (GET) - Success', () => {
      return request(app.getHttpServer() as string)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as ProfileResponse;
          expect(body.phone).toBe('0901111111');
        });
    });
  });

  describe('Businesses', () => {
    it('/businesses/my-business (GET) - Success', () => {
      return request(app.getHttpServer() as string)
        .get('/businesses/my-business')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as BusinessResponse;
          expect(body.name).toBe('ACTA Corp');
        });
    });
  });

  describe('Brands', () => {
    it('/brands/my-brands (GET) - Success with pagination', () => {
      return request(app.getHttpServer() as string)
        .get('/brands/my-brands?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as PaginatedResponse<unknown>;
          expect(body.data).toBeDefined();
          expect(body.data.length).toBeLessThanOrEqual(5);
          expect(body.meta).toBeDefined();
          expect(body.meta.currentPage).toBe(1);
        });
    });
  });
});
