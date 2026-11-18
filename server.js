const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get('/api/random', (req, res) => {
  const minRaw = req.query.min;
  const maxRaw = req.query.max;

  const min = minRaw === undefined ? 1 : Number(minRaw);
  const max = maxRaw === undefined ? 100 : Number(maxRaw);

  const isValid =
    Number.isFinite(min) &&   
    Number.isFinite(max) &&
    min > 0 &&                 
    max > 0 &&
    max > min;                 

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  res.json({
    number,
    range: [min, max],
    timestamp: new Date().toISOString()
  });
});


app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});


try {
  const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Открой в браузере: http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Порт ${PORT} уже занят. Закрой другой сервер или смени PORT.`);
    } else {
      console.error('Ошибка сервера:', err);
    }
    process.exit(1);
  });
} catch (err) {
  console.error('Не удалось запустить сервер:', err);
  process.exit(1);
}