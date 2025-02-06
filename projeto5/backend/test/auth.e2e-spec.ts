import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let connection: Connection;

  let userToken: string;
  let adminToken: string;
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // Limpa todo o DB para evitar duplicidade e resíduos
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await connection.dropDatabase();

    // 1) Cria user "normalUser"
    await request(server)
      .post('/auth/register')
      .send({ username: 'normalUser', password: '123', role: 'user' })
      .expect(HttpStatus.CREATED);

    // 2) Loga user
    const userLogin = await request(server)
      .post('/auth/login')
      .send({ username: 'normalUser', password: '123' })
      .expect(HttpStatus.CREATED);
    userToken = userLogin.body.access_token;

    // 3) Cria admin "adminUser"
    await request(server)
      .post('/auth/register')
      .send({ username: 'adminUser', password: '123', role: 'admin' })
      .expect(HttpStatus.CREATED);

    // 4) Loga admin
    const adminLogin = await request(server)
      .post('/auth/login')
      .send({ username: 'adminUser', password: '123' })
      .expect(HttpStatus.CREATED);
    adminToken = adminLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (GET) - deve falhar se não tiver token', async () => {
    return request(server)
      .get('/products')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/products (GET) - deve retornar lista se tiver token do USER', async () => {
    return request(server)
      .get('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products (POST) - deve falhar se USER tentar criar (403)', async () => {
    return request(server)
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      // stock e description obrigatórios (seu schema)
      .send({ name: 'ProductX', price: 999, stock: 10, description: 'desc X' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/products (POST) - deve criar produto se for ADMIN', async () => {
    return request(server)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      // Envie todos os campos obrigatórios
      .send({ name: 'ProductX', price: 999, stock: 10, description: 'descX' })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        createdProductId = res.body._id;
        expect(res.body.name).toBe('ProductX');
        expect(res.body.price).toBe(999);
      });
  });

  it('/products/:id (PUT) - deve atualizar produto se for ADMIN', async () => {
    return request(server)
      .put(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProductY', price: 888, stock: 999, description: 'descY' })
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.name).toBe('ProductY');
        expect(res.body.price).toBe(888);
      });
  });

  it('/products/:id (DELETE) - deve remover produto se for ADMIN', async () => {
    return request(server)
      .delete(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        // Se o service/controller retorna o doc deletado,
        // checamos a consistência desses dados:
        expect(res.body._id).toBe(createdProductId);
        expect(res.body.name).toBe('ProductY');
      });
  });
});
