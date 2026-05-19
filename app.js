const API_URL = 'https://open.er-api.com/v6/latest/CAD';
const CACHE_KEY = 'cadcrc_cache';

let rate = null;

const cadInput = document.getElementById('cad-input');
const crcInput = document.getElementById('crc-input');
const rateValue = document.getElementById('rate-value');
const rateDate = document.getElementById('rate-date');
const statusEl = document.getElementById('status');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtRate(r) {
  return r.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

async function fetchRate() {
  const today = todayISO();
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  if (cached?.date === today && cached?.rate) {
    return { rate: cached.rate, date: cached.date };
  }
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const r = data.rates.CRC;
  localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: r, date: today }));
  return { rate: r, date: today };
}

function applyRate(r, date, offline) {
  rate = r;
  rateValue.textContent = `1 CAD = ₡${fmtRate(r)} CRC`;
  rateDate.textContent = `Actualizado: ${fmtDate(date)}`;
  cadInput.disabled = false;
  crcInput.disabled = false;
  if (offline) {
    setStatus(`Sin conexión. Usando tasa del ${fmtDate(date)}.`, 'warn');
  }
}

function setStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.className = 'status' + (cls ? ` ${cls}` : '');
}

async function init() {
  rateValue.textContent = 'Obteniendo tasa...';
  try {
    const { rate: r, date } = await fetchRate();
    applyRate(r, date, false);
  } catch {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached?.rate) {
      applyRate(cached.rate, cached.date, true);
    } else {
      rateValue.textContent = 'Error al obtener tasa';
      setStatus('Sin conexión y sin tasa guardada. Intentá de nuevo más tarde.', 'err');
    }
  }
}

cadInput.addEventListener('input', () => {
  if (!rate) return;
  const v = parseFloat(cadInput.value);
  crcInput.value = isNaN(v) ? '' : (v * rate).toFixed(2);
});

crcInput.addEventListener('input', () => {
  if (!rate) return;
  const v = parseFloat(crcInput.value);
  cadInput.value = isNaN(v) ? '' : (v / rate).toFixed(2);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

init();
