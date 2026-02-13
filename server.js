const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hello World routes
app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

app.get('/hello', (req, res) => {
    res.json({ 
        message: 'Hello World', 
        timestamp: new Date(),
        server: 'Express.js'
    });
});

app.get('/hello/:name', (req, res) => {
    res.send(`Hello ${req.params.name}!`);
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Hello World Express Server listening on port ${port}`);
    console.log(`Visit http://localhost:${port}/ to see Hello World`);
});
