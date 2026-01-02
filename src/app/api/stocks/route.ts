import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Selalu real-time

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');

    if (!symbols) {
        return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
    }

    try {
        // Yahoo Finance v7 API supports batch requests via comma-separated symbols
        // Example: https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT,GOOGL
        const response = await fetch(
            `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    // User-Agent penting agar tidak diblokir Yahoo
                },
                next: { revalidate: 10 } // Cache selama 10 detik agar super cepat tapi tetap fresh
            }
        );

        if (!response.ok) {
            throw new Error(`Yahoo Finance API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform data agar lebih mudah dikonsumsi frontend
        // Yahoo returns { quoteResponse: { result: [...] } }
        const quotes = data.quoteResponse?.result || [];

        return NextResponse.json({ items: quotes });

    } catch (error: any) {
        console.error('Stock fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stock data', details: error.message },
            { status: 500 }
        );
    }
}
