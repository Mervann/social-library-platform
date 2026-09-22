const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./src/models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Social Library API is running');
});

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);

// Sync DB and Start Server
sequelize.sync({ force: false }) // Set force: true to drop tables on restart
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
