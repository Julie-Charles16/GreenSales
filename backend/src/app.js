const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
// Middleware
app.use(express.json());
app.use(cors());
// Routes
const authRoutes = require('./routes/authRoute');
const clientRoutes = require('./routes/clientRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const saleRoutes = require('./routes/saleRoute');

app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/sales', saleRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API GreenSales OK');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});