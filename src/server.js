require('dotenv').config(); // <- Jangan lupa ini kalau pakai .env

const express = require('express');
const cors = require('cors');
const { db, initializeDatabase } = require('./db');
const userRoutes = require('./routes/users');
const profilRoutes = require('./routes/profil');
const riwayatRoutes = require('./routes/riwayat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use(cors({
  origin: '*', // ganti dengan frontend URL jika perlu
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware JSON & URL-encoded body
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    console.log('=== RAW BODY RECEIVED ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body length:', buf.length);
    console.log('Body preview:', buf.toString().substring(0, 200) + '...');
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware logging
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/riwayat', riwayatRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Hello from Nutriscan backend on Railway! 🎉');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== SERVER ERROR ===');
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Inisialisasi database dan mulai server
initializeDatabase()
  .then(() => {
    console.log('✅ Database berhasil diinisialisasi');
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal inisialisasi database:', err.message);
    process.exit(1);
  });
