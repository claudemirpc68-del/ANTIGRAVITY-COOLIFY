const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');

beforeAll(async () => {
    // Sync database and force clear tables
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Clients API', () => {
    it('should create a new client', async () => {
        const res = await request(app)
            .post('/api/clients')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John Doe');
    });

    it('should not create a client with existing email', async () => {
        const res = await request(app)
            .post('/api/clients')
            .send({
                name: 'Jane Doe',
                email: 'john@example.com', // Same email
                phone: '0987654321'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Email already exists');
    });

    it('should list all clients', async () => {
        const res = await request(app).get('/api/clients');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
