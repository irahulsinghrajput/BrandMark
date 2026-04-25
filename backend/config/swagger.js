/**
 * Swagger/OpenAPI Documentation for BrandMark API
 * Usage: Install swagger-ui-express and swagger-jsdoc
 * npm install swagger-ui-express swagger-jsdoc
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BrandMark Solutions API',
            version: '1.0.0',
            description: 'Backend API for BrandMark digital marketing course platform',
            contact: {
                name: 'BrandMark Support',
                email: 'support@brandmarksolutions.site'
            }
        },
        servers: [
            {
                url: 'https://brandmark-backend.onrender.com/api',
                description: 'Production Server'
            },
            {
                url: 'http://localhost:5001/api',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string'
                        },
                        errorCode: {
                            type: 'string'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Course: {
                    type: 'object',
                    required: ['title', 'category', 'level', 'moduleNumber'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        slug: {
                            type: 'string'
                        },
                        description: {
                            type: 'string'
                        },
                        category: {
                            type: 'string',
                            enum: ['Foundation', 'Content & Copywriting', 'Paid Advertising', 'Social Media & Influencer', 'Advanced Strategy']
                        },
                        level: {
                            type: 'string',
                            enum: ['Beginner', 'Intermediate', 'Advanced', 'Capstone']
                        },
                        duration: {
                            type: 'number'
                        },
                        moduleNumber: {
                            type: 'number'
                        },
                        isPublished: {
                            type: 'boolean'
                        },
                        enrollmentCount: {
                            type: 'number'
                        },
                        avgRating: {
                            type: 'number'
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        orderId: {
                            type: 'string'
                        },
                        amount: {
                            type: 'number'
                        },
                        currency: {
                            type: 'string'
                        },
                        keyId: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'] // Path to route files with JSDoc comments
};

const specs = swaggerJsdoc(options);

module.exports = specs;
