require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


const authenticateRoutes = require('./routes/authenticateRoutes');
const riskRoutes = require('./routes/riskRoutes');
const policyRoutes = require('./routes/policyRoutes');

const PORT = process.env.PORT || 8000;

const frontendURL = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendURL));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendURL, "index.html"));
}
);

mongoose.set('strictQuery', false);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI ,{ 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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
app.use('/api', riskRoutes);
