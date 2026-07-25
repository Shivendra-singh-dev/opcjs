import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import contactsRoutes from './routes/contacts.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'CRUD API Server',
        version: '1.0.0',
        endpoints: {
            products: '/api/products'
        }
    });
});

// Product CRUD API
app.use('/api/products', productRoutes);

// Contacts API
app.use('/api/contacts', contactsRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API Documentation: http://localhost:${PORT}/api/products`);
});