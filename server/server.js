const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});
*/

// Load routes
app.use('/api/action', require('./routes/bikeActions'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});