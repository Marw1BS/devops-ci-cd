const express = require('express');
const app = express();
const port = 4000;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
app.get('/', (req, res) => {
  res.send('Backend root route: try /api');
});

