import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // Limpa todo o banco para evitar duplicidade de usuários
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - deve registrar um usuário', async () => {
    return request(server)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass', role: 'user' })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.username).toBe('testuser');
        expect(res.body.role).toBe('user');
      });
  });

  it('/auth/login (POST) - deve logar e retornar token JWT', async () => {
    return request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
