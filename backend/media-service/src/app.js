const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3002;

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'media-service',
        timestamp: new Date().toISOString()
    });
});

// Audio conversion
app.post('/convert/audio', upload.single('file'), (req, res) => {
    const targetFormat = req.body.format;
    const bitrate = req.body.bitrate || '192k';

    if (!req.file || !targetFormat) {
        return res.status(400).json({ error: 'File and target format are required' });
    }

    const inputPath = req.file.path;
    const outputPath = `uploads/${req.file.filename}.${targetFormat}`;

    console.log(`Converting audio to ${targetFormat} at ${bitrate}...`);

    ffmpeg(inputPath)
        .toFormat(targetFormat)
        .audioBitrate(bitrate)
        .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
            console.log('Audio conversion completed');
            res.download(outputPath, `converted.${targetFormat}`, (err) => {
                if (err) console.error(err);
                // Cleanup
                fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Audio conversion error:', err.message);
            fs.unlinkSync(inputPath);
            res.status(500).json({ error: 'Audio conversion failed', message: err.message });
        })
        .save(outputPath);
});

// Video conversion
app.post('/convert/video', upload.single('file'), (req, res) => {
    const targetFormat = req.body.format;
    const quality = req.body.quality || 'medium'; // low, medium, high

    if (!req.file || !targetFormat) {
        return res.status(400).json({ error: 'File and target format are required' });
    }

    const inputPath = req.file.path;
    const outputPath = `uploads/${req.file.filename}.${targetFormat}`;

    console.log(`Converting video to ${targetFormat} at ${quality} quality...`);

    // Quality presets
    const qualitySettings = {
        low: { videoBitrate: '500k', audioBitrate: '96k' },
        medium: { videoBitrate: '1000k', audioBitrate: '128k' },
        high: { videoBitrate: '2500k', audioBitrate: '192k' }
    };

    const settings = qualitySettings[quality] || qualitySettings.medium;

    ffmpeg(inputPath)
        .toFormat(targetFormat)
        .videoBitrate(settings.videoBitrate)
        .audioBitrate(settings.audioBitrate)
        .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
            console.log('Processing: ' + Math.round(progress.percent || 0) + '% done');
        })
        .on('end', () => {
            console.log('Video conversion completed');
            res.download(outputPath, `converted.${targetFormat}`, (err) => {
                if (err) console.error(err);
                // Cleanup
                fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Video conversion error:', err.message);
            fs.unlinkSync(inputPath);
            res.status(500).json({ error: 'Video conversion failed', message: err.message });
        })
        .save(outputPath);
});

// Get media info
app.post('/info', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a media file' });
    }

    ffmpeg.ffprobe(req.file.path, (err, metadata) => {
        fs.unlinkSync(req.file.path);

        if (err) {
            console.error('Info error:', err);
            return res.status(500).json({ error: 'Failed to read media info', message: err.message });
        }

        const info = {
            format: metadata.format.format_name,
            duration: metadata.format.duration,
            size: metadata.format.size,
            bitrate: metadata.format.bit_rate,
            streams: metadata.streams.map(s => ({
                type: s.codec_type,
                codec: s.codec_name,
                bitrate: s.bit_rate
            }))
        };

        res.json(info);
    });
});

// Extract audio from video
app.post('/extract-audio', upload.single('file'), (req, res) => {
    const format = req.body.format || 'mp3';

    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a video file' });
    }

    const inputPath = req.file.path;
    const outputPath = `uploads/${req.file.filename}.${format}`;

    console.log(`Extracting audio as ${format}...`);

    ffmpeg(inputPath)
        .noVideo()
        .toFormat(format)
        .audioBitrate('192k')
        .on('end', () => {
            console.log('Audio extraction completed');
            res.download(outputPath, `audio.${format}`, (err) => {
                if (err) console.error(err);
                fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Extraction error:', err.message);
            fs.unlinkSync(inputPath);
            res.status(500).json({ error: 'Audio extraction failed', message: err.message });
        })
        .save(outputPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(port, () => {
    console.log(`Media Service listening at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  POST /convert/audio - Convert audio files');
    console.log('  POST /convert/video - Convert video files');
    console.log('  POST /extract-audio - Extract audio from video');
    console.log('  POST /info - Get media information');
    console.log('  GET /health - Health check');
});
