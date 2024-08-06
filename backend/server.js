require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  carbonFootprint: [{
    date: Date,
    emission: Number
  }]
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error('Error in /api/register:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.send(user);
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error in /api/login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/carbon-footprint', async (req, res) => {
  try {
    const { email, emission } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.carbonFootprint.push({ date: new Date(), emission });
      await user.save();
      res.send(user);
    } else {
      res.status(400).send('User not found');
    }
  } catch (error) {
    console.error('Error in /api/carbon-footprint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/carbon-footprint/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      res.send(user.carbonFootprint);
    } else {
      res.status(400).send('User not found');
    }
  } catch (error) {
    console.error('Error in /api/carbon-footprint/:email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/check', (req, res) => {
  res.json({ message: 'Data received from backend' });
});

const port = process.env.PORT || 5006;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
