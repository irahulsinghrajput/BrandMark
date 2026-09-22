const express = require('express');
const request = require('supertest');
const chatRouter = require('../routes/chat');
const { getIntelligentReply } = require('../routes/chat');

describe('Chat API Route (/api/chat)', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRouter);
  });

  describe('Local Knowledge Engine (getIntelligentReply)', () => {
    test('routes WhatsApp queries to contact information', () => {
      const reply = getIntelligentReply('What is your WhatsApp number?');
      expect(reply).toContain('WhatsApp/Call: +91 7091863003');
    });

    test('routes job application queries to careers', () => {
      const reply = getIntelligentReply('How do I apply for a job?');
      expect(reply).toContain('careers');
    });

    test('handles questions that start with a greeting without dropping the question', () => {
      const reply = getIntelligentReply('Hi, what are your services?');
      expect(reply).toContain('full-service digital agency');
    });

    test('responds with greeting for pure greetings', () => {
      const reply = getIntelligentReply('Hello Mark!');
      expect(reply).toContain("I'm Mark, your BrandMark AI Assistant");
    });

    test('routes quote/cost queries to pricing', () => {
      const reply = getIntelligentReply('How much does a website cost?');
      expect(reply).toContain('Contact Page: https://www.brandmarksolutions.site/contact');
    });

    test('routes web/MERN queries to web development', () => {
      const reply = getIntelligentReply('Do you develop React and Node.js applications?');
      expect(reply).toContain('React, Next.js, Node.js');
    });

    test('routes marketing queries to digital marketing', () => {
      const reply = getIntelligentReply('Can you run Google Ads and SEO for our brand?');
      expect(reply).toContain('high-ROAS Meta & Google advertising');
    });

    test('safely handles non-string and empty inputs without crashing', () => {
      expect(() => getIntelligentReply(123)).not.toThrow();
      expect(() => getIntelligentReply(null)).not.toThrow();
      expect(() => getIntelligentReply(undefined)).not.toThrow();
      expect(() => getIntelligentReply({})).not.toThrow();
    });
  });

  describe('HTTP POST /api/chat Endpoint', () => {
    test('returns default greeting when message is empty or missing', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.status).toBe(200);
      expect(res.body.reply).toContain("I'm Mark");
    });

    test('returns default greeting when message is non-string', async () => {
      const res = await request(app).post('/api/chat').send({ message: 12345 });
      expect(res.status).toBe(200);
      expect(res.body.reply).toContain("I'm Mark");
    });

    test('handles valid user query and returns reply with provider', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is your contact phone number?' });
      expect(res.status).toBe(200);
      expect(res.body.reply).toContain('+91 7091863003');
      expect(res.body.provider).toBeDefined();
    });

    test('processes optional conversation history without error', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({
          message: 'What services do you offer?',
          history: [
            { role: 'user', text: 'Hello' },
            { role: 'ai', text: 'Hi! How can I help?' }
          ]
        });
      expect(res.status).toBe(200);
      expect(res.body.reply).toContain('full-service digital agency');
    });
  });
});
