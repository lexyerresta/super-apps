import { PDFDocument } from 'pdf-lib';

export interface PDFMergeOptions {
    files: File[];
}

export interface PDFSplitOptions {
    file: File;
    pageRanges?: number[][]; // e.g., [[1,3], [5,7]]
}

export interface PDFCompressOptions {
    file: File;
    quality?: 'low' | 'medium' | 'high';
}

export interface PDFInfo {
    pageCount: number;
    title: string | undefined;
    author: string | undefined;
    subject: string | undefined;
    creator: string | undefined;
    producer: string | undefined;
    size: number;
    sizeFormatted: string;
    creationDate?: Date;
    modificationDate?: Date;
}

export interface ProcessingResult {
    success: boolean;
    data?: any;
    error?: string;
    metadata?: Record<string, any>;
}

export class PDFService {
    /**
     * Merge multiple PDF files into one
     */
    static async merge(options: PDFMergeOptions): Promise<Uint8Array> {
        const { files } = options;

        if (!files || files.length < 2) {
            throw new Error('At least 2 PDF files are required for merging');
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page: any) => mergedPdf.addPage(page));
        }

        return await mergedPdf.save();
    }

    /**
     * Split PDF into individual pages or ranges
     */
    static async split(options: PDFSplitOptions): Promise<{
        pageCount: number;
        pages: Array<{ page: number; size: number; data?: string }>;
    }> {
        const { file, pageRanges } = options;

        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();

        const pages = [];

        // If no ranges specified, split all pages
        const ranges = pageRanges || Array.from({ length: pageCount }, (_, i) => [i, i]);

        for (let i = 0; i < Math.min(ranges.length, 10); i++) {
            const [startPage, endPage] = ranges[i];
            const newPdf = await PDFDocument.create();

            for (let pageNum = startPage; pageNum <= Math.min(endPage, pageCount - 1); pageNum++) {
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum]);
                newPdf.addPage(copiedPage);
            }

            const splitBytes = await newPdf.save();
            pages.push({
                page: i + 1,
                size: splitBytes.length,
                // Only include data for first page to avoid large responses
                data: i === 0 ? Buffer.from(splitBytes).toString('base64') : undefined
            });
        }

        return { pageCount, pages };
    }

    /**
     * Compress PDF by optimizing and removing unnecessary data
     */
    static async compress(options: PDFCompressOptions): Promise<{
        compressed: Uint8Array;
        originalSize: number;
        compressedSize: number;
        savingsPercent: number;
    }> {
        const { file, quality = 'medium' } = options;

        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Compression settings based on quality
        const compressionSettings = {
            low: { useObjectStreams: true, addDefaultPage: false },
            medium: { useObjectStreams: true, addDefaultPage: false },
            high: { useObjectStreams: false, addDefaultPage: false }
        };

        const settings = compressionSettings[quality];
        const compressedBytes = await pdfDoc.save(settings);

        const originalSize = pdfBytes.length;
        const compressedSize = compressedBytes.length;
        const savingsPercent = Number(((1 - compressedSize / originalSize) * 100).toFixed(1));

        return {
            compressed: compressedBytes,
            originalSize,
            compressedSize,
            savingsPercent
        };
    }

    /**
     * Get PDF metadata and information
     */
    static async getInfo(file: File): Promise<PDFInfo> {
        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        return {
            pageCount: pdfDoc.getPageCount(),
            title: pdfDoc.getTitle(),
            author: pdfDoc.getAuthor(),
            subject: pdfDoc.getSubject(),
            creator: pdfDoc.getCreator(),
            producer: pdfDoc.getProducer(),
            size: pdfBytes.length,
            sizeFormatted: this.formatBytes(pdfBytes.length),
            creationDate: pdfDoc.getCreationDate(),
            modificationDate: pdfDoc.getModificationDate()
        };
    }

    /**
     * Format bytes to human readable size
     */
    private static formatBytes(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    /**
     * Validate PDF file
     */
    static async validate(file: File): Promise<{ valid: boolean; error?: string }> {
        try {
            if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
                return { valid: false, error: 'File must be a PDF' };
            }

            if (file.size === 0) {
                return { valid: false, error: 'File is empty' };
            }

            if (file.size > 50 * 1024 * 1024) {
                return { valid: false, error: 'File size must be less than 50MB' };
            }

            // Try to load the PDF to validate it
            const arrayBuffer = await file.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);
            await PDFDocument.load(pdfBytes);

            return { valid: true };
        } catch (error: any) {
            return { valid: false, error: error.message || 'Invalid PDF file' };
        }
    }
}
