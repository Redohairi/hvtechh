// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    // Cria um módulo de teste com a AppModule real
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Inicializa a Nest application
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  // Exemplo de teste de registro de usuário
  it('/auth/register (POST) - deve registrar um usuário', async () => {
    return request(server)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass', role: 'user' })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');  // Supondo que retorne o _id
        expect(res.body.username).toBe('testuser');
        // etc.
      });
  });

  // Exemplo de teste de login
  it('/auth/login (POST) - deve logar e retornar token JWT', async () => {
    // Primeiro, precisamos ter certeza de que o usuário foi criado
    // (podemos reaproveitar a chamada anterior ou criar outro).
    // Pra simplificar, vamos tentar logar com o mesmo user:

    return request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
        // Armazene esse token se quiser usar em outros testes, 
        // p. ex. com let token = res.body.access_token;
      });
  });
});
