const request = require('supertest');
const app = require('../src/app');

describe('Health check', () => {
  test('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('Auth routes', () => {
  test('POST /auth/register creates a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User registered');
  });

  test('POST /auth/login returns a token', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'loginuser', password: 'pass123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'pass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /auth/login fails with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
});

describe('Products routes', () => {
  test('GET /products returns array', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /products adds a product', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Test Product', price: 9.99, description: 'A test item' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Product');
  });
});

describe('Orders routes', () => {
  test('GET /orders returns array', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /orders places an order', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ productId: 'prod_001', quantity: 2, userId: 'user_001' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Order placed');
  });
});