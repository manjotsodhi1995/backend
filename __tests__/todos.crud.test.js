const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();

    // Ensure we connect to the in-memory server for tests
    jest.resetModules();
    app = require('../app')();

    // Wait for mongoose to connect
    await mongoose.connection.asPromise();
});

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
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(id);

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

