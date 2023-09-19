// server/express.js
const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.get(/\.(js|css|map|ico)$/, express.static(path.resolve(__dirname, '../dist')));

// Handle all other routes
app.use('*', (req, res) => {
  const filePath = path.resolve(__dirname, `../dist${req.url}`);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    res.contentType('text/html');
    res.status(200);
    return res.send(fileContent);
  } else {
    const indexHTML = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), { encoding: 'utf8' });
    res.contentType('text/html');
    res.status(200);
    return res.send(indexHTML);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server started at <http://localhost:${PORT}>`);
});
