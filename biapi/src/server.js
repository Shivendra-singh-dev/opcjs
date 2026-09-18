import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import contactsRoutes from './routes/contact.routes.js';
import elRoutes from './routes/quiz.routes.js';
import userRoutes from './routes/user.routes.js';
import slibRoutes from './routes/smart-library.routes.js';
import slidersRoutes from './routes/slider.routes.js';
import pageRoutes from './routes/page.routes.js';
import panCardRoutes from './routes/pancard.routes.js';
import airoutes from './routes/airoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// CORS (allow credentials if using cookies)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // or your frontend URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');   // needed for session cookies
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
});

// ✅ **Add session middleware here** – BEFORE any routes that use session
app.use(session({
    secret: process.env.SESSION_SECRET || 'shiva123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,          // set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/el', elRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slib', slibRoutes);
app.use('/api/sliders', slidersRoutes);
app.use('/api/pagedt', pageRoutes);
app.use('/api/pancard', panCardRoutes);
app.use('/api/ai',airoutes); 

// ---------- Global Error Handling ----------
app.use((req, res, next) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'public', 'error.html'));
    } else {
        res.json({ success: false, message: 'Endpoint not found' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'public', 'error.html'));
    } else {
        res.json({ success: false, message: err.message || 'Internal Server Error' });
    }
});



app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});