const express = require('express');
const app = express();

// Hello World route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Hello World Express server listening on port ${port}`);
});
