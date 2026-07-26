/**
 * NYC Housing Monitor - Ultra-Minimalist Application Engine & Background Canvas
 */

let allListings = [];
let filteredListings = [];
let activeSource = 'ALL';
let activeBeds = 'ANY';
let activeSort = 'NEWEST';
let map = null;
let markers = [];

document.addEventListener('DOMContentLoaded', async () => {
    initMandelbrotCanvas();
    await loadListings();
    initEventListeners();
    initMap();
    updateDashboard();
});

function generateZillowUrl(address, neighborhood, borough) {
    const cleanStr = `${address} ${neighborhood} ${borough} NYC`
        .replace(/[#,/.]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    return `https://www.zillow.com/homes/${encodeURIComponent(cleanStr)}_rb/`;
}

async function loadListings() {
    let jsonListings = [];
    try {
        const res = await fetch('listings.json');
        jsonListings = await res.json();
    } catch (e) {
        jsonListings = [];
    }

    // Load stored entries from localStorage
    let storedListings = [];
    try {
        const saved = localStorage.getItem('nyc_housing_monitor_entries');
        if (saved) storedListings = JSON.parse(saved);
    } catch (e) {
        storedListings = [];
    }

    // Combine and deduplicate
    const combinedMap = new Map();
    storedListings.forEach(item => combinedMap.set(item.id || item.address, item));
    jsonListings.forEach(item => {
        if (!combinedMap.has(item.id || item.address)) {
            combinedMap.set(item.id || item.address, item);
        }
    });

    allListings = Array.from(combinedMap.values());
    
    // Ensure all listings have zillowUrl
    allListings.forEach(item => {
        if (!item.zillowUrl) {
            item.zillowUrl = generateZillowUrl(item.address, item.neighborhood, item.borough || 'Manhattan');
        }
    });

    saveListingsToStorage();
    filteredListings = [...allListings];
}

function saveListingsToStorage() {
    try {
        localStorage.setItem('nyc_housing_monitor_entries', JSON.stringify(allListings));
    } catch (e) {
        console.warn('Unable to persist to localStorage');
    }
}

function updateDashboard() {
    applyFilters();
    renderMetrics();
    renderList();
    renderMapMarkers();
}

function applyFilters() {
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();

    filteredListings = allListings.filter(item => {
        // Source Filter
        if (activeSource !== 'ALL' && item.source !== activeSource) return false;

        // Beds Filter
        if (activeBeds !== 'ANY') {
            const bedCount = parseInt(activeBeds);
            if (bedCount === 3 && item.beds < 3) return false;
            if (bedCount < 3 && item.beds !== bedCount) return false;
        }

        // Search Query
        if (searchVal.length > 0) {
            const matchText = `${item.title} ${item.neighborhood} ${item.address} ${item.borough}`.toLowerCase();
            if (!matchText.includes(searchVal)) return false;
        }

        return true;
    });

    // Apply Sorting
    if (activeSort === 'PRICE_LOW') {
        filteredListings.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'PRICE_HIGH') {
        filteredListings.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'PRICE_DROP') {
        filteredListings.sort((a, b) => (a.priceChangePct || 0) - (b.priceChangePct || 0));
    } else {
        filteredListings.sort((a, b) => (a.id > b.id ? -1 : 1));
    }
}

function renderMetrics() {
    const totalCount = filteredListings.length;
    const govCount = filteredListings.filter(l => l.source === 'NYC Gov Direct').length;

    // Calculate Median Price
    const prices = filteredListings.map(l => l.price).sort((a, b) => a - b);
    let median = 0;
    if (prices.length > 0) {
        const mid = Math.floor(prices.length / 2);
        median = prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
    }

    // Avg $/sqft
    const sqftItems = filteredListings.filter(l => l.pricePerSqft > 0);
    const avgPsqft = sqftItems.length > 0
        ? Math.round(sqftItems.reduce((acc, l) => acc + l.pricePerSqft, 0) / sqftItems.length)
        : 0;

    // Top Price Drop
    const drops = filteredListings.map(l => l.priceChangePct || 0);
    const topDrop = drops.length > 0 ? Math.min(...drops) : 0;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-gov').textContent = govCount;
    document.getElementById('stat-median').textContent = median > 0 ? formatCurrencyShort(median) : '$0';
    document.getElementById('stat-psqft').textContent = avgPsqft > 0 ? `$${avgPsqft}` : 'N/A';
    document.getElementById('stat-topdrop').textContent = topDrop < 0 ? `${topDrop}%` : '0%';
}

function renderList() {
    const listEl = document.getElementById('entries-list');
    listEl.innerHTML = '';

    if (filteredListings.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem; opacity: 0.6; font-size: 1.3rem;">
                No housing entries match your query.
            </div>
        `;
        return;
    }

    filteredListings.forEach(item => {
        const row = document.createElement('div');
        row.className = 'entry-row';

        const priceDropHtml = item.priceChange < 0
            ? `<span class="entry-drop-tag">${item.priceChangePct}% (${formatCurrency(item.priceChange)})</span>`
            : '';

        const govTagHtml = item.source === 'NYC Gov Direct'
            ? `<span class="gov-badge">NYC Gov Direct (${item.govRegId || 'Verified'})</span>`
            : `<span>${item.source}</span>`;

        const zillowUrl = item.zillowUrl || generateZillowUrl(item.address, item.neighborhood, item.borough || 'Manhattan');

        row.innerHTML = `
            <div class="entry-row-header">
                <div class="entry-price-wrap">
                    <span class="entry-price">${formatCurrency(item.price)}</span>
                    ${item.priceChange < 0 ? `<span class="entry-orig-price">${formatCurrency(item.originalPrice)}</span>` : ''}
                    ${priceDropHtml}
                </div>

                <div class="entry-link-group">
                    <a href="${zillowUrl}" target="_blank" rel="noopener noreferrer" class="entry-source-link zillow-link">
                        View on Zillow ↗
                    </a>
                    <span class="sep">•</span>
                    <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="entry-source-link">
                        View on ${item.source} ↗
                    </a>
                </div>
            </div>

            <h2 class="entry-title">${item.title}</h2>

            <div class="entry-meta">
                <span>📍 ${item.address}, ${item.neighborhood}</span>
                <span class="meta-dot">•</span>
                <span>${item.beds === 0 ? 'Studio' : item.beds + ' bed'}</span>
                <span class="meta-dot">•</span>
                <span>${item.baths} bath</span>
                <span class="meta-dot">•</span>
                <span>${item.sqft} sqft ($${item.pricePerSqft}/sqft)</span>
                <span class="meta-dot">•</span>
                ${govTagHtml}
                <span class="meta-dot">•</span>
                <span style="opacity:0.6;">Detected ${item.detectedTime}</span>
            </div>
        `;

        listEl.appendChild(row);
    });
}

function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;

    map = L.map('map-container').setView([40.73061, -73.935242], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

function renderMapMarkers() {
    if (!map) return;

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    filteredListings.forEach(item => {
        if (!item.coordinates) return;

        const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="background:#1a1a1a; color:#f2f2f0; padding:2px 6px; border-radius:3px; font-weight:400; font-size:12px; border:1px solid rgba(255,255,255,0.2); font-family:serif; white-space:nowrap;">${formatCurrencyShort(item.price)}</div>`,
            iconSize: [50, 20],
            iconAnchor: [25, 10]
        });

        const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="padding:4px; font-family:serif;">
                <h4 style="margin:0 0 4px 0; font-size:15px;">${item.title}</h4>
                <p style="margin:0 0 4px 0; font-size:12px; opacity:0.8;">${item.address}, ${item.neighborhood}</p>
                <div style="font-weight:500; font-size:15px;">${formatCurrency(item.price)}</div>
            </div>
        `);

        markers.push(marker);
    });
}

function initEventListeners() {
    // Source Buttons
    document.querySelectorAll('.source-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeSource = e.currentTarget.dataset.source;
            updateDashboard();
        });
    });

    // Beds Pills
    document.querySelectorAll('#beds-filter .pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#beds-filter .pill').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeBeds = e.currentTarget.dataset.beds;
            updateDashboard();
        });
    });

    // Search Input
    document.getElementById('search-input').addEventListener('input', updateDashboard);

    // Sort Select
    document.getElementById('sort-select').addEventListener('change', (e) => {
        activeSort = e.target.value;
        updateDashboard();
    });

    // View Switcher
    const listBtn = document.getElementById('view-list');
    const mapBtn = document.getElementById('view-map');
    const listSec = document.getElementById('list-view');
    const mapSec = document.getElementById('map-view');

    listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
        listSec.classList.add('active');
        mapSec.classList.remove('active');
    });

    mapBtn.addEventListener('click', () => {
        mapBtn.classList.add('active');
        listBtn.classList.remove('active');
        mapSec.classList.add('active');
        listSec.classList.remove('active');
        setTimeout(() => { if (map) map.invalidateSize(); }, 200);
    });
}

function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function formatCurrencyShort(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
}

/* ================= MANDELBROT CANVAS BACKGROUND ================= */
function initMandelbrotCanvas() {
    const canvas = document.getElementById('mandelbrot-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let latticePoints = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        generateLattice();
    }

    function generateLattice() {
        latticePoints = [];
        const cols = width < 768 ? 60 : 110;
        const rows = Math.max(1, Math.floor(cols / (width / height)));
        const maxIter = 35;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const sx = (i / cols) * width;
                const sy = (j / rows) * height;
                
                if (Math.random() < 0.85) {
                    latticePoints.push({
                        x: sx,
                        y: sy,
                        radius: 0.85 + Math.random() * 0.4
                    });
                }
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const color = isDark ? 'rgba(240, 240, 235, 0.08)' : 'rgba(20, 20, 20, 0.07)';

        latticePoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });

        requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    render();
}
