const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

// PDF Service proxy
app.use('/api/pdf', createProxyMiddleware({
    target: process.env.PDF_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/pdf': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[PDF] ${req.method} ${req.path}`);
    },
    onError: (err, req, res) => {
        console.error('PDF Service Error:', err);
        res.status(503).json({ error: 'PDF service unavailable' });
    }
}));

// Media Service proxy
app.use('/api/media', createProxyMiddleware({
    target: process.env.MEDIA_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/media': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[MEDIA] ${req.method} ${req.path}`);
    },
    onError: (err, req, res) => {
        console.error('Media Service Error:', err);
        res.status(503).json({ error: 'Media service unavailable' });
    }
}));

// Service status endpoint
app.get('/api/status', async (req, res) => {
    const services = {
        pdf: process.env.PDF_SERVICE_URL || 'http://localhost:3001',
        media: process.env.MEDIA_SERVICE_URL || 'http://localhost:3002'
    };

    const statuses = {};

    for (const [name, url] of Object.entries(services)) {
        try {
            const response = await fetch(`${url}/health`);
            statuses[name] = await response.json();
        } catch (error) {
            statuses[name] = { status: 'error', error: error.message };
        }
    }

    res.json({
        gateway: 'ok',
        services: statuses,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`API Gateway listening at http://localhost:${port}`);
    console.log('Routes:');
    console.log('  /api/pdf/* -> PDF Service');
    console.log('  /api/media/* -> Media Service');
    console.log('  GET /api/status - Service status');
    console.log('  GET /health - Gateway health');
});
