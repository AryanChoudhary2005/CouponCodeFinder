const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/proxy', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.head(url, { maxRedirects: 5 });
        res.json({ resolvedUrl: response.request.res.responseUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve URL' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
