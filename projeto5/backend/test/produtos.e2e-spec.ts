// test/products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userToken: string; // se precisar de token do USER
  let adminToken: string; // se precisar de token do ADMIN
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // Você pode criar alguns usuários e obter tokens para teste
    // Por exemplo, cria um user e um admin, e guarda o token

    // 1) Cria user
    await request(server)
      .post('/auth/register')
      .send({ username: 'normalUser', password: '123', role: 'user' });

    // 2) Loga user e armazena token
    const userLogin = await request(server)
      .post('/auth/login')
      .send({ username: 'normalUser', password: '123' });

    userToken = userLogin.body.access_token;

    // 3) Cria admin
    await request(server)
      .post('/auth/register')
      .send({ username: 'adminUser', password: '123', role: 'admin' });

    // 4) Loga admin e armazena token
    const adminLogin = await request(server)
      .post('/auth/login')
      .send({ username: 'adminUser', password: '123' });

    adminToken = adminLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (GET) - deve falhar se não tiver token', async () => {
    return request(server)
      .get('/products')
      .expect(401);
  });

  it('/products (GET) - deve retornar lista de produtos se tiver token do USER', async () => {
    return request(server)
      .get('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products (POST) - deve falhar se USER tentar criar um produto (403)', async () => {
    return request(server)
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'ProductX', price: 999 })
      .expect(403); // pois o guard RolesGuard deve bloquear
  });

  it('/products (POST) - deve criar produto se for ADMIN', async () => {
    return request(server)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProductX', price: 999 })
      .expect(201)
      .then((res) => {
        createdProductId = res.body._id;  // suponto que retorne _id
        expect(res.body.name).toBe('ProductX');
      });
  });

  it('/products/:id (PUT) - deve atualizar produto se for ADMIN', async () => {
    return request(server)
      .put(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProductY', price: 888 })
      .expect(200)
      .then((res) => {
        expect(res.body.name).toBe('ProductY');
        expect(res.body.price).toBe(888);
      });
  });

  it('/products/:id (DELETE) - deve remover produto se for ADMIN', async () => {
    return request(server)
      .delete(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({ acknowledged: true });
      });
  });
});
