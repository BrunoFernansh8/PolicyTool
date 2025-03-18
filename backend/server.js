require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

const authenticateRoutes = require('./routes/authenticateRoutes');
const riskRoutes = require('./routes/riskRoutes');
const policyRoutes = require('./routes/policyRoutes');

// Routes
app.use('/api/auth', authenticateRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api', riskRoutes);


const frontendURL = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendURL));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendURL, "index.html"));
}
);

mongoose.set('strictQuery', false);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Database connection error:', err);
});


module.exports = app;

