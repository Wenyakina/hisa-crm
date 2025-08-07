export const marketData = [
    { id: 1, ticker: 'KEGN', name: 'KenGen', prev_price: 7.28, curr_price: 7.24 },
    { id: 2, ticker: 'NCBA', name: 'NCBA', prev_price: 64.50, curr_price: 64.75 },
    { id: 3, ticker: 'SCOM', name: 'Safaricom', prev_price: 25.85, curr_price: 26 },
    { id: 4, ticker: 'KPLC', name: 'Kenya Power', prev_price: 11.25, curr_price: 11.35 },
    { id: 5, ticker: 'KQ', name: 'Kenya Airways', prev_price: 4.99, curr_price: 4.90 },
    { id: 6, ticker: 'BAMB', name: 'Bamburi Cement', prev_price: 47.20, curr_price: 47.20 },
    { id: 7, ticker: 'BRIT', name: 'Britam Holdings', prev_price: 7.70, curr_price: 7.78 },
    { id: 8, ticker: 'COOP', name: 'Co-operative Bank', prev_price: 16.60, curr_price: 16.65 },
    { id: 9, ticker: 'DTK', name: 'Diamond Trust Bank', prev_price: 77.25, curr_price: 76.75 },
    { id: 10, ticker: 'EABL', name: 'East African Breweries', prev_price: 208.75, curr_price: 207.75 },
].sort((a, b) => a.ticker.localeCompare(b.ticker));


export const activeBrokersData = [
    { id: 1, name: 'D&B' },
    { id: 2, name: 'Suntra' },
    { id: 3, name: 'Francis Drummond' },
    { id: 4, name: 'Old Mutual' },
    { id: 5, name: 'Stanbic' },
    { id: 6, name: 'AIB-AXYS' },
    { id: 7, name: 'ABC' },
    { id: 8, name: 'Faida' },
    { id: 9, name: 'SIB' },
    { id: 10, name: 'Genghis' },
    { id: 11, name: 'NCBA' },
    { id: 12, name: 'Equity' },
    { id: 13, name: 'KCB' },
    { id: 14, name: 'ABSA' },
    { id: 15, name: 'EFG' },
].sort((a, b) => a.name.localeCompare(b.name));