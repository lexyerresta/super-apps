# SuperApps - Premium API-Powered Mini Apps

A modern, high-performance Next.js platform featuring 14 curated "Super Apps" powered by real-time open-source APIs. Designed with a premium glassmorphism UI/UX, focusing on quality over quantity.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Apps](https://img.shields.io/badge/apps-14-success)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **14 Premium Super Apps** - Curated selection of high-utility tools
- **Real-Time Data** - Live stock markets, crypto prices, and weather
- **Open API Powered** - Leveraging the best public APIs available
- **Glassmorphism UI** - Stunning modern interface with advanced micro-interactions
- **Lightning Fast** - Built with Next.js 16 + Turbopack
- **Fully Responsive** - Seamless experience mobile-to-desktop
- **Data Persistence** - Trusted local storage for your settings

## Super App Collection

### 📚 Info & Knowledge (8 apps)
- **News Headlines** - Real-time global news coverage
- **Movie Database** - Explore moves & TV shows (TMDB)
- **Book Search** - Library of millions of books (Open Library)
- **Wikipedia** - Instant encyclopedia search
- **DEV Community** - Tech articles for developers
- **Dictionary** - Definitions, phonetics, and audio
- **World Atlas** - Detailed country data & demographics
- **Daily Quotes** - Wisdom & inspiration generator

### 💹 Finance & Data (6 apps)
- **Weather** - Accurate forecasts & live conditions
- **Crypto Tracker** - Real-time cryptocurrency market data
- **Stock Market** - Live global stock exchange data
- **Currency Exchange** - Instant currency conversion rates
- **NPM Search** - Package discovery for developers
- **GitHub Finder** - User profile & repository search

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/lexyerresta/super-apps.git
cd super-apps
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Vanilla CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage
- **Build Tool**: Turbopack
- **Deployment**: Vercel

## Project Structure

```
super-apps/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   ├── apps/              # 14 Super Apps
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable Components
│   ├── config/                # App Configuration
│   ├── context/               # React Context
│   └── types/                 # TypeScript Types
├── public/                    # Static Assets
└── package.json
```

## API Services Used

All apps use FREE open-source & public APIs:

- **GNews API** - Real-time news headlines
- **TMDB API** - Movie & TV show database (via proxy/client)
- **Open Library API** - Book metadata and covers
- **Wikipedia API** - Article summaries and search
- **DEV Community API** - Tech articles and resources
- **Free Dictionary API** - Definitions and phonetics
- **REST Countries API** - Global country data
- **Quotable API** - Inspirational quotes
- **Open-Meteo API** - Weather forecasts (No key required)
- **CoinGecko API** - Cryptocurrency market data
- **Frankfurter API** - Currency exchange rates
- **NPP Registry** - NPM package search
- **GitHub API** - User and repository search

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lexyerresta/super-apps)

Or manually:

```bash
npm i -g vercel
vercel --prod
```

### Environment Variables

No environment variables required for basic functionality. All APIs used are public and free.

## Performance

- Build Time: ~3s with Turbopack
- Bundle Size: Optimized with code-splitting
- TypeScript: Zero errors
- Production Ready: Battle-tested

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- All free open-source APIs used

---

**Made with care**

*39 Apps. One Platform. Powered by Open Source.*