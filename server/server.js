const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

// Load routes
// app.use('/api/bikeActions', require('./routes/bikeActions'));
app.use('/api/rent', require('./routes/rent'));
app.use('/api/reserve', require('./routes/reserve'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/pay', require('./routes/pay'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});