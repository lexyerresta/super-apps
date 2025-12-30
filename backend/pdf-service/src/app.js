const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFDocument, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Cleanup helper
const cleanupFiles = (files) => {
    if (!files) return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        if (file && file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Cleanup error:', err);
            }
        }
    });
};

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'pdf-service',
        timestamp: new Date().toISOString()
    });
});

// Merge PDFs
app.post('/merge', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length < 2) {
        return res.status(400).json({ error: 'Please upload at least 2 PDF files' });
    }

    try {
        console.log(`Merging ${req.files.length} PDF files...`);
        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        cleanupFiles(req.files);

        console.log('Merge completed successfully');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Merge error:', error);
        cleanupFiles(req.files);
        res.status(500).json({ error: 'Failed to merge PDFs', message: error.message });
    }
});

// Split PDF
app.post('/split', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    try {
        console.log('Splitting PDF...');
        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();

        // For demo, split into individual pages
        const pages = [];
        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);
            const splitBytes = await newPdf.save();
            pages.push({
                page: i + 1,
                data: Buffer.from(splitBytes).toString('base64')
            });
        }

        cleanupFiles(req.file);
        console.log(`Split completed: ${pageCount} pages`);

        res.json({
            success: true,
            pageCount,
            pages: pages.slice(0, 5) // Return first 5 for demo
        });

    } catch (error) {
        console.error('Split error:', error);
        cleanupFiles(req.file);
        res.status(500).json({ error: 'Failed to split PDF', message: error.message });
    }
});

// Compress PDF
app.post('/compress', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    try {
        console.log('Compressing PDF...');
        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Basic compression by re-saving
        const compressedBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
        });

        const originalSize = pdfBytes.length;
        const compressedSize = compressedBytes.length;
        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        cleanupFiles(req.file);
        console.log(`Compression completed: ${savings}% reduction`);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Compressed-Size', compressedSize);
        res.setHeader('X-Savings-Percent', savings);
        res.send(Buffer.from(compressedBytes));

    } catch (error) {
        console.error('Compress error:', error);
        cleanupFiles(req.file);
        res.status(500).json({ error: 'Failed to compress PDF', message: error.message });
    }
});

// Get PDF info
app.post('/info', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    try {
        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const info = {
            pageCount: pdfDoc.getPageCount(),
            title: pdfDoc.getTitle(),
            author: pdfDoc.getAuthor(),
            subject: pdfDoc.getSubject(),
            creator: pdfDoc.getCreator(),
            producer: pdfDoc.getProducer(),
            size: pdfBytes.length,
            sizeFormatted: formatBytes(pdfBytes.length)
        };

        cleanupFiles(req.file);
        res.json(info);

    } catch (error) {
        console.error('Info error:', error);
        cleanupFiles(req.file);
        res.status(500).json({ error: 'Failed to read PDF info', message: error.message });
    }
});

// Helper function
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(port, () => {
    console.log(`PDF Service listening at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  POST /merge - Merge multiple PDFs');
    console.log('  POST /split - Split PDF into pages');
    console.log('  POST /compress - Compress PDF');
    console.log('  POST /info - Get PDF information');
    console.log('  GET /health - Health check');
});
