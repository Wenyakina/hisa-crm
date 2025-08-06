export const marketData = [
    {
        id: 1,
        category: 'Gainer',
        ticker: 'SMER',
        price: 9.6,
        change: 9.84
    },
    {
        id: 2,
        category: 'Gainer',
        ticker: 'AMAC',
        price: 74.0,
        change: 9.63
    },
    {
        id: 3,
        category: 'Gainer',
        ticker: 'TOTL',
        price: 27.85,
        change: 9.22
    },
    {
        id: 6,
        category: 'Loser',
        ticker: 'JUB',
        price: 240.5,
        change: -9.93
    },
    {
        id: 7,
        category: 'Loser',
        ticker: 'PORT',
        price: 45.75,
        change: -9.85
    },
].sort((a, b) => a.ticker.localeCompare(b.ticker));