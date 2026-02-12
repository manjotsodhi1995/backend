const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;
let mongoose;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
        binary: {
            version: '4.0.28'
        }
    });

    const mongoUri = `${mongo.getUri()}testdb`;
    process.env.MONGODB_URI = mongoUri;

    // Clear module cache to ensure fresh connection
    delete require.cache[require.resolve('mongoose')];
    delete require.cache[require.resolve('../_helpers/db')];
    delete require.cache[require.resolve('../todos/todo.model')];
    delete require.cache[require.resolve('../todos/todo.service')];
    delete require.cache[require.resolve('../todos/todos.controller')];
    delete require.cache[require.resolve('../app')];

    mongoose = require('mongoose');
    app = require('../app')();

    // Wait for mongoose to connect
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);

        if (mongoose.connection.readyState === 1) {
            clearTimeout(timeout);
            resolve();
        } else {
            mongoose.connection.once('connected', () => {
                clearTimeout(timeout);
                resolve();
            });
            mongoose.connection.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        }
    });
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

test('POST/GET/PUT/DELETE /todos', async () => {
    const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Buy milk', description: '2% please' })
        .expect(201);

    expect(createRes.body).toMatchObject({
        title: 'Buy milk',
        description: '2% please',
        completed: false
    });
    expect(createRes.body.id).toBeTruthy();

    const id = createRes.body.id;

    const listRes = await request(app)
        .get('/todos')
        .expect(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].id).toBe(id);
    expect(listRes.body.pagination.total).toBe(1);

    const getRes = await request(app)
        .get(`/todos/${id}`)
        .expect(200);
    expect(getRes.body.title).toBe('Buy milk');

    const updateRes = await request(app)
        .put(`/todos/${id}`)
        .send({ completed: true })
        .expect(200);
    expect(updateRes.body.completed).toBe(true);

    await request(app)
        .delete(`/todos/${id}`)
        .expect(200);

    await request(app)
        .get(`/todos/${id}`)
        .expect(404);
});

test('POST /todos validates title', async () => {
    const res = await request(app)
        .post('/todos')
        .send({ description: 'missing title' })
        .expect(400);

    expect(res.body.message).toMatch(/Todo validation failed/i);
});

test('GET /todos supports pagination', async () => {
    // Create 15 todos
    for (let i = 1; i <= 15; i++) {
        await request(app)
            .post('/todos')
            .send({ title: `Todo ${i}`, description: `Description ${i}` })
            .expect(201);
    }

    // Test default pagination (page 1, limit 10)
    const defaultRes = await request(app)
        .get('/todos')
        .expect(200);

    expect(defaultRes.body).toHaveProperty('data');
    expect(defaultRes.body).toHaveProperty('pagination');
    expect(defaultRes.body.data).toHaveLength(10);
    expect(defaultRes.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNext: true,
        hasPrev: false
    });

    // Test page 2
    const page2Res = await request(app)
        .get('/todos?page=2&limit=10')
        .expect(200);

    expect(page2Res.body.data).toHaveLength(5);
    expect(page2Res.body.pagination).toMatchObject({
        page: 2,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNext: false,
        hasPrev: true
    });

    // Test custom limit
    const customLimitRes = await request(app)
        .get('/todos?page=1&limit=5')
        .expect(200);

    expect(customLimitRes.body.data).toHaveLength(5);
    expect(customLimitRes.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNext: true,
        hasPrev: false
    });
});

