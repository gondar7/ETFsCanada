// ETFsCanada.ca - Comparison & Utility Logic

// Wrap everything in DOMContentLoaded to ensure HTML is loaded first
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = primaryNav.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
            console.log("Toggled mobile nav. Expanded:", isExpanded); // Debug log
        });

        // Optional: Close menu when a link is clicked
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('nav-open')) {
                     primaryNav.classList.remove('nav-open');
                     navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    } else {
        console.warn("Mobile navigation toggle elements not found.");
    }

    // --- Existing ETF Comparison Logic ---
    console.log("DOM Loaded. Initializing comparison script."); // Debug Log

    // --- DATA STRUCTURE ---
    // !! CRITICAL !! Verify ALL data below against official provider sources before use.
    // Data fetched via search ~ March 29, 2025. AUM/Yield/Allocations can change daily. Performance data is typically month-end.
    // TopHoldings & specific Sector breakdowns may require manual verification from fund documents.
    const etfData = {
        // --- All Equity ---
        'XEQT': { name: 'iShares Core Equity ETF Portfolio', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/314095/', mer: 0.20, equity: 100, bond: 0, yield: '1.6%', aum: '$4.2B', summary: 'Holds iShares ETFs for global equity exposure.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 48.5, 'Canada': 24.1, 'Intl Dev': 22.8, 'Emerging': 4.6 }, topHoldings: ['ITOT','XIC','XEF','XEC'], sectors: {'Information Technology': 22.1, 'Financials': 20.5, 'Industrials': 10.5, 'Health Care': 9.5,'Consumer Discretionary': 8.8, 'Energy': 7.7, 'Materials': 5.5, 'Consumer Staples': 4.8,'Communication Services': 4.4, 'Utilities': 3.1, 'Real Estate': 2.8 } },
        'VEQT': { name: 'Vanguard All-Equity ETF Portfolio', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VEQT', mer: 0.24, equity: 100, bond: 0, yield: '1.4%', aum: '$3.7B', summary: 'Holds Vanguard ETFs for global equity exposure.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 44.8, 'Canada': 30.1, 'Intl Dev': 18.6, 'Emerging': 6.5 }, topHoldings: ['VUN','VCN','VIU','VEE'], sectors: {'Financials': 24.0, 'Information Technology': 18.5, 'Industrials': 10.2, 'Energy': 9.8, 'Health Care': 8.0, 'Consumer Discretionary': 7.5, 'Materials': 6.5, 'Consumer Staples': 5.0, 'Communication Services': 4.5, 'Utilities': 3.5, 'Real Estate': 2.5 } },
        'ZEQT': { name: 'BMO All-Equity ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-all-equity-etf-zeqt/', mer: 0.20, equity: 100, bond: 0, yield: '1.3%', aum: '$1.1B', summary: 'Holds BMO ETFs for global equity exposure.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 48.7, 'Canada': 24.5, 'Intl Dev': 22.1, 'Emerging': 4.7 }, topHoldings: ['ZSP','ZCN','ZEA','ZEM'], sectors: {'Information Technology': 23.0, 'Financials': 20.0, 'Health Care': 10.0, 'Industrials': 9.5, 'Consumer Discretionary': 9.0, 'Energy': 7.0, 'Communication Services': 6.0, 'Materials': 5.5, 'Consumer Staples': 4.5, 'Utilities': 3.0, 'Real Estate': 2.5 } },
        'HEQT': { name: 'Horizons All-Equity Asset Allocation ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/heqt/', mer: 0.20, equity: 100, bond: 0, yield: '0.8%', aum: '$160M', summary: 'Holds Horizons ETFs (incl. some swap-based) directly.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 46.6, 'Canada': 19.5, 'Intl Dev': 24.5, 'Emerging': 9.4 }, topHoldings: ['HXT','HXQ','HXX','HEMB'], sectors: {'Information Technology': 25.0, 'Financials': 18.0, 'Health Care': 10.0, 'Consumer Discretionary': 9.0, 'Industrials': 8.0, 'Communication Services': 7.0, 'Energy': 6.5, 'Materials': 5.5, 'Consumer Staples': 4.0, 'Utilities': 3.5, 'Real Estate': 3.5 } },
        'FEQT': { name: 'Fidelity All-in-One Equity ETF', provider: 'Fidelity', url: 'https://www.fidelity.ca/en/products/etfs/feqt/', mer: 0.43, equity: '~97', bond: 0, yield: '0.9%', aum: '$950M', summary: 'Holds Fidelity Factor ETFs + ~2-3% Bitcoin ETF (FBTC).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 45.8, 'Canada': 23.8, 'Intl Dev': 25.1, 'Emerging': 0, 'Crypto': 2.8, 'Global': 2.5 }, topHoldings: ['FCCF','FCID','FCUH','FCUD','FCIM','FCIG','FBTC'], sectors: {'Information Technology': 20.0, 'Financials': 18.0, 'Health Care': 11.0, 'Industrials': 10.0, 'Consumer Discretionary': 9.0, 'Materials': 6.0, 'Energy': 5.0, 'Communication Services': 5.0, 'Consumer Staples': 5.0, 'Utilities': 4.0, 'Real Estate': 4.0, 'Crypto': 2.8 } },
        // --- Growth (80/20) ---
        'XGRO': { name: 'iShares Core Growth ETF Portfolio', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/308567/', mer: 0.20, equity: 80, bond: 20, yield: '1.9%', aum: '$2.1B', summary: 'Holds iShares ETFs (80% Equity, 20% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 38.8, 'Canada': 19.6, 'Intl Dev': 18.0, 'Emerging': 3.6, 'Fixed Income': 20.0 }, topHoldings: ['ITOT','XIC','XEF','XEC','XBB'], sectors: {'Fixed Income': 20.0, 'Information Technology': 17.7, 'Financials': 16.4, 'Industrials': 8.4, 'Health Care': 7.6, 'Consumer Discretionary': 7.0, 'Energy': 6.2 } },
        'VGRO': { name: 'Vanguard Growth ETF Portfolio', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VGRO', mer: 0.24, equity: 80, bond: 20, yield: '2.0%', aum: '$4.5B', summary: 'Holds Vanguard ETFs (80% Equity, 20% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 35.8, 'Canada': 24.1, 'Intl Dev': 14.9, 'Emerging': 5.2, 'Fixed Income': 20.0 }, topHoldings: ['VUN','VCN','VIU','VEE','VAB'], sectors: {'Fixed Income': 20.0, 'Financials': 19.2, 'Information Technology': 14.8, 'Industrials': 8.2, 'Energy': 7.8, 'Health Care': 6.4, 'Consumer Discretionary': 6.0 } },
        'ZGRO': { name: 'BMO Growth ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-growth-etf-zgro/', mer: 0.20, equity: 80, bond: 20, yield: '1.8%', aum: '$450M', summary: 'Holds BMO ETFs (80% Equity, 20% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 39.0, 'Canada': 19.6, 'Intl Dev': 17.7, 'Emerging': 3.7, 'Fixed Income': 20.0 }, topHoldings: ['ZSP','ZCN','ZEA','ZEM','ZAG'], sectors: {'Fixed Income': 20.0, 'Information Technology': 18.4, 'Financials': 16.0, 'Health Care': 8.0, 'Industrials': 7.6, 'Consumer Discretionary': 7.2, 'Communication Services': 4.8 } },
        'HGRO': { name: 'Horizons Growth TRI ETF Portfolio', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hgro/', mer: 0.19, equity: 80, bond: 20, yield: 'N/A (TRI)', aum: '$90M', summary: 'Uses Total Return Swaps for equity portion (tax efficient).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 39.3, 'Canada': 19.5, 'Intl Dev': 18.2, 'Emerging': 3.0, 'Fixed Income': 20.0 }, topHoldings: ['HXT','HXQ','HXX','HEMB','Total Bond'], sectors: {'Fixed Income': 20.0} }, // Sector data difficult for swaps
        'FGRO': { name: 'Fidelity All-in-One Growth ETF', provider: 'Fidelity', url: 'https://www.fidelity.ca/en/products/etfs/fgro/', mer: 0.42, equity: '~78', bond: '~15', yield: '1.2%', aum: '$1.4B', summary: 'Holds Fidelity Factor ETFs + ~2-3% Bitcoin ETF (FBTC).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 39.1, 'Canada': 20.2, 'Intl Dev': 21.4, 'Emerging': 0, 'Crypto': 2.7, 'Global': 2.0, 'Fixed Income': 14.7 }, topHoldings: ['FCCF','FCID','FCUH','FCUD','FCIM','FCIG','FBTC','FCGB'], sectors: {'Fixed Income': 14.7, 'Information Technology': 16.0, 'Financials': 14.5, 'Health Care': 8.8, 'Industrials': 8.0, 'Crypto': 2.7 } },
        // --- Balanced (60/40) ---
        'XBAL': { name: 'iShares Core Balanced ETF Portfolio', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/308564/', mer: 0.20, equity: 60, bond: 40, yield: '2.3%', aum: '$1.1B', summary: 'Holds iShares ETFs (60% Equity, 40% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 29.1, 'Canada': 14.7, 'Intl Dev': 13.5, 'Emerging': 2.7, 'Fixed Income': 40.0 }, topHoldings: ['ITOT','XIC','XEF','XEC','XBB'], sectors: {'Fixed Income': 40.0, 'Information Technology': 13.3, 'Financials': 12.3 } },
        'VBAL': { name: 'Vanguard Balanced ETF Portfolio', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VBAL', mer: 0.24, equity: 60, bond: 40, yield: '2.4%', aum: '$3.6B', summary: 'Holds Vanguard ETFs (60% Equity, 40% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 26.9, 'Canada': 18.1, 'Intl Dev': 11.2, 'Emerging': 3.9, 'Fixed Income': 40.0 }, topHoldings: ['VUN','VCN','VIU','VEE','VAB'], sectors: {'Fixed Income': 40.0, 'Financials': 14.4, 'Information Technology': 11.1 } },
        'ZBAL': { name: 'BMO Balanced ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-balanced-etf-zbal/', mer: 0.20, equity: 60, bond: 40, yield: '2.2%', aum: '$440M', summary: 'Holds BMO ETFs (60% Equity, 40% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 29.2, 'Canada': 14.7, 'Intl Dev': 13.3, 'Emerging': 2.8, 'Fixed Income': 40.0 }, topHoldings: ['ZSP','ZCN','ZEA','ZEM','ZAG'], sectors: {'Fixed Income': 40.0, 'Information Technology': 13.8, 'Financials': 12.0 } },
        'HBAL': { name: 'Horizons Balanced TRI ETF Portfolio', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hbal/', mer: 0.18, equity: 60, bond: 40, yield: 'N/A (TRI)', aum: '$50M', summary: 'Uses Total Return Swaps for equity portion (tax efficient).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 28.8, 'Canada': 12.1, 'Intl Dev': 15.3, 'Emerging': 3.8, 'Fixed Income': 40.0 }, topHoldings: ['HXT','HXQ','HXX','HEMB','Total Bond'], sectors: {'Fixed Income': 40.0} },
        'FBAL': { name: 'Fidelity All-in-One Balanced ETF', provider: 'Fidelity', url: 'https://www.fidelity.ca/en/products/etfs/fbal/', mer: 0.39, equity: '~58', bond: '~39', yield: '1.6%', aum: '$700M', summary: 'Holds Fidelity Factor ETFs + ~1-2% Bitcoin ETF (FBTC).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 27.8, 'Canada': 14.4, 'Intl Dev': 15.1, 'Emerging': 0, 'Crypto': 1.8, 'Global': 1.5, 'Fixed Income': 39.4 }, topHoldings: ['FCCF','FCID','FCUH','FCUD','FCIM','FCIG','FBTC','FCGB'], sectors: {'Fixed Income': 39.4, 'Information Technology': 11.6, 'Financials': 10.4, 'Health Care': 6.4, 'Crypto': 1.8 } },
        // --- Conservative (40/60) ---
         'XCNS': { name: 'iShares Core Conservative Balanced ETF Portfolio', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/308571/', mer: 0.20, equity: 40, bond: 60, yield: '2.6%', aum: '$350M', summary: 'Holds iShares ETFs (40% Equity, 60% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 19.4, 'Canada': 9.8, 'Intl Dev': 9.0, 'Emerging': 1.8, 'Fixed Income': 60.0 }, topHoldings: ['ITOT','XIC','XEF','XEC','XBB'], sectors: {'Fixed Income': 60.0, 'Financials': 8.2, 'Information Technology': 8.8 } },
        'VCNS': { name: 'Vanguard Conservative ETF Portfolio', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VCNS', mer: 0.24, equity: 40, bond: 60, yield: '2.7%', aum: '$1.1B', summary: 'Holds Vanguard ETFs (40% Equity, 60% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", geo: { 'US': 17.9, 'Canada': 12.0, 'Intl Dev': 7.4, 'Emerging': 2.6, 'Fixed Income': 60.0 }, topHoldings: ['VUN','VCN','VIU','VEE','VAB'], sectors: {'Fixed Income': 60.0, 'Financials': 9.6, 'Information Technology': 7.4 } },
         'ZCON': { name: 'BMO Conservative ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-conservative-etf-zcon/', mer: 0.20, equity: 40, bond: 60, yield: '2.5%', aum: '$200M', summary: 'Holds BMO ETFs (40% Equity, 60% Fixed Income).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 19.5, 'Canada': 9.8, 'Intl Dev': 8.8, 'Emerging': 1.9, 'Fixed Income': 60.0 }, topHoldings: ['ZSP','ZCN','ZEA','ZEM','ZAG'], sectors: {'Fixed Income': 60.0, 'Information Technology': 9.2, 'Financials': 8.0 } },
         'HCON': { name: 'Horizons Conservative TRI ETF Portfolio', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hcon/', mer: 0.17, equity: 40, bond: 60, yield: 'N/A (TRI)', aum: '$30M', summary: 'Uses Total Return Swaps for equity portion (tax efficient).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: {'US': 19.2, 'Canada': 8.1, 'Intl Dev': 10.2, 'Emerging': 2.5, 'Fixed Income': 60.0 }, topHoldings: ['HXT','HXQ','HXX','HEMB','Total Bond'], sectors: {'Fixed Income': 60.0} },
         'FCNS': { name: 'Fidelity All-in-One Conservative ETF', provider: 'Fidelity', url: 'https://www.fidelity.ca/en/products/etfs/fcns/', mer: 0.39, equity: '~39', bond: '~59', yield: '2.1%', aum: '$840M', summary: 'Holds Fidelity Factor ETFs + ~1% Bitcoin ETF (FBTC).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", geo: { 'US': 18.6, 'Canada': 9.7, 'Intl Dev': 10.2, 'Emerging': 0, 'Crypto': 1.0, 'Global': 1.0, 'Fixed Income': 59.5 }, topHoldings: ['FCCF','FCID','FCUH','FCUD','FCIM','FCIG','FBTC','FCGB'], sectors: {'Fixed Income': 59.5, 'Financials': 7.4, 'Information Technology': 7.7, 'Health Care': 4.2, 'Crypto': 1.0 } },
        // --- Crypto ETFs ---
        'BTCC.B': { name: 'Purpose Bitcoin ETF CAD Non-Hedged', provider: 'Purpose', url: 'https://www.purposeinvest.com/funds/purpose-bitcoin-etf', mer: 1.00, asset: 'Bitcoin', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Bitcoin'], sectors: {'Crypto': 100} },
        'EBIT': { name: 'Evolve Bitcoin ETF (CAD Unhedged)', provider: 'Evolve', url: 'https://evolveetfs.com/product/ebit/', mer: 0.75, asset: 'Bitcoin', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Bitcoin'], sectors: {'Crypto': 100} },
        'BTCX.B': { name: 'CI Galaxy Bitcoin ETF (CAD Unhedged)', provider: 'CI Galaxy', url: 'https://ci.com/en/financial P/galaxy-bitcoin-etf-common-units-btcx-b-NEO', mer: 0.40, asset: 'Bitcoin', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Bitcoin'], sectors: {'Crypto': 100} },
        'FBTC': { name: 'Fidelity Advantage Bitcoin ETF', provider: 'Fidelity', url: 'https://www.fidelity.ca/en/products/etfs/fbtc', mer: 0.44, asset: 'Bitcoin', structure: 'Spot Physical', currency: 'CAD', custodian: 'Fidelity Clearing Canada ULC', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Bitcoin'], sectors: {'Crypto': 100} },
        'HBTC': { name: 'Horizons Bitcoin ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hbtc/', mer: 0.40, asset: 'Bitcoin', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Bitcoin'], sectors: {'Crypto': 100} },
        'ETHH': { name: 'Purpose Ether ETF CAD Non-Hedged', provider: 'Purpose', url: 'https://www.purposeinvest.com/funds/purpose-ether-etf', mer: 1.00, asset: 'Ethereum', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '$254M', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Ether'], sectors: {'Crypto': 100} },
        'ETHR': { name: 'Evolve Ether ETF', provider: 'Evolve', url: 'https://evolveetfs.com/product/ethr/', mer: 0.75, asset: 'Ethereum', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Ether'], sectors: {'Crypto': 100} },
        'ETHX.B': { name: 'CI Galaxy Ethereum ETF (CAD Unhedged)', provider: 'CI Galaxy', url: 'https://ci.com/en/financial P/galaxy-ethereum-etf-ethx-b-NEO', mer: 0.40, asset: 'Ethereum', structure: 'Spot Physical', currency: 'CAD', custodian: 'Gemini', aum: '[AUM]', yield: 'N/A', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Ether'], sectors: {'Crypto': 100} },

        // --- Regional Equity ETFs ---
        // Canada
        'XIC': { name: 'iShares Core S&P/TSX Capped Composite Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239837/', mer: 0.06, asset: 'Equity', index: 'S&P/TSX Capped Comp', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad Canadian market.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank','TD Bank','Shopify','Enbridge','CN Rail'], sectors: {'Financials': 30.5, 'Energy': 18.5, 'Industrials': 10.0} },
        'VCN': { name: 'Vanguard FTSE Canada All Cap Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VCN', mer: 0.05, asset: 'Equity', index: 'FTSE Canada All Cap', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad Canadian market, includes small caps.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank','TD Bank','Shopify','Enbridge','CN Rail'], sectors: {'Financials': 31.0, 'Energy': 17.0, 'Industrials': 10.5} },
        'ZCN': { name: 'BMO S&P/TSX Capped Composite Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-s-p-tsx-capped-composite-index-etf-zcn/', mer: 0.06, asset: 'Equity', index: 'S&P/TSX Capped Comp', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad Canadian market.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank','TD Bank','Shopify','Enbridge','CN Rail'], sectors: {'Financials': 30.5, 'Energy': 18.5, 'Industrials': 10.0} },
        'HXT': { name: 'Horizons S&P/TSX 60 Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hxt/', mer: 0.04, asset: 'Equity', index: 'S&P/TSX 60', geoFocus: 'Canada', aum: '[AUM]', yield: 'N/A (TRI)', summary: 'Large-cap Cdn (60 stocks), swap-based (tax efficient). Check total cost.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Swap Counterparty'], sectors: {'Financials': '~35', 'Energy': '~19', 'Industrials': '~9'} },
        // US
        'VFV': { name: 'Vanguard S&P 500 Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VFV', mer: 0.09, asset: 'Equity', index: 'S&P 500', geoFocus: 'US', currency: 'CAD Unhedged', aum: '[AUM]', yield: '[Yield]%', summary: 'US large-cap (S&P 500).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 29.0, 'Financials': 13.0, 'Health Care': 12.5} },
        'XUU': { name: 'iShares Core S&P U.S. Total Market Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/272104/', mer: 0.07, asset: 'Equity', index: 'S&P Total Market', geoFocus: 'US', currency: 'CAD Unhedged', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad US market (incl. small/mid caps).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 28.5, 'Financials': 12.5, 'Health Care': 13.0} },
        'ZSP': { name: 'BMO S&P 500 Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-s-p-500-index-etf-zsp/', mer: 0.09, asset: 'Equity', index: 'S&P 500', geoFocus: 'US', currency: 'CAD Unhedged', aum: '[AUM]', yield: '[Yield]%', summary: 'US large-cap (S&P 500).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 29.0, 'Financials': 13.0, 'Health Care': 12.5} },
        'HXS': { name: 'Horizons S&P 500 Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hxs/', mer: 0.10, asset: 'Equity', index: 'S&P 500', geoFocus: 'US', currency: 'CAD Unhedged', aum: '[AUM]', yield: 'N/A (TRI)', summary: 'US large-cap (S&P 500), swap-based (tax efficient). Check total cost.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Swap Counterparty'], sectors: {'Information Technology': '~29', 'Financials': '~13', 'Health Care': '~12.5'} },
        'VSP': { name: 'Vanguard S&P 500 Index ETF (CAD-hedged)', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VSP', mer: 0.09, asset: 'Equity', index: 'S&P 500', geoFocus: 'US', currency: 'CAD Hedged', aum: '[AUM]', yield: '[Yield]%', summary: 'US large-cap (S&P 500), currency hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 29.0, 'Financials': 13.0, 'Health Care': 12.5} },
        'QQC.F': { name: 'Invesco NASDAQ 100 Index ETF CAD Hedged', provider: 'Invesco', url: 'https://www.invesco.ca/en/financial-products/etfs/product-detail.html/etf/qqc.f', mer: 0.22, asset: 'Equity', index: 'Nasdaq 100', geoFocus: 'US', currency: 'CAD Hedged', aum: '[AUM]', yield: '[Yield]%', summary: 'US tech-heavy (Nasdaq 100), currency hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 50.0, 'Communication Services': 15.0, 'Consumer Discretionary': 14.0} },
        // Intl Developed
        'XEF': { name: 'iShares Core MSCI EAFE IMI Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/251421/', mer: 0.22, asset: 'Equity', index: 'MSCI EAFE IMI', geoFocus: 'Intl Dev', aum: '[AUM]', yield: '[Yield]%', summary: 'Developed ex-NA, includes small caps.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Nestle','ASML','Novo Nordisk','Shell','Toyota'], sectors: {'Financials': 18.0, 'Industrials': 15.0, 'Consumer Discretionary': 12.0} },
        'VIU': { name: 'Vanguard FTSE Developed All Cap ex North America Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VIU', mer: 0.23, asset: 'Equity', index: 'FTSE Dev All Cap ex NA', geoFocus: 'Intl Dev', aum: '[AUM]', yield: '[Yield]%', summary: 'Developed ex-NA, includes small caps & S. Korea.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Nestle','Samsung','ASML','Novo Nordisk','Shell'], sectors: {'Financials': 19.0, 'Industrials': 14.0, 'Consumer Discretionary': 11.5} },
        'ZEA': { name: 'BMO MSCI EAFE Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-eafe-index-etf-zea/', mer: 0.22, asset: 'Equity', index: 'MSCI EAFE', geoFocus: 'Intl Dev', aum: '[AUM]', yield: '[Yield]%', summary: 'Developed ex-NA, large/mid cap.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Nestle','ASML','Novo Nordisk','Shell','Toyota'], sectors: {'Financials': 18.5, 'Industrials': 15.5, 'Consumer Discretionary': 12.5} },
        'HXDM': { name: 'Horizons Intl Developed Markets Equity Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hxdm/', mer: 0.23, asset: 'Equity', index: 'FTSE Developed ex North America', geoFocus: 'Intl Dev', aum: '[AUM]', yield: 'N/A (TRI)', summary: 'Developed ex-NA, swap-based (tax efficient). Check total cost.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: ['Swap Counterparty'], sectors: {} },
        // Emerging Markets
        'XEC': { name: 'iShares Core MSCI Emerging Markets IMI Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/251423/', mer: 0.27, asset: 'Equity', index: 'MSCI EM IMI', geoFocus: 'Emerging', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad Emerging Markets, includes small caps & S. Korea.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['TSMC','Samsung','Tencent','Alibaba','Reliance'], sectors: {'Financials': 22.0, 'Information Technology': 20.0, 'Consumer Discretionary': 13.0} },
        'VEE': { name: 'Vanguard FTSE Emerging Markets All Cap Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VEE', mer: 0.25, asset: 'Equity', index: 'FTSE EM All Cap', geoFocus: 'Emerging', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad Emerging Markets, includes small caps, excludes S. Korea.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['TSMC','Tencent','Alibaba','Reliance','Meituan'], sectors: {'Financials': 23.0, 'Information Technology': 19.0, 'Consumer Discretionary': 14.0} },
        'ZEM': { name: 'BMO MSCI Emerging Markets Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-emerging-markets-index-etf-zem/', mer: 0.27, asset: 'Equity', index: 'MSCI EM', geoFocus: 'Emerging', aum: '[AUM]', yield: '[Yield]%', summary: 'Emerging Markets large/mid cap, includes S. Korea.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['TSMC','Samsung','Tencent','Alibaba','Reliance'], sectors: {'Financials': 22.5, 'Information Technology': 20.5, 'Consumer Discretionary': 13.5} },

        // --- Sector ETFs ---
        // Financials
        'ZEB': { name: 'BMO Equal Weight Banks Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-banks-index-etf-zeb/', mer: 0.28, asset: 'Equity', index: 'Solactive Equal Weight Canada Banks', sectorFocus: 'Financials', geoFocus: 'Canada', aum: '$2.77B', yield: '[Yield]%', summary: 'Equal weighted Big 6 Cdn Banks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank', 'TD Bank', 'Scotiabank', 'BMO', 'CIBC', 'National Bank'], sectors: {'Financials': 100} },
        'XFN': { name: 'iShares S&P/TSX Capped Financials Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239842/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Financials', sectorFocus: 'Financials', geoFocus: 'Canada', aum: '$1.7B', yield: '2.95%', summary: 'Market cap weighted Cdn Financials (banks, insurance).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank','TD Bank','Brookfield Corp','BMO','Scotiabank','CIBC','Manulife','Intact Financial','National Bank','Sun Life'], sectors: {'Financials': 100} },
        'ZWB': { name: 'BMO Covered Call Canadian Banks ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-covered-call-canadian-banks-etf-zwb/', mer: 0.71, asset: 'Equity/Options', index: 'Active Covered Call', sectorFocus: 'Financials', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Holds Cdn Banks + writes covered calls for income.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Royal Bank', 'TD Bank', 'Scotiabank', 'BMO', 'CIBC', 'National Bank'], sectors: {'Financials': 100} },
        'HCAL': { name: 'Hamilton Enhanced Canadian Bank ETF', provider: 'Hamilton', url: 'https://hamiltonetfs.com/etf/hcal/', mer: 0.65, asset: 'Equity', index: 'Solactive Equal Weight Canada Banks (1.25x)', sectorFocus: 'Financials', geoFocus: 'Canada', aum: '$534M', yield: '6.16%', summary: 'Equal weighted Big 6 Cdn Banks with 1.25x leverage. Higher risk/reward.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Royal Bank', 'TD Bank', 'Scotiabank', 'BMO', 'CIBC', 'National Bank'], sectors: {'Financials': 100} },
        'HFIN': { name: 'Hamilton Enhanced Canadian Financials ETF', provider: 'Hamilton', url: 'https://hamiltonetfs.com/etf/hfin/', mer: 0.65, asset: 'Equity', index: 'Active (Leveraged Cdn Financials)', sectorFocus: 'Financials', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Leveraged exposure (~1.25x) to Cdn Financials (banks, lifecos).', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: [], sectors: {'Financials': 100} },
        // Energy
        'XEG': { name: 'iShares S&P/TSX Capped Energy Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239839/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Energy', sectorFocus: 'Energy', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Cdn Energy.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Energy': 100} },
        'ZEO': { name: 'BMO Equal Weight Oil & Gas Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-oil-gas-index-etf-zeo/', mer: 0.61, asset: 'Equity', index: 'Solactive Equal Weight Canada Oil & Gas', sectorFocus: 'Energy', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Equal weighted Cdn Energy.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Energy': 100} },
        'ZWE': { name: 'BMO Covered Call Energy ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-covered-call-energy-etf-zwe/', mer: 0.71, asset: 'Equity/Options', index: 'Active Covered Call', sectorFocus: 'Energy', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Holds Cdn Energy stocks + writes covered calls for income.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Energy': 100} },
        'HXE': { name: 'Horizons S&P/TSX Capped Energy Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hxe/', mer: 0.27, asset: 'Equity', index: 'S&P/TSX Capped Energy', sectorFocus: 'Energy', geoFocus: 'Canada', aum: '[AUM]', yield: 'N/A (TRI)', summary: 'Market cap weighted Cdn Energy (Swap-based). Check total cost.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Swap Counterparty'], sectors: {'Energy': 100} },
        'HENG': { name: 'Hamilton Enhanced Canadian Energy ETF', provider: 'Hamilton', url: 'https://hamiltonetfs.com/etf/heng/', mer: 0.65, asset: 'Equity', index: 'Active (Leveraged Cdn Energy)', sectorFocus: 'Energy', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Leveraged exposure (~1.25x) to Cdn Energy companies.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: [], sectors: {'Energy': 100} },
        // Technology
        'XIT': { name: 'iShares S&P/TSX Capped Information Technology Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239841/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Info Tech', sectorFocus: 'Technology', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Cdn Tech (Highly concentrated).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Shopify','Constellation Software','CGI Inc','Open Text','Celestica'], sectors: {'Information Technology': 100} },
        'TEC': { name: 'BMO MSCI Tech Innovation Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-tech-innovation-index-etf-tec/', mer: 0.39, asset: 'Equity', index: 'MSCI ACWI IMI Innovation', sectorFocus: 'Technology', geoFocus: 'Global', aum: '[AUM]', yield: '[Yield]%', summary: 'Global Tech Innovation (US heavy).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['NVIDIA','Microsoft','Apple','Meta','Alphabet'], sectors: {'Information Technology': '~80', 'Communication Services': '~10', 'Consumer Discretionary': '~10'} },
        'ZNQ': { name: 'BMO NASDAQ 100 Equity Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-nasdaq-100-equity-index-etf-znq/', mer: 0.39, asset: 'Equity', index: 'Nasdaq 100', sectorFocus: 'Technology', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Tracks Nasdaq 100 (US Tech/Growth).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Microsoft','Apple','NVIDIA','Amazon','Meta'], sectors: {'Information Technology': 50.0, 'Communication Services': 15.0, 'Consumer Discretionary': 14.0} },
        'HXQ': { name: 'Horizons NASDAQ-100 Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hxq/', mer: 0.28, asset: 'Equity', index: 'Nasdaq 100', sectorFocus: 'Technology', geoFocus: 'US', aum: '[AUM]', yield: 'N/A (TRI)', summary: 'Tracks Nasdaq 100 (Swap-based). Check total cost.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Swap Counterparty'], sectors: {'Information Technology': 50.0, 'Communication Services': 15.0, 'Consumer Discretionary': 14.0} },
        // Materials
        'XMA': { name: 'iShares S&P/TSX Capped Materials Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239840/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Materials', sectorFocus: 'Materials', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Cdn Materials.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Materials': 100} },
        'ZMT': { name: 'BMO Equal Weight Global Base Metals Hgd CAD ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-global-base-metals-hedged-to-cad-index-etf-zmt/', mer: 0.40, asset: 'Equity', index: 'Solactive Eq Wt Global Base Metals (CAD Hedged)', sectorFocus: 'Materials', geoFocus: 'Global', currency: 'CAD Hedged', aum: '[AUM]', yield: '[Yield]%', summary: 'Equal weighted Global Base Metals Miners (Hedged).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Materials': 100} },
        'XGD': { name: 'iShares S&P/TSX Global Gold Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239846/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Global Gold', sectorFocus: 'Materials', geoFocus: 'Global', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Global Gold Miners.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Materials': 100} },
        // Utilities
        'XUT': { name: 'iShares S&P/TSX Capped Utilities Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239845/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Utilities', sectorFocus: 'Utilities', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Cdn Utilities.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Utilities': 100} },
        'ZUT': { name: 'BMO Equal Weight Utilities Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-utilities-index-etf-zut/', mer: 0.61, asset: 'Equity', index: 'Solactive Equal Weight Canada Utilities', sectorFocus: 'Utilities', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Equal weighted Cdn Utilities.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Utilities': 100} },
        'ZWU': { name: 'BMO Covered Call Utilities ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-covered-call-utilities-etf-zwu/', mer: 0.71, asset: 'Equity/Options', index: 'Active Covered Call', sectorFocus: 'Utilities', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Holds Cdn Utilities + writes covered calls for income.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Utilities': 100} },
        'HUTS': { name: 'Hamilton Enhanced Canadian Utilities ETF', provider: 'Hamilton', url: 'https://hamiltonetfs.com/etf/huts/', mer: 0.65, asset: 'Equity', index: 'Active (Leveraged Cdn Utilities)', sectorFocus: 'Utilities', geoFocus: 'Canada', aum: '[AUM]', yield: '[High Yield]%', summary: 'Leveraged exposure (~1.25x) to Cdn Utilities.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: [], sectors: {'Utilities': 100} },
        // Real Estate
        'XRE': { name: 'iShares S&P/TSX Capped REIT Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239844/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped REIT', sectorFocus: 'Real Estate', geoFocus: 'Canada', aum: '$1.1B', yield: '4.46%', summary: 'Market cap weighted Cdn REITs.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Real Estate': 100} },
        'ZRE': { name: 'BMO Equal Weight REITs Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-reits-index-etf-zre/', mer: 0.61, asset: 'Equity', index: 'Solactive Equal Weight Canada REIT', sectorFocus: 'Real Estate', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Equal weighted Cdn REITs.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Real Estate': 100} },
        'VRE': { name: 'Vanguard FTSE Canadian Capped REIT Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VRE', mer: 0.39, asset: 'Equity', index: 'FTSE Canada All Cap Real Estate Capped 25%', sectorFocus: 'Real Estate', geoFocus: 'Canada', aum: '$264M', yield: '2.72%', summary: 'Market cap weighted Cdn REITs (FTSE index).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['FirstService','Colliers Intl','CAPREIT','RioCan','Granite REIT','Chartwell','Choice Prop','First Capital','Dream Industrial','SmartCentres'], sectors: {'Real Estate': 100} },
        // Healthcare
        'XHC': { name: 'iShares S&P/TSX Capped Health Care Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239847/', mer: 0.61, asset: 'Equity', index: 'S&P/TSX Capped Health Care', sectorFocus: 'Healthcare', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Market cap weighted Cdn Healthcare (Concentrated).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Health Care': 100} },
        'ZUH': { name: 'BMO Equal Weight US Health Care Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-equal-weight-us-health-care-index-etf-zuh/', mer: 0.39, asset: 'Equity', index: 'Solactive Equal Wt US Health Care', sectorFocus: 'Healthcare', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Equal weighted US Healthcare.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Health Care': 100} },

        // --- Factor ETFs ---
        'XCV': { name: 'iShares MSCI Canada Value Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239515/', mer: 0.39, asset: 'Equity', factorFocus: 'Value', index: 'MSCI Canada Enhanced Value', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets undervalued Cdn stocks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZVC': { name: 'BMO MSCI Canada Value Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-canada-value-index-etf-zvc/', mer: 0.39, asset: 'Equity', factorFocus: 'Value', index: 'MSCI Canada Enhanced Value', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets undervalued Cdn stocks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'VVL': { name: 'BMO MSCI USA Value Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-usa-value-index-etf-vvl/', mer: 0.33, asset: 'Equity', factorFocus: 'Value', index: 'MSCI USA Enhanced Value', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets undervalued US stocks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XCM': { name: 'iShares MSCI Canada Momentum Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/258505/', mer: 0.39, asset: 'Equity', factorFocus: 'Momentum', index: 'MSCI Canada Momentum', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets Cdn stocks with price trends.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZCM': { name: 'BMO MSCI Canada Momentum Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-canada-momentum-index-etf-zcm/', mer: 0.39, asset: 'Equity', factorFocus: 'Momentum', index: 'MSCI Canada Momentum', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets Cdn stocks with price trends.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZUM': { name: 'BMO MSCI USA Momentum Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-usa-momentum-index-etf-zum/', mer: 0.33, asset: 'Equity', factorFocus: 'Momentum', index: 'MSCI USA Momentum', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets US stocks with price trends.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XCQ': { name: 'iShares MSCI Canada Quality Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/258506/', mer: 0.39, asset: 'Equity', factorFocus: 'Quality', index: 'MSCI Canada Quality', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets stable, profitable Cdn companies.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZQC': { name: 'BMO MSCI Canada Quality Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-canada-quality-index-etf-zqc/', mer: 0.39, asset: 'Equity', factorFocus: 'Quality', index: 'MSCI Canada Quality', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets stable, profitable Cdn companies.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZUQ': { name: 'BMO MSCI USA Quality Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-usa-quality-index-etf-zuq/', mer: 0.33, asset: 'Equity', factorFocus: 'Quality', index: 'MSCI USA Quality', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets stable, profitable US companies.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XMV': { name: 'iShares MSCI Min Vol Canada Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/251729/', mer: 0.39, asset: 'Equity', factorFocus: 'Low Volatility', index: 'MSCI Canada Minimum Volatility', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets lower volatility Cdn stocks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZLB': { name: 'BMO Low Volatility Canadian Equity ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-low-volatility-canadian-equity-etf-zlb/', mer: 0.39, asset: 'Equity', factorFocus: 'Low Volatility', index: 'Proprietary Rules-Based', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets lower volatility Cdn stocks (BMO model).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZLU': { name: 'BMO Low Volatility US Equity ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-low-volatility-us-equity-etf-zlu/', mer: 0.33, asset: 'Equity', factorFocus: 'Low Volatility', index: 'Proprietary Rules-Based', geoFocus: 'US', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets lower volatility US stocks (BMO model).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZLE': { name: 'BMO Low Volatility International Equity ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-low-volatility-international-equity-etf-zle/', mer: 0.44, asset: 'Equity', factorFocus: 'Low Volatility', index: 'Proprietary Rules-Based', geoFocus: 'Intl Dev', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets lower volatility Intl Dev stocks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'PXC': { name: 'Invesco FTSE RAFI Canada Index ETF', provider: 'Invesco', url: 'https://www.invesco.ca/en/financial-products/etfs/product-detail.html/etf/pxc', mer: 0.43, asset: 'Equity', factorFocus: 'Multi-factor (RAFI)', index: 'FTSE RAFI Canada', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Weights by fundamentals (sales, cash flow, book value, dividends).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XFC': { name: 'iShares MSCI Multifactor Canada Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/280415/', mer: 0.44, asset: 'Equity', factorFocus: 'Multi-factor (MSCI)', index: 'MSCI Canada Diversified Multi-Factor', geoFocus: 'Canada', aum: '[AUM]', yield: '[Yield]%', summary: 'Targets Quality, Value, Momentum, Size.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        // --- US-Listed Factor/Asset Allocation ETFs ---
        'AVGE': { name: 'Avantis All Equity Markets ETF', provider: 'Avantis (US)', url: 'https://www.avantisinvestors.com/content/avantis/en/investments/avantis-all-equity-markets-etf.html', mer: 0.23, asset: 'Equity', factorFocus: 'Multi-factor/Value Tilt', index: 'Active Systematic', geoFocus: 'Global', currency: 'USD', summary: 'Global equity, factor tilts (value, profit). US-domiciled.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", aum: '[AUM]', yield: '[Yield]%', topHoldings: [], sectors: {} },
        'AVGV': { name: 'Avantis All Equity Markets Value ETF', provider: 'Avantis (US)', url: 'https://www.avantisinvestors.com/content/avantis/en/investments/avantis-all-equity-markets-value-etf.html', mer: 0.26, asset: 'Equity', factorFocus: 'Value/Multi-factor', index: 'Active Systematic', geoFocus: 'Global', currency: 'USD', summary: 'Global equity, strong value & profit tilts. US-domiciled.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", aum: '[AUM]', yield: '[Yield]%', topHoldings: [], sectors: {} },
        'DFAW': { name: 'Dimensional World Equity ETF', provider: 'Dimensional (US)', url: 'https://us.dimensional.com/etfs/dfaw/dimensional-world-equity-etf', mer: 0.22, asset: 'Equity', factorFocus: 'Multi-factor', index: 'Active Systematic', geoFocus: 'Global', currency: 'USD', summary: 'Global equity, targets size, value, profit premiums. US-domiciled.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", aum: '[AUM]', yield: '[Yield]%', topHoldings: [], sectors: {} },

        // --- Thematic ETFs ---
        'ZAUT': { name: 'BMO MSCI Tech & AI Innovators Index ETF', provider: 'BMO', url:'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-msci-tech-and-ai-innovators-index-etf-zaut/', mer: 0.39, asset:'Equity', themeFocus:'AI & Technology', index:'MSCI ACWI IMI Tech & AI Innovators', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'RBOT': { name: 'Horizons Robotics and Automation Index ETF', provider: 'Horizons', url:'https://horizonsetfs.com/ETF/rbot/', mer: 0.45, asset:'Equity', themeFocus:'Robotics & Automation', index:'Indxx Global Robotics & AI', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"[Perf%]", perf5Y:"[Perf%]", topHoldings:[], sectors:{} },
        'FOUR': { name: 'Global X Industry 4.0 Index ETF', provider: 'Global X', url:'https://www.globalx.ca/product/four', mer: 0.65, asset:'Equity', themeFocus:'Industry 4.0 (Robotics, AR, Cloud, Cyber, IoT)', index:'Solactive Industry 4.0 Index TR', geoFocus:'Global', aum:'$5.8M', yield:'1.34%', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'HBUG': { name: 'Horizons Cybersecurity Index ETF', provider: 'Horizons', url:'https://horizonsetfs.com/ETF/hbug/', mer: 0.50, asset:'Equity', themeFocus:'Cybersecurity', index:'Nasdaq CTA Cybersecurity Index', geoFocus:'Global/US Heavy', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'CYBR': { name: 'Evolve Cyber Security Index Fund Hedged', provider: 'Evolve', url:'https://evolveetfs.com/product/cybr/', mer: 0.60, asset:'Equity', themeFocus:'Cybersecurity', index:'Solactive Global Cyber Security Index (Hedged)', geoFocus:'Global/US Heavy (CAD Hedged)', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"[Perf%]", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'ZCLN': { name: 'iShares Global Clean Energy Index ETF', provider: 'iShares', url:'https://www.blackrock.com/ca/investors/en/products/316106/', mer: 0.45, asset:'Equity', themeFocus:'Clean Energy', index:'S&P Global Clean Energy', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"[Perf%]", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'HCLN': { name: 'Horizons Global Hydrogen Index ETF', provider: 'Horizons', url:'https://horizonsetfs.com/ETF/hcln/', mer: 0.75, asset:'Equity', themeFocus:'Hydrogen Energy', index:'Solactive Global Hydrogen Index', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'CARB': { name: 'Horizons Carbon Credits ETF', provider: 'Horizons', url:'https://horizonsetfs.com/ETF/carb/', mer: 0.75, asset:'Commodity/Futures', themeFocus:'Carbon Credits', index:'Horizons Carbon Credits Rolling Fut Index', geoFocus:'Global Futures Mkts', aum:'[AUM]', yield:'N/A', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:['Carbon Futures'], sectors:{'Carbon Credits': 100} },
        'HBLK': { name: 'Horizons Blockchain Technology & Hardware Index ETF', provider: 'Horizons', url:'https://horizonsetfs.com/ETF/hblk/', mer: 0.65, asset:'Equity', themeFocus:'Blockchain Technology', index:'Solactive Blockchain Technology & Hardware Index', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"[Perf%]", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'BATT': { name: 'Evolve Automobile Innovation Index Fund Unhedged', provider: 'Evolve', url:'https://evolveetfs.com/product/batt/', mer: 0.40, asset:'Equity', themeFocus:'EV & Battery Tech', index:'Solactive EV & Battery Tech Index', geoFocus:'Global', aum:'[AUM]', yield:'[Yield]%', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'HMAX': { name: 'Hamilton Enhanced Multi-Sector Covered Call ETF', provider: 'Hamilton', url:'https://hamiltonetfs.com/etf/hmax/', mer: 0.65, asset:'Equity/Options', themeFocus:'Multi-Sector Covered Call', index:'Active', geoFocus:'Global', aum:'[AUM]', yield:'[High Yield]%', summary: 'Diversified covered call strategy across sectors.', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{} },
        'UMAX': { name: 'Hamilton Enhanced Utilities Covered Call ETF', provider: 'Hamilton', url:'https://hamiltonetfs.com/etf/umax/', mer: 0.65, asset:'Equity/Options', themeFocus:'Utilities Covered Call', index:'Active', geoFocus:'Global/NA Heavy', aum:'[AUM]', yield:'[High Yield]%', summary: 'Covered calls on Utilities for enhanced yield.', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{'Utilities': 100} },
        'QMAX': { name: 'Hamilton Enhanced Tech Covered Call ETF', provider: 'Hamilton', url:'https://hamiltonetfs.com/etf/qmax/', mer: 0.65, asset:'Equity/Options', themeFocus:'Technology Covered Call', index:'Active', geoFocus:'Global/US Heavy', aum:'[AUM]', yield:'[High Yield]%', summary: 'Covered calls on Tech stocks for enhanced yield.', perf1Y:"[Perf%]", perf3Y:"N/A", perf5Y:"N/A", topHoldings:[], sectors:{'Information Technology': 100} },

        // --- Commodity ETFs ---
        'CGL': { name: 'iShares Gold Bullion ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239848/', mer: 0.25, asset: 'Gold Bullion', structure: 'Physical', currency: 'CAD', custodian: 'CIBC Mellon', aum: '[AUM]', yield: 'N/A', summary: 'Physically backed by gold bullion.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Gold Bullion'], sectors: {'Commodity': 100} },
        'KILO': { name: 'Purpose Gold Bullion Fund - ETF Series Non-Currency Hedged', provider: 'Purpose', url: 'https://www.purposeinvest.com/funds/purpose-gold-bullion-fund', mer: 0.28, asset: 'Gold Bullion', structure: 'Physical', currency: 'CAD', custodian: 'RBC Investor Services', aum: '$231M', yield: '0.00%', summary: 'Physically backed by gold bullion.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Gold Bullion'], sectors: {'Commodity': 100} },
        'MNT': { name: 'RBC Canadian Gold Reserves ETF', provider: 'RBC GAM', url: 'https://www.rbcgam.com/en/ca/products/etfs/mnt/detail', mer: 0.28, asset: 'Gold Bullion', structure: 'Physical', currency: 'CAD', custodian: 'RBC Investor Services', aum: '[AUM]', yield: 'N/A', summary: 'Physically backed by gold bullion.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Gold Bullion'], sectors: {'Commodity': 100} },
        'SVR': { name: 'iShares Silver Bullion ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239850/', mer: 0.45, asset: 'Silver Bullion', structure: 'Physical', currency: 'CAD', custodian: 'CIBC Mellon', aum: '[AUM]', yield: 'N/A', summary: 'Physically backed by silver bullion.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Silver Bullion'], sectors: {'Commodity': 100} },
        'HUC': { name: 'Horizons NYMEX Crude Oil ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/huc/', mer: 0.88, asset: 'Crude Oil Futures', structure: 'Futures-Based', currency: 'CAD', custodian: 'N/A', aum: '[AUM]', yield: 'N/A', summary: 'Tracks NYMEX WTI Crude Oil futures. High MER reflects futures mgmt.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Crude Oil Futures'], sectors: {'Commodity': 100} },
        'HURA': { name: 'Horizons Global Uranium Index ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/hura/', mer: 0.85, asset: 'Equity', index: 'Solactive Global Uranium Pure-Play', sectorFocus: 'Materials/Energy', geoFocus: 'Global', aum: '[AUM]', yield: '[Yield]%', summary: 'Tracks global uranium miners and related companies.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: [], sectors: {'Energy': 50, 'Materials': 50} },
        'COM': { name: 'Purpose Diversified Real Asset ETF', provider: 'Purpose', url: 'https://www.purposeinvest.com/funds/purpose-diversified-real-asset-fund', mer: 0.73, asset: 'Diversified Real Assets', structure: 'Multi-Asset (Equities, Futures)', currency: 'CAD', custodian: 'N/A', aum: '[AUM]', yield: '[Yield]%', summary: 'Broad exposure including commodities, infra, real estate.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Various Equities & Futures'], sectors: {'Commodity': '~35', 'Real Estate': '~25', 'Infrastructure': '~20', 'Other': '~20'} },

         // --- Fixed Income ETFs ---
        'VAB': { name: 'Vanguard Canadian Aggregate Bond Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VAB', mer: 0.09, asset: 'Bond', index: 'Bloomberg GA CAD Float Adj', duration: 7.44, avgQuality: 'AA-', aum: '$5.6B', yield: '2.92%', summary: 'Broad Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 77.0, 'Corporate': 23.0} },
        'XBB': { name: 'iShares Core Canadian Universe Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/individual/en/products/239494/', mer: 0.10, asset: 'Bond', index: 'FTSE Canada Universe Bond', duration: 7.4, avgQuality: 'AA-', aum: '$4.5B', yield: '4.0%', summary: 'Broad Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': '~60', 'Corporate': '~35', 'Other': '~5'} },
        'ZAG': { name: 'BMO Aggregate Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-aggregate-bond-index-etf-zag/', mer: 0.09, asset: 'Bond', index: 'FTSE Canada Universe Bond', duration: 7.5, avgQuality: 'AA-', aum: '$5.9B', yield: '3.5%', summary: 'Broad Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': '~60', 'Corporate': '~35', 'Other': '~5'} },
        'VSB': { name: 'Vanguard Canadian Short-Term Bond Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VSB', mer: 0.11, asset: 'Bond', index: 'Bloomberg GA CAD Float Adj 1-5 Yr', duration: 2.6, avgQuality: 'AA-', aum: '$1.8B', yield: '2.8%', summary: 'Short-term (1-5 yr) Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XSB': { name: 'iShares Core Canadian Short Term Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239496/', mer: 0.10, asset: 'Bond', index: 'FTSE Canada Short Term Bond', duration: 2.7, avgQuality: 'A+', aum: '$4.2B', yield: '3.9%', summary: 'Short-term Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZSB': { name: 'BMO Short-Term Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-short-term-bond-index-etf-zsb/', mer: 0.11, asset: 'Bond', index: 'FTSE Canada Short Term Overall Bond', duration: 2.6, avgQuality: 'A+', aum: '[AUM]', yield: '3.9%', summary: 'Short-term Canadian investment-grade bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZDB': { name: 'BMO Discount Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-discount-bond-index-etf-zdb/', mer: 0.10, asset: 'Bond', index: 'FTSE Canada Discount Bond', duration: 7.8, avgQuality: 'AA-', aum: '[AUM]', yield: '2.5%', summary: 'Holds bonds trading below par, potentially more tax-efficient capital gains.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': '~70', 'Corporate': '~30'} },
        'VCB': { name: 'Vanguard Canadian Corporate Bond Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VCB', mer: 0.17, asset: 'Bond', index: 'Bloomberg GA CAD Float Adj Corp', duration: '[Dur]', avgQuality: '[Qual]', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian investment-grade corporate bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Corporate': 100} },
        'XCB': { name: 'iShares Core Canadian Corporate Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239495/', mer: 0.17, asset: 'Bond', index: 'FTSE Canada All Corporate Bond', duration: 5.68, avgQuality: 'BBB+', aum: '$2.1B', yield: '3.99%', summary: 'Canadian investment-grade corporate bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Corporate': 100} },
        'ZCB': { name: 'BMO Corporate Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-corporate-bond-index-etf-zcb/', mer: 0.17, asset: 'Bond', index: 'FTSE Canada All Corporate Bond', duration: '[Dur]', avgQuality: '[Qual]', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian investment-grade corporate bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Corporate': 100} },
        'VGV': { name: 'Vanguard Canadian Government Bond Index ETF', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VGV', mer: 0.17, asset: 'Bond', index: 'Bloomberg GA CAD Float Adj Govt', duration: '[Dur]', avgQuality: 'AA+', aum: '$58M', yield: '[Yield]%', summary: 'Canadian government bonds (Federal/Provincial/Municipal).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 100} },
        'XGB': { name: 'iShares Core Canadian Government Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239497/', mer: 0.13, asset: 'Bond', index: 'FTSE Canada All Government Bond', duration: 7.81, avgQuality: 'AA', aum: '$1.5B', yield: '2.95%', summary: 'Canadian government bonds (Federal/Provincial/Municipal).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 100} },
        'ZGB': { name: 'BMO Government Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-government-bond-index-etf-zgb/', mer: 0.17, asset: 'Bond', index: 'FTSE Canada All Government Bond', duration: '[Dur]', avgQuality: 'AA', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian government bonds (Federal/Provincial/Municipal).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 100} },
        'XRB': { name: 'iShares Canadian Real Return Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239499/', mer: 0.39, asset: 'Bond', index: 'FTSE Canada Real Return Bond', duration: '[Dur]', avgQuality: 'AAA/AA+', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian Real Return Bonds (inflation protection).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 100} },
        'ZRR': { name: 'BMO Real Return Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-real-return-bond-index-etf-zrr/', mer: 0.28, asset: 'Bond', index: 'FTSE Canada Real Return Bond', duration: '[Dur]', avgQuality: 'AAA/AA+', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian Real Return Bonds (inflation protection).', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Government': 100} },
        'XHY': { name: 'iShares Canadian High Yield Bond Index ETF', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/239562/', mer: 0.66, asset: 'Bond', index: 'FTSE Canada High Yield Bond', duration: '[Dur]', avgQuality: 'BB/B', aum: '[AUM]', yield: '[Yield]%', summary: 'Canadian high-yield (junk) corporate bonds.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Corporate': 100} },
        'ZHY': { name: 'BMO High Yield US Corporate Bond Hedged CAD ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-high-yield-us-corporate-bond-hedged-to-cad-index-etf-zhy/', mer: 0.62, asset: 'Bond', index: 'Bloomberg US High Yield VLI (CAD Hedged)', duration: '[Dur]', avgQuality: 'BB/B', aum: '[AUM]', yield: '[Yield]%', summary: 'US high-yield (junk) corporate bonds, CAD hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {'Corporate': 100} },
        'VBG': { name: 'Vanguard Global Aggregate Bond Index ETF (CAD-hedged)', provider: 'Vanguard', url: 'https://www.vanguard.ca/en/advisor/products/products-group/etfs/VBG', mer: 0.34, asset: 'Bond', index: 'Bloomberg Global Agg Float Adj (CAD Hedged)', duration: '[Dur]', avgQuality: '[Qual]', aum: '[AUM]', yield: '[Yield]%', summary: 'Global investment-grade bonds, CAD hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'XAGG': { name: 'iShares Core Global Aggregate Bond Index ETF (CAD-Hedged)', provider: 'iShares', url: 'https://www.blackrock.com/ca/investors/en/products/281781/', mer: 0.22, asset: 'Bond', index: 'Bloomberg Global Agg (CAD Hedged)', duration: '[Dur]', avgQuality: '[Qual]', aum: '[AUM]', yield: '[Yield]%', summary: 'Global investment-grade bonds, CAD hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: [], sectors: {} },
        'ZGGG': { name: 'BMO Global Aggregate Bond Index ETF', provider: 'BMO', url: 'https://www.bmogam.com/ca/en/advisors/investment-solutions/etf/bmo-global-aggregate-bond-index-etf-zggg/', mer: 0.28, asset: 'Bond', index: 'Bloomberg Global Agg (CAD Hedged)', duration: '[Dur]', avgQuality: '[Qual]', aum: '[AUM]', yield: '[Yield]%', summary: 'Global investment-grade bonds, CAD hedged.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: [], sectors: {} },
        // High Interest Savings (Note: Yield is variable, MER often deducted from yield)
        'CASH': { name: 'Horizons High Interest Savings ETF', provider: 'Horizons', url: 'https://horizonsetfs.com/ETF/cash/', mer: 0.13, asset: 'Cash Equivalent', index: 'N/A (Deposits)', duration: 0, avgQuality: 'Bank Deposits', aum: '[AUM]', yield: '[Variable High Yield]%', summary: 'Holds cash deposits at Schedule I banks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "N/A", topHoldings: ['Cash Deposits'], sectors: {'Cash': 100} },
        'HISA': { name: 'Evolve High Interest Savings Account Fund', provider: 'Evolve', url: 'https://evolveetfs.com/product/hisa/', mer: 0.15, asset: 'Cash Equivalent', index: 'N/A (Deposits)', duration: 0, avgQuality: 'Bank Deposits', aum: '[AUM]', yield: '[Variable High Yield]%', summary: 'Holds cash deposits at Schedule I banks.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: ['Cash Deposits'], sectors: {'Cash': 100} },
        'PSA': { name: 'Purpose High Interest Savings ETF', provider: 'Purpose', url: 'https://www.purposeinvest.com/funds/purpose-high-interest-savings-etf', mer: 0.14, asset: 'Cash Equivalent', index: 'N/A (Deposits)', duration: 0, avgQuality: 'Bank Deposits', aum: '[AUM]', yield: '[Variable High Yield]%', summary: 'Holds cash deposits at Schedule I banks.', perf1Y: "[Perf%]", perf3Y: "[Perf%]", perf5Y: "[Perf%]", topHoldings: ['Cash Deposits'], sectors: {'Cash': 100} },
        'NSAV': { name: 'Ninepoint High Interest Savings Fund ETF Series', provider: 'Ninepoint', url: 'https://www.ninepoint.com/funds/ninepoint-high-interest-savings-fund/', mer: 0.14, asset: 'Cash Equivalent', index: 'N/A (Deposits)', duration: 0, avgQuality: 'Bank Deposits', aum: '[AUM]', yield: '[Variable High Yield]%', summary: 'Holds cash deposits, primarily National Bank.', perf1Y: "[Perf%]", perf3Y: "N/A", perf5Y: "N/A", topHoldings: ['Cash Deposits'], sectors: {'Cash': 100} },

    }; // End etfData


    // --- DOM Elements & State ---
    // Selectors need to be specific to the page or check if elements exist
    const currentPath = window.location.pathname.split("/").pop() || 'index.html'; // Get current HTML filename, default to index
    let etfCheckboxes, usEtfCheckboxes, comparisonOutput, comparisonArea, selectionMessage, usComparisonOutput, usComparisonArea, usSelectionMessage, copyButtons;
    let selectedETFs = [];
    let selectedUSEtfs = [];
    let activeCharts = {};

    // --- Element Selection & Listener Attachment ---
    function initializePageSpecificElements() {
        console.log("Initializing elements for page:", currentPath);
        // Comparison Tool Elements (Canadian) - Used on multiple pages
        etfCheckboxes = document.querySelectorAll('#etf-selector .etf-select-item input[type="checkbox"]');
        comparisonOutput = document.getElementById('comparison-output');
        comparisonArea = document.getElementById('comparison-area');
        selectionMessage = document.getElementById('selection-message');

        if (etfCheckboxes.length > 0 && comparisonOutput && comparisonArea && selectionMessage) {
            console.log("Found Canadian ETF comparison elements.");
            etfCheckboxes.forEach(c => c.addEventListener('change', (e) => handleSelectionChange(e, 'CAN')));
        } else {
            // Only warn if we expect these elements on the current page
            const comparisonPages = ['all-in-one-etfs.html', 'factor.html', 'crypto.html', 'thematic.html', 'sectors.html', 'regions.html', 'fixed-income.html', 'commodities.html'];
            if (comparisonPages.includes(currentPath)) {
                console.warn("DOM elements for Canadian ETF comparison might be missing on:", currentPath);
            }
        }

        // US Comparison Tool Elements (Currently only on Factor page)
        if (currentPath === 'factor.html') {
            usEtfCheckboxes = document.querySelectorAll('#us-etf-selector .etf-select-item input[type="checkbox"]');
            usComparisonOutput = document.getElementById('us-comparison-output');
            usComparisonArea = document.getElementById('us-comparison-area');
            usSelectionMessage = document.getElementById('us-selection-message');
            if (usEtfCheckboxes.length > 0 && usComparisonOutput && usComparisonArea && usSelectionMessage) {
                 console.log("Found US ETF comparison elements.");
                 usEtfCheckboxes.forEach(c => c.addEventListener('change', (e) => handleSelectionChange(e, 'USA')));
            } else {
                 console.warn("DOM elements for US ETF comparison might be missing on factor.html");
            }
        }

        // Copy Button Elements (Currently only on Index page)
        if (currentPath === 'index.html') {
            copyButtons = document.querySelectorAll('.copy-button');
            if (copyButtons.length > 0) {
                console.log("Found copy buttons.");
                 copyButtons.forEach(button => {
                     button.addEventListener('click', handleCopyToClipboard);
                     const feedback = button.querySelector('.copy-feedback');
                     if (feedback && !feedback.dataset.originalText) { // Store original text only once
                        feedback.dataset.originalText = feedback.textContent;
                     }
                 });
             } else { console.log("No copy buttons found on index.html."); }
        }
    }

    initializePageSpecificElements(); // Call the function to set up elements and listeners


    // --- Main Logic Functions ---

    function handleSelectionChange(event, type) {
        // console.log(`Selection change detected for type: ${type}`); // Reduce console noise slightly
        const ticker = event.target.value; const isChecked = event.target.checked; const listItem = event.target.closest('.etf-select-item'); if (!listItem) return;
        let currentSelection = (type === 'USA') ? selectedUSEtfs : selectedETFs;
        // Get references inside the function to ensure they are available if elements were dynamically added (though unlikely here)
        const messageElement = (type === 'USA') ? document.getElementById('us-selection-message') : document.getElementById('selection-message');
        const areaElement = (type === 'USA') ? document.getElementById('us-comparison-area') : document.getElementById('comparison-area');
        const outputElement = (type === 'USA') ? document.getElementById('us-comparison-output') : document.getElementById('comparison-output');


        if (isChecked) { if (!currentSelection.includes(ticker)) currentSelection.push(ticker); listItem.classList.add('selected'); }
        else { currentSelection = currentSelection.filter(t => t !== ticker); listItem.classList.remove('selected'); }

        // Update the correct selection array
        if (type === 'USA') { selectedUSEtfs = currentSelection; } else { selectedETFs = currentSelection; }
        // console.log(`Selected ${type} ETFs:`, currentSelection);

        // Enforce Max 3 selection
        if (currentSelection.length > 3) {
            if(messageElement){messageElement.textContent = 'Max 3 ETFs.'; messageElement.style.display = 'block';}
            event.target.checked = false; // Uncheck the box
             listItem.classList.remove('selected'); // Remove selected style
             // Filter out the just-added ticker AFTER unchecking
             currentSelection = currentSelection.filter(t => t !== ticker);
             if (type === 'USA') { selectedUSEtfs = currentSelection; } else { selectedETFs = currentSelection; }
             // Hide message again immediately if count is now valid (can happen if user unchecks quickly)
             if (currentSelection.length <= 3 && messageElement){messageElement.style.display = 'none';}
             return; // Stop further processing for this event
        } else {
             if(messageElement) messageElement.style.display = 'none'; // Hide message if selection is valid
        }

        // Trigger comparison display or clearing
        if (currentSelection.length >= 2 && currentSelection.length <= 3) {
             if (!outputElement || !areaElement) { console.error(`Comparison elements missing for ${type} on ${currentPath}`); return; }
             // console.log(`Triggering display comparison for type: ${type}`);
             const finalSelection = (type === 'USA') ? selectedUSEtfs : selectedETFs;
              // Double check length before displaying
             if (finalSelection.length >= 2 && finalSelection.length <= 3) {
                 displayComparison(finalSelection, outputElement, type);
                 areaElement.classList.add('visible'); areaElement.style.display = 'block';
             } else { // If somehow length changed between checks, clear instead
                  if (outputElement) outputElement.innerHTML = '';
                  if (areaElement) { areaElement.classList.remove('visible'); areaElement.style.display = 'none'; }
                  destroyChartsByType(type);
             }
        } else { // Less than 2 selected
             // console.log(`Clearing comparison area for type: ${type}`);
             if (outputElement) outputElement.innerHTML = '';
             if (areaElement) { areaElement.classList.remove('visible'); areaElement.style.display = 'none'; }
             destroyChartsByType(type);
        }
    } // End handleSelectionChange


    function displayComparison(tickers, comparisonOutputElement, type) {
        console.log(`Running displayComparison for type ${type}:`, tickers);
        comparisonOutputElement.innerHTML = ''; // Clear previous content
        destroyChartsByType(type); // Clear existing charts for this type

        // Find Min/Max MER for highlighting
        let minMerValue=Infinity, maxMerValue=-Infinity, validMersFound=false;
        tickers.forEach(t => {const d=etfData[t]; if(d && typeof d.mer==='number'){validMersFound=true; if(d.mer<minMerValue)minMerValue=d.mer; if(d.mer>maxMerValue)maxMerValue=d.mer;}});
        let minMerTickers=[], maxMerTickers=[];
        if(validMersFound && minMerValue !== maxMerValue){tickers.forEach(t => {const d=etfData[t]; if(d && d.mer===minMerValue)minMerTickers.push(t); if(d && d.mer===maxMerValue)maxMerTickers.push(t);});}

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'comparison-container';

        // Determine if comparison involves types needing Geo/Sector charts skipped
         let skipGeoSector = tickers.some(t => {
             const data = etfData[t];
             return data?.asset === 'Bitcoin' ||
                    data?.asset === 'Ethereum' ||
                    data?.asset === 'Gold Bullion' || // Added specific commodity
                    data?.asset === 'Silver Bullion' || // Added specific commodity
                    data?.asset === 'Crude Oil Futures' || // Added specific commodity
                    data?.asset === 'Cash Equivalent' || // Added Cash
                    data?.asset === 'Commodity/Futures' || // e.g., CARB
                    (data?.sectors && Object.keys(data.sectors).length === 1 && (data.sectors['Crypto'] === 100 || data.sectors['Carbon Credits'] === 100 || data.sectors['Commodity'] === 100 || data.sectors['Cash'] === 100)); // Added Commodity/Cash single sector
         });
         // Also skip if factor or thematic as data is often unavailable/requires manual entry OR if fixed income (geo/sector not relevant)
        let isFactorOrThematic = tickers.some(t => etfData[t]?.factorFocus || etfData[t]?.themeFocus);
        let isFixedIncome = tickers.some(t => etfData[t]?.asset === 'Bond');
        if (isFactorOrThematic || isFixedIncome) {
             skipGeoSector = true;
             if (isFactorOrThematic) console.log("Skipping Geo/Sector charts for Factor/Thematic ETFs.");
             if (isFixedIncome) console.log("Skipping Geo/Sector charts for Fixed Income ETFs.");
        }


        tickers.forEach((ticker, index) => {
            const data = etfData[ticker];
            if (!data) { console.error(`Data missing for ${ticker}`); return; }

            const card = document.createElement('div'); card.classList.add('comparison-card');
            card.style.animation = `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`; card.style.opacity = '0';

            const displayYield = data.yield || '[N/A]'; const displayAUM = data.aum || '[N/A]';
            let merClass = minMerTickers.includes(ticker) ? 'lowest-mer' : maxMerTickers.includes(ticker) ? 'highest-mer' : '';

            // --- Performance Data Display ---
            const formatPerf = (perf) => (typeof perf === 'number' ? `${perf.toFixed(1)}%` : (perf || '[N/A]'));
            // Check if ANY performance data exists beyond the placeholder string
            const perfExists = (typeof data.perf1Y === 'number' || (data.perf1Y && data.perf1Y !== '[Perf%]')) ||
                               (typeof data.perf3Y === 'number' || (data.perf3Y && data.perf3Y !== '[Perf%]')) ||
                               (typeof data.perf5Y === 'number' || (data.perf5Y && data.perf5Y !== '[Perf%]'));
            const performanceHTML = perfExists ? `
                <li><strong>Perf 1Yr:</strong> <span>${formatPerf(data.perf1Y)}</span></li>
                <li><strong>Perf 3Yr:</strong> <span>${formatPerf(data.perf3Y)}</span></li>
                <li><strong>Perf 5Yr:</strong> <span>${formatPerf(data.perf5Y)}</span></li>`
                : ''; // Show nothing if no real perf data


             // --- Top Holdings List ---
            let topHoldingsHTML = '<h4 style="margin-top: 1.5rem;">Top Holdings</h4>';
            if (data.topHoldings && Array.isArray(data.topHoldings)) {
                 const actualHoldings = data.topHoldings.filter(h => typeof h === 'string' && !h.startsWith('[') && h !== 'Swap Counterparty' && h !== 'Various Equities & Futures' && h !== 'Cash Deposits'); // Filter out placeholders and generic swap/multi-asset/cash text
                 if (actualHoldings.length > 0) {
                      topHoldingsHTML += '<ul class="top-holdings-list">';
                      actualHoldings.slice(0, 10).forEach(h => { topHoldingsHTML += `<li>${h}</li>`; });
                      topHoldingsHTML += '</ul>';
                 } else if (data.topHoldings.includes('Swap Counterparty')) {
                      topHoldingsHTML += '<p class="chart-unavailable">[Swap-based structure - no direct holdings]</p>';
                 } else if (data.topHoldings.includes('Various Equities & Futures')) {
                     topHoldingsHTML += '<p class="chart-unavailable">[Diverse mix - see provider]</p>';
                 } else if (data.topHoldings.includes('Cash Deposits')) {
                     topHoldingsHTML += '<p class="chart-unavailable">[Holds deposits at Schedule I banks]</p>';
                 } else if (data.topHoldings.length > 0 && data.topHoldings[0].startsWith('[')) {
                     // Only show placeholder text if the array exists but contains only placeholders
                      topHoldingsHTML += '<p class="chart-unavailable">[Data needs update]</p>';
                 } else {
                      // Array exists but is empty or contains irrelevant data
                      topHoldingsHTML += '<p class="chart-unavailable">[N/A or Needs Update]</p>';
                 }
            } else {
                 // topHoldings property doesn't exist or isn't an array
                 topHoldingsHTML += '<p class="chart-unavailable">[Data Structure Error]</p>';
            }
             // Override for single-asset ETFs (Commodity/Crypto)
             if (['Bitcoin', 'Ethereum', 'Gold Bullion', 'Silver Bullion', 'Crude Oil Futures'].includes(data.asset) || data.themeFocus === 'Carbon Credits') {
                  topHoldingsHTML = `<p style="font-size:0.9em; margin-top:1.5rem;"><em>Directly holds ${data.asset || data.themeFocus}.</em></p>`;
             }
            // Clear holdings section for Cash ETFs
            if (data.asset === 'Cash Equivalent') {
                 topHoldingsHTML = '';
            }


            // --- Specific Fields ---
            const assetInfo = data.asset ? `<li><strong>Asset Class:</strong> <span>${data.asset}</span></li>` : '';
            const factorInfo = data.factorFocus ? `<li><strong>Factor Focus:</strong> <span>${data.factorFocus}</span></li>` : '';
            const themeInfo = data.themeFocus ? `<li><strong>Theme Focus:</strong> <span>${data.themeFocus}</span></li>` : '';
            const indexInfo = data.index ? `<li><strong>Index/Strategy:</strong> <span>${data.index}</span></li>` : '';
            const geoFocusInfo = data.geoFocus ? `<li><strong>Geo Focus:</strong> <span>${data.geoFocus}</span></li>` : '';
            const structureInfo = data.structure ? `<li><strong>Structure:</strong> <span>${data.structure}</span></li>` : '';
            const custodianInfo = data.custodian ? `<li><strong><span class="tooltip" data-tooltip="Where the underlying assets (e.g., crypto) are held securely.">Custodian</span>:</strong> <span>${data.custodian}</span></li>` : '';
            const currencyInfo = data.currency ? `<li><strong>Currency:</strong> <span>${data.currency}</span></li>` : '';
            // Fixed Income Specific
            const durationInfo = data.duration !== undefined ? `<li><strong><span class="tooltip" data-tooltip="Measures sensitivity to interest rate changes (higher = more sensitive).">Duration</span>:</strong> <span>${typeof data.duration === 'number' ? data.duration + ' yrs' : data.duration}</span></li>` : ''; // Allow 0 or string
            const avgQualityInfo = data.avgQuality ? `<li><strong>Avg. Quality:</strong> <span>${data.avgQuality}</span></li>` : '';


            // --- Info List Construction ---
            const infoList = `
                <ul>
                    <li><strong>Provider:</strong> <span>${data.provider || '[N/A]'}</span></li>
                    <li><strong><span class="tooltip" data-tooltip="Management Expense Ratio: Annual fee charged to the fund.">MER</span>:</strong> <span class="${merClass}">${data.mer !== undefined ? data.mer.toFixed(2) + '%' : '[N/A]'}</span></li>
                    ${assetInfo} ${factorInfo} ${themeInfo} ${indexInfo} ${geoFocusInfo}
                    ${data.equity !== undefined && !data.asset && !data.factorFocus && !data.themeFocus ? `<li><strong>Equity %:</strong> <span>${data.equity}%</span></li>` : ''}
                    ${data.bond !== undefined && !data.asset && !data.factorFocus && !data.themeFocus ? `<li><strong>Bond %:</strong> <span>${data.bond}%</span></li>` : ''}
                    ${currencyInfo} ${structureInfo} ${custodianInfo} ${durationInfo} ${avgQualityInfo}
                    <li><strong>Dist. Yield:</strong> <span>${displayYield}</span></li>
                    <li><strong><span class="tooltip" data-tooltip="Assets Under Management: Total value of assets held by the fund.">AUM</span>:</strong> <span>${displayAUM}</span></li>
                    ${performanceHTML}
                    ${data.summary ? `<li><strong>Notes:</strong> <span>${data.summary}</span></li>` : ''}
                </ul>
                ${topHoldingsHTML}`;

            const titleLink = data.url ? `<a href="${data.url}" target="_blank" rel="noopener noreferrer">${ticker} - ${data.name || '?'}</a>` : `${ticker} - ${data.name || '?'}`;
            card.innerHTML = `<h3>${titleLink}</h3> ${infoList}`;
            cardsContainer.appendChild(card);
        });
        comparisonOutputElement.appendChild(cardsContainer);

        // --- Generate Comparison Charts ---
        if (tickers.length >= 2) {
            // Always add MER chart wrapper
            const idSuffix = (type === 'USA') ? '-us' : ''; // Ensure unique IDs for US vs CAN comparisons if on same page
            const merCanvasId = `mer-comparison-chart${idSuffix}`;
            const merChartWrapper = createChartWrapper(`mer-comparison-chart-wrapper${idSuffix}`, 'MER Comparison', merCanvasId);
            comparisonOutputElement.appendChild(merChartWrapper);

            // Conditionally add Geo/Sector chart wrappers
            let geoChartWrapper = null, sectorChartWrapper = null;
            const geoCanvasId = `geo-comparison-chart${idSuffix}`;
            const sectorCanvasId = `sector-comparison-chart${idSuffix}`;

            if (!skipGeoSector) {
                console.log("Adding Geo/Sector chart wrappers.");
                 geoChartWrapper = createChartWrapper(`geo-comparison-chart-wrapper${idSuffix}`, 'Geographic Allocation', geoCanvasId);
                 sectorChartWrapper = createChartWrapper(`sector-comparison-chart-wrapper${idSuffix}`, 'Sector Allocation', sectorCanvasId);
                 comparisonOutputElement.appendChild(geoChartWrapper);
                 comparisonOutputElement.appendChild(sectorChartWrapper);
            } else {
                console.log("Geo/Sector charts are being skipped for this selection.");
            }


            // Use requestAnimationFrame for chart rendering to ensure wrappers are in DOM
             requestAnimationFrame(() => {
                // console.log("Attempting to create charts in requestAnimationFrame...");
                // Always try to render MER chart
                const merCanvasElement = document.getElementById(merCanvasId);
                if (merCanvasElement) { createMerComparisonChart(merCanvasId, tickers, minMerTickers, maxMerTickers); if(merChartWrapper) merChartWrapper.style.opacity = '1'; }
                else { console.error("MER Canvas not found:", merCanvasId); }

                // Conditionally render Geo/Sector charts
                if (!skipGeoSector) {
                    const geoCanvasElement = document.getElementById(geoCanvasId);
                    if (geoCanvasElement) { createGroupedGeoChart(geoCanvasId, tickers); if(geoChartWrapper) geoChartWrapper.style.opacity = '1'; }
                    else { console.error("Geo Canvas not found:", geoCanvasId); }

                    const sectorCanvasElement = document.getElementById(sectorCanvasId);
                    if (sectorCanvasElement) { createGroupedSectorChart(sectorCanvasId, tickers); if(sectorChartWrapper) sectorChartWrapper.style.opacity = '1'; }
                    else { console.error("Sector Canvas not found:", sectorCanvasId); }
                }
             }); // End requestAnimationFrame
        }
    } // End displayComparison


    // --- Helper Functions ---
    function createChartWrapper(containerId, title, canvasId) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        wrapper.id = containerId;
        wrapper.style.opacity = '0'; // Start hidden for animation
        wrapper.innerHTML = `<h3>${title}</h3><div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
        return wrapper;
    }

     function destroyChartsByType(type) {
         const suffix = (type === 'USA') ? '-us' : '';
         const chartIdsToDestroy = [
             `mer-comparison-chart${suffix}`,
             `geo-comparison-chart${suffix}`,
             `sector-comparison-chart${suffix}`
         ];
         chartIdsToDestroy.forEach(id => {
             const chartInstance = Chart.getChart(id);
             if (chartInstance) {
                 // console.log(`Destroying chart: ${id}`);
                 chartInstance.destroy();
             }
             // Remove the wrapper div as well
             const wrapperId = id.replace('-chart', '-chart-wrapper');
             const wrapperElement = document.getElementById(wrapperId);
             if (wrapperElement) {
                // console.log(`Removing chart wrapper: ${wrapperId}`);
                wrapperElement.remove();
             }
         });
         // Clear the corresponding entry in activeCharts if needed (though direct ID check is fine)
         // delete activeCharts[type]; // Or handle more granularly if storing instances
     }


     function createMerComparisonChart(canvasId, tickers, minMerTickers, maxMerTickers) {
         const ctx = document.getElementById(canvasId);
         if (!ctx) { console.error(`Canvas element not found: ${canvasId}`); return; }
         const data = { labels: [], datasets: [{ label: 'MER (%)', data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] };
         const merData = []; // To check for actual data presence

         tickers.forEach(ticker => {
             const etf = etfData[ticker];
             if (etf && typeof etf.mer === 'number') {
                  data.labels.push(ticker);
                  data.datasets[0].data.push(etf.mer);
                  merData.push(etf.mer); // Add to check array
                  let bgColor = 'rgba(54, 162, 235, 0.6)'; // Default blue
                  let bdColor = 'rgba(54, 162, 235, 1)';
                  if (minMerTickers.includes(ticker)) { bgColor = 'rgba(40, 167, 69, 0.6)'; bdColor = 'rgba(40, 167, 69, 1)'; } // Green
                  else if (maxMerTickers.includes(ticker)) { bgColor = 'rgba(220, 53, 69, 0.6)'; bdColor = 'rgba(220, 53, 69, 1)'; } // Red
                  data.datasets[0].backgroundColor.push(bgColor);
                  data.datasets[0].borderColor.push(bdColor);
              } else {
                   console.warn(`MER data missing or invalid for ${ticker}`);
                   data.labels.push(`${ticker} (No MER)`); // Add label even if no data
                   data.datasets[0].data.push(NaN); // Push NaN to keep alignment, chart.js handles gaps
                   data.datasets[0].backgroundColor.push('rgba(200, 200, 200, 0.6)'); // Grey for missing
                   data.datasets[0].borderColor.push('rgba(200, 200, 200, 1)');
              }
         });

         // Check if any valid MER data was actually found
         const hasValidData = merData.length > 0 && merData.some(val => !isNaN(val));

         if (!hasValidData) {
             const wrapper = ctx.closest('.chart-wrapper');
             if (wrapper) wrapper.innerHTML = '<p class="chart-unavailable">MER data unavailable for selected ETFs.</p>';
             return; // Don't create the chart
         }

         new Chart(ctx, {
             type: 'bar',
             data: data,
             options: {
                 indexAxis: 'y', // Horizontal bars
                 scales: { x: { beginAtZero: true, title: { display: true, text: 'MER (%)' } } },
                 plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}%` } } }
             }
         });
     }

     function createGroupedGeoChart(canvasId, tickers) {
         const ctx = document.getElementById(canvasId);
         if (!ctx) { console.error(`Canvas element not found: ${canvasId}`); return; }
         const labels = tickers;
         const datasets = [];
         const geoCategories = new Set(); // Dynamically find all categories present
         let dataFound = false;

         tickers.forEach(ticker => {
             const etf = etfData[ticker];
             if (etf && etf.geo && typeof etf.geo === 'object' && Object.keys(etf.geo).length > 0) {
                 // Check if values are actual numbers and not placeholders like 'Fixed Income' string
                 if (Object.values(etf.geo).some(v => typeof v === 'number')) {
                     dataFound = true;
                     Object.keys(etf.geo).forEach(cat => geoCategories.add(cat));
                 }
             }
         });


         if (!dataFound) {
              const wrapper = ctx.closest('.chart-wrapper');
              if(wrapper) wrapper.innerHTML = '<p class="chart-unavailable">Geographic allocation data unavailable for selected ETFs.</p>';
              return; // Don't create the chart if no data at all
         }


         // Define colors for categories - add more if needed
          const colorMap = {
             'US': 'rgba(54, 162, 235, 0.7)', 'Canada': 'rgba(255, 99, 132, 0.7)', 'Intl Dev': 'rgba(75, 192, 192, 0.7)',
             'Emerging': 'rgba(255, 206, 86, 0.7)', 'Global': 'rgba(153, 102, 255, 0.7)', 'Fixed Income': 'rgba(100, 100, 100, 0.7)', // Add Fixed Income for Asset Allocation
             'Crypto': 'rgba(255, 159, 64, 0.7)', // Added crypto
             'Other': 'rgba(201, 203, 207, 0.7)'
         };
         let colorIndex = 0;
         const categoryColors = {};
         // Sort categories for consistent order (optional)
         const sortedGeoCategories = Array.from(geoCategories).sort((a, b) => {
             // Prioritize major regions, then FI, then Crypto, then Other
             const order = { 'Canada': 1, 'US': 2, 'Intl Dev': 3, 'Emerging': 4, 'Global': 5, 'Fixed Income': 6, 'Crypto': 7, 'Other': 99 };
             return (order[a] || 50) - (order[b] || 50);
          });

         sortedGeoCategories.forEach(cat => {
             if (!categoryColors[cat]) {
                 categoryColors[cat] = colorMap[cat] || Object.values(colorMap)[colorIndex % Object.keys(colorMap).length];
                 colorIndex++;
             }
         });


         sortedGeoCategories.forEach(category => {
             const dataset = { label: category, data: [], backgroundColor: categoryColors[category], stack: 'geoStack' }; // Use stack property
             tickers.forEach(ticker => {
                 const etf = etfData[ticker];
                 // Ensure the value is a number before pushing
                 const value = etf?.geo?.[category];
                 dataset.data.push(typeof value === 'number' ? value : 0); // Add 0 if category missing or not a number
             });
             // Only add dataset if it contains actual data > 0
             if (dataset.data.some(d => d > 0)) {
                datasets.push(dataset);
             }
         });

        // Don't create chart if no valid datasets were added
        if (datasets.length === 0) {
             const wrapper = ctx.closest('.chart-wrapper');
             if(wrapper) wrapper.innerHTML = '<p class="chart-unavailable">Valid geographic allocation data unavailable for comparison.</p>';
             return;
        }


         new Chart(ctx, {
             type: 'bar',
             data: { labels: labels, datasets: datasets },
             options: {
                 indexAxis: 'y', // Grouped horizontal bars
                 scales: {
                     x: { stacked: true, beginAtZero: true, title: { display: true, text: 'Allocation (%)' }, max: 100 }, // Ensure max 100 for percentages
                     y: { stacked: true }
                 },
                 plugins: {
                     legend: { position: 'bottom' },
                     tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%` } }
                 },
                  maintainAspectRatio: false // Allows canvas to resize based on container
             }
         });
     }

     function createGroupedSectorChart(canvasId, tickers) {
         const ctx = document.getElementById(canvasId);
         if (!ctx) { console.error(`Canvas element not found: ${canvasId}`); return; }
         const labels = tickers;
         const datasets = [];
         const sectorCategories = new Set();
         let dataFound = false;

         tickers.forEach(ticker => {
             const etf = etfData[ticker];
             if (etf && etf.sectors && typeof etf.sectors === 'object' && Object.keys(etf.sectors).length > 0) {
                 // Check if values are actual numbers
                 if (Object.values(etf.sectors).some(v => typeof v === 'number')) {
                    dataFound = true;
                    Object.keys(etf.sectors).forEach(cat => sectorCategories.add(cat));
                 }
             }
         });

        if (!dataFound) {
            const wrapper = ctx.closest('.chart-wrapper');
            if(wrapper) wrapper.innerHTML = '<p class="chart-unavailable">Sector allocation data unavailable for selected ETFs.</p>';
            return; // Don't create chart if no data
        }


         // Define colors - more needed for sectors
         const colorMap = {
             'Information Technology': 'rgba(255, 99, 132, 0.7)', 'Financials': 'rgba(54, 162, 235, 0.7)', 'Health Care': 'rgba(255, 206, 86, 0.7)',
             'Industrials': 'rgba(75, 192, 192, 0.7)', 'Consumer Discretionary': 'rgba(153, 102, 255, 0.7)', 'Energy': 'rgba(255, 159, 64, 0.7)',
             'Materials': 'rgba(199, 199, 199, 0.7)', 'Consumer Staples': 'rgba(83, 102, 255, 0.7)', 'Utilities': 'rgba(10, 200, 100, 0.7)',
             'Communication Services': 'rgba(230, 50, 150, 0.7)', 'Real Estate': 'rgba(140, 80, 30, 0.7)', 'Fixed Income': 'rgba(100, 100, 100, 0.7)',
             'Crypto': 'rgba(255, 159, 64, 0.7)', 'Carbon Credits': 'rgba(0, 100, 0, 0.7)', 'Commodity': 'rgba(165, 42, 42, 0.7)', // Brown for Commodity
             'Government': 'rgba(128, 128, 128, 0.7)', 'Corporate': 'rgba(169, 169, 169, 0.7)', // Greys for bond types
             'Cash': 'rgba(189, 183, 107, 0.7)', // Dark Khaki for Cash
             'Other': 'rgba(201, 203, 207, 0.7)'
          };
          let colorIndex = 0;
          const categoryColors = {};
          // Sort categories for consistent order (optional, using GICS standard order loosely)
          const sortedSectorCategories = Array.from(sectorCategories).sort((a, b) => {
             const order = { 'Energy': 1, 'Materials': 2, 'Industrials': 3, 'Consumer Discretionary': 4, 'Consumer Staples': 5, 'Health Care': 6, 'Financials': 7, 'Information Technology': 8, 'Communication Services': 9, 'Utilities': 10, 'Real Estate': 11, 'Fixed Income': 12, 'Government': 13, 'Corporate': 14, 'Commodity': 15, 'Crypto': 16, 'Carbon Credits': 17, 'Cash': 18, 'Other': 99 };
             return (order[a] || 50) - (order[b] || 50);
          });

          sortedSectorCategories.forEach(cat => {
              if (!categoryColors[cat]) {
                  categoryColors[cat] = colorMap[cat] || Object.values(colorMap)[colorIndex % Object.keys(colorMap).length];
                  colorIndex++;
              }
          });


         sortedSectorCategories.forEach(category => {
             const dataset = { label: category, data: [], backgroundColor: categoryColors[category], stack: 'sectorStack' };
             tickers.forEach(ticker => {
                 const etf = etfData[ticker];
                 // Ensure value is a number
                 const value = etf?.sectors?.[category];
                 dataset.data.push(typeof value === 'number' ? value : 0);
             });
             // Only add dataset if it contains actual data > 0
              if (dataset.data.some(d => d > 0)) {
                 datasets.push(dataset);
              }
         });

         // Don't create chart if no valid datasets were added
         if (datasets.length === 0) {
              const wrapper = ctx.closest('.chart-wrapper');
              if(wrapper) wrapper.innerHTML = '<p class="chart-unavailable">Valid sector allocation data unavailable for comparison.</p>';
              return;
         }

         new Chart(ctx, {
             type: 'bar',
             data: { labels: labels, datasets: datasets },
             options: {
                 indexAxis: 'y',
                 scales: {
                     x: { stacked: true, beginAtZero: true, title: { display: true, text: 'Allocation (%)' }, max: 100 },
                     y: { stacked: true }
                 },
                 plugins: {
                     legend: { position: 'bottom' },
                     tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%` } }
                 },
                 maintainAspectRatio: false
             }
         });
     }

    // --- Copy to Clipboard Functionality ---
    function handleCopyToClipboard(event) {
        const button = event.currentTarget;
        const textToCopy = button.getAttribute('data-copy-text');
        const feedbackElement = button.querySelector('.copy-feedback');

        if (!textToCopy || !feedbackElement) {
            console.error("Copy button missing data-copy-text or feedback element.");
            return;
        }
        const originalText = feedbackElement.dataset.originalText || feedbackElement.textContent; // Use stored original text

        navigator.clipboard.writeText(textToCopy).then(() => {
            feedbackElement.textContent = 'Copied!';
            feedbackElement.classList.add('copied'); // Optional: for styling
            // Revert after delay
            setTimeout(() => {
                feedbackElement.textContent = originalText;
                feedbackElement.classList.remove('copied');
            }, 2000); // Revert after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            feedbackElement.textContent = 'Copy Failed!';
             // Revert after delay
            setTimeout(() => {
                feedbackElement.textContent = originalText;
            }, 2000);
        });
    }


    // Inject CSS for chart error messages if needed (optional enhancement)
    if (!document.getElementById('chart-message-styles')) {
        const style = document.createElement('style');
        style.id = 'chart-message-styles';
        style.textContent = `
            .chart-unavailable, .chart-error {
                text-align: center;
                padding: 2rem 1rem;
                font-size: 0.9em;
                color: #666;
                margin-top: 1rem;
                background-color: #f8f9fa;
                border-radius: 4px;
            }
            .chart-error { color: #dc3545; font-weight: bold;}
        `;
        document.head.appendChild(style);
    }

}); // End DOMContentLoaded listener