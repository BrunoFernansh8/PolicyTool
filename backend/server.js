const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticateRoutes');
const riskRoutes = require('./routes/riskRoutes');
const policyRoutes = require('./routes/policyRoutes');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cloudRiskDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authenticateRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/policy', policyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
