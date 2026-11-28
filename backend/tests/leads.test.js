const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const StrategyRequest = require('../models/StrategyRequest');
const leadsRouter = require('../routes/leads');

const valid = () => ({
    contact_name: 'Asha Verma',
    email: 'asha@example.com',
    phone: '+91 98765 43210',
    company_name: 'Asha Sweets',
    website: 'ashasweets.in',
    city: 'Patna, Bihar',
    budget: '20,000 - 50,000',
    services: ['SEO / Local SEO', 'Social Media Management'],
    consent: true
});

describe('Strategy requests (/api/leads/strategy)', () => {
    let mongo, app;
    const realFetch = global.fetch;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri());
        app = express();
        app.use(express.json());
        app.use('/api/leads', leadsRouter);
    }, 60000);

    afterAll(async () => {
        global.fetch = realFetch;
        await mongoose.disconnect();
        await mongo.stop();
    });

    beforeEach(async () => {
        await StrategyRequest.deleteMany({});
        delete process.env.N8N_LEAD_WEBHOOK_URL;
        delete process.env.N8N_LEAD_WEBHOOK_SECRET;
        global.fetch = realFetch;
    });

    test('saves the enquiry with its consent record even when n8n is not configured', async () => {
        const res = await request(app).post('/api/leads/strategy').send(valid());
        expect(res.status).toBe(201);
        const doc = await StrategyRequest.findById(res.body.id).lean();
        expect(doc.contactName).toBe('Asha Verma');
        expect(doc.consent.given).toBe(true);
        expect(doc.consent.text).toBe(leadsRouter.CONSENT_TEXT);
        expect(doc.automation.state).toBe('not_configured');
    });

    test('rejects a request without consent and saves nothing', async () => {
        const res = await request(app).post('/api/leads/strategy').send({ ...valid(), consent: false });
        expect(res.status).toBe(400);
        expect(await StrategyRequest.countDocuments()).toBe(0);
    });

    test('rejects unknown services and budgets', async () => {
        expect((await request(app).post('/api/leads/strategy').send({ ...valid(), services: ['Hacking'] })).status).toBe(400);
        expect((await request(app).post('/api/leads/strategy').send({ ...valid(), budget: 'lots' })).status).toBe(400);
        expect((await request(app).post('/api/leads/strategy').send({ ...valid(), services: [] })).status).toBe(400);
    });

    test('forwards to n8n with the secret header and marks it sent', async () => {
        process.env.N8N_LEAD_WEBHOOK_URL = 'https://n8n.example.com/webhook/brandmark-lead';
        process.env.N8N_LEAD_WEBHOOK_SECRET = 's3cret';
        const calls = [];
        global.fetch = jest.fn(async (url, opts) => { calls.push({ url, opts }); return { ok: true, status: 200 }; });

        const res = await request(app).post('/api/leads/strategy').send(valid());
        expect(res.status).toBe(201);
        expect(calls).toHaveLength(1);
        expect(calls[0].url).toBe('https://n8n.example.com/webhook/brandmark-lead');
        expect(calls[0].opts.headers['x-webhook-secret']).toBe('s3cret');
        const sent = JSON.parse(calls[0].opts.body);
        expect(sent).toMatchObject({ contactName: 'Asha Verma', companyName: 'Asha Sweets', services: ['SEO / Local SEO', 'Social Media Management'] });
        expect((await StrategyRequest.findById(res.body.id)).automation.state).toBe('sent');
    });

    test('still answers 201 and keeps the enquiry when n8n is down', async () => {
        process.env.N8N_LEAD_WEBHOOK_URL = 'https://n8n.example.com/webhook/brandmark-lead';
        process.env.N8N_LEAD_WEBHOOK_SECRET = 's3cret';
        global.fetch = jest.fn(async () => ({ ok: false, status: 502 }));

        const res = await request(app).post('/api/leads/strategy').send(valid());
        expect(res.status).toBe(201);
        const doc = await StrategyRequest.findById(res.body.id);
        expect(doc.automation.state).toBe('failed');
        expect(doc.automation.lastError).toContain('502');
    });

    test('admin list needs a login', async () => {
        expect((await request(app).get('/api/leads/strategy')).status).toBe(401);
    });
});
