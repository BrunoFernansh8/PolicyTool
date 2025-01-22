require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

const authenticateRoutes = require('./routes/authenticateRoutes');
const riskRoutes = require('./routes/riskRoutes');
const policyRoutes = require('./routes/policyRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.set('strictQuery', false);
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cloudRiskDB')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('Database connection error:', err);
});

// Routes
app.use('/api/auth', authenticateRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/risk', riskRoutes);
