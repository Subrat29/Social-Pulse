require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const flowRoutes = require('./src/routes/flowRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', flowRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('Langflow Integration API is running.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
