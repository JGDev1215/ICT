(function(){
  'use strict';

  const VERSION = 'v0.8.8';
  const KEY = 'ict_cards_v078';
  const SETTINGS_KEY = 'ict_settings_v1';
  const DRAFT_KEY = 'ict_planner_draft_v1';
  const SYNC_QUEUE_KEY = 'ict_supabase_sync_queue_v1';
  const SYNC_TOMBSTONES_KEY = 'ict_supabase_tombstones_v1';
  const SYNC_ACCOUNT_DECISIONS_KEY = 'ict_supabase_account_sync_v1';
  const SCHEMA = 'ict_dol_sweep_export_v7';
  const NL = String.fromCharCode(10);
  const DQ = String.fromCharCode(34);
  const SQ = String.fromCharCode(39);
  const LEGACY = ['ict_cards_v077', 'ict_cards_v076', 'ict_dol_sweep_cards_v2', 'ict_slips_v1'];

  const root = typeof window !== 'undefined' ? window : globalThis;
  const doc = root.document || null;
  const app = doc ? doc.getElementById('app') : null;
  const runtimeConfig = root.ICT_CONFIG && typeof root.ICT_CONFIG === 'object' ? root.ICT_CONFIG : {};
  const configText = v => String(v == null ? '' : v).trim();
  const configNumber = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };
  const HOSTED_PRICE_API_BASE = configText(runtimeConfig.hostedPriceApiBase);
  const LOCAL_PRICE_API_BASE = configText(runtimeConfig.localPriceApiBase || 'http://127.0.0.1:8765/price');
  const PRICE_TIMEOUT_MS = configNumber(runtimeConfig.priceTimeoutMs, 8000);
  const PRICE_REFRESH_SECONDS = configNumber(runtimeConfig.priceRefreshSeconds, 30);
  const MAX_PRICE_INTEGER_DIGITS = 12;
  const MAX_PRICE_DECIMALS = 8;
  const SUPABASE_CARDS_TABLE = 'focus_cards';
  const SUPABASE_SETTINGS_TABLE = 'user_settings';
  const DEFAULT_SUPABASE_URL = 'https://cdcqklvvswzipmmvpzaj.supabase.co';
  const DEFAULT_ADMIN_SUPABASE_EMAIL = 'admin@ict.local';
  const ROUTES = ['home','planner','saved','profile','focus','review','timeline','liquidity-map','risk','component-gallery'];
  const NOTICE_LEVELS = ['good','warn','bad'];

  const instruments = ['MNQ','NQ','MES','ES','MYM','YM','RTY','M2K','MGC','GC','CL','BTCUSD','ETHUSD','EURUSD','GBPUSD'];
  const draws = [
    'Previous day high (PDH)',
    'Previous day low (PDL)',
    'Previous week high (PWH)',
    'Previous week low (PWL)',
    'Previous month high (PMH)',
    'Previous month low (PML)',
    'Asia high',
    'Asia low',
    'London high',
    'London low',
    'New York AM high',
    'New York AM low',
    'Session high',
    'Session low',
    'Relative equal highs (REH)',
    'Relative equal lows (REL)',
    'Old high / prior swing high',
    'Old low / prior swing low',
    'Buy-side liquidity above price',
    'Sell-side liquidity below price',
    'New Week Opening Gap (NWOG)',
    'New Day Opening Gap (NDOG)',
    'HTF fair value gap / imbalance',
    'Unfilled FVG / imbalance',
    'Midnight open',
    'Weekly open',
    'Opening range high',
    'Opening range low',
    'Other mapped liquidity'
  ];
  const times = ['London Killzone','Pre NY','NY AM','NY Lunch','London Close','During Macro','Outside Killzone','Today','Tomorrow','This week','Other / discretionary'];
  const conf = ['Low','Medium','High'];
  const tfs = ['15m','5m','3m','1m'];
  const liquidityTimeframes = ['Monthly','Weekly','Daily','4H','1H','15m','5m','3m','1m'];
  const sessions = ['London','Pre-New York','New York AM','New York PM','Other'];
  const outcomes = ['Open','Hit','Miss','Breakeven','Read'];
  const finalOutcomes = ['Hit','Miss','Breakeven','Read'];
  const biasOptions = ['Bullish','Bearish'];
  const marketTimeframes = ['Monthly','Weekly','Daily','4H','1H','15m'];
  const phaseOptions = ['Consolidation','Expansion','Retracement','Reversal'];
  const dolIds = ['dol1','dol2','dol3'];
  const riskDirections = ['Long','Short'];
  const riskRatios = ['1R','1.5R','2R','2.5R','3R','4R','5R'];
  const arrayTypes = ['SIBI','BISI','CE','OB','FVG','High','Low','Other'];
  const routeBehaviors = ['Respect','Disrespect','Pending','Untested'];
  const PRICE_DELAY_DISCLAIMER = 'Price may be delayed. Manual override is available.';
  const PRICE_SYMBOL_PATTERN = /^[A-Z0-9._=/-]{1,24}$/;
  const marketPhaseKeys = {
    Monthly: 'monthly',
    Weekly: 'weekly',
    Daily: 'daily',
    '4H': 'h4',
    '1H': 'h1',
    '15m': 'm15'
  };
  const potentialPhaseByPhase = {
    Consolidation: 'Expansion',
    Expansion: 'Retracement',
    Retracement: 'Expansion',
    Reversal: 'Consolidation'
  };
  const phaseContextText = {
    Consolidation: 'Monitor for expansion only after a range boundary and displacement are observed.',
    Expansion: 'Monitor for a pause or retracement only after delivery has already expanded.',
    Retracement: 'Monitor whether price resumes expansion or remains corrective.',
    Reversal: 'Monitor for acceptance and structure shift before treating context as changed.'
  };

  const defaultSettings = {
    defaultInstrument: '',
    defaultSession: '',
    theme: 'light',
    watchlist: [],
    riskDefaults: {
      plannedRiskPct: '',
      plannedR: '',
      maxLoss: ''
    }
  };

  function storage(){
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }

  function normTheme(value){
    return value === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme){
    if(!doc || !doc.documentElement) return;
    const mode = normTheme(theme);
    doc.documentElement.setAttribute('data-theme', mode);
    if(doc.body) doc.body.setAttribute('data-theme', mode);
    const meta = doc.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', mode === 'dark' ? '#101217' : '#FAFAF8');
  }

  function parse(s, d){
    try {
      return JSON.parse(s);
    } catch(e) {
      return d;
    }
  }

  function esc(v){
    return String(v == null ? '' : v)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll(DQ, '&quot;')
      .replaceAll(SQ, '&#39;');
  }

  function uid(){
    if(typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'card_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function isoNow(){
    return new Date().toISOString();
  }

  function nyTimestamp(value){
    const date = value ? new Date(value) : new Date();
    if(Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(',', '') + ' NY';
  }

  function nyDateInput(value){
    const date = value ? new Date(value) : new Date();
    if(Number.isNaN(date.getTime())) return '';
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return [parts.year, parts.month, parts.day].filter(Boolean).join('-');
  }

  function nyTimeInput(value){
    const date = value ? new Date(value) : new Date();
    if(Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  function isObject(v){
    return !!(v && typeof v === 'object' && !Array.isArray(v));
  }

  function asText(v){
    return String(v == null ? '' : v).trim();
  }

  function clean(v){
    const s = String(v || '').trim();
    if(s.toUpperCase() === 'N/A') return 'N/A';
    if(!s) return '';
    const normalised = /,/.test(s)
      ? (/^(?:0|[1-9]\d{0,2})(?:,\d{3})+(?:\.\d+)?$/.test(s) ? s.replaceAll(',', '') : '')
      : s;
    if(!normalised || !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(normalised)) return '';
    const parts = normalised.split('.');
    if(parts[0].replace(/^0+/, '').length > MAX_PRICE_INTEGER_DIGITS) return '';
    if(parts[1] && parts[1].length > MAX_PRICE_DECIMALS) return '';
    return normalised;
  }

  function cleanUrl(v){
    return String(v == null ? '' : v).trim();
  }

  function blank(){
    const x = {
      date: '',
      time: '',
      instrument: '',
      session: '',
      currentPrice: '',
      manualPriceNeededAck: false,
      bias: '',
      biasValidation: '',
      biasInvalidation: '',
      fvg: false,
      fvgTf: ''
    };
    for(let i = 1; i <= 3; i++){
      for(const p of ['dol', 'sweep']){
        x[p + i + 'Level'] = '';
        x[p + i + 'Draw'] = '';
        x[p + i + 'Tf'] = '';
        x[p + i + 'Taken'] = false;
        x[p + i + 'Confidence'] = '';
        x[p + i + 'HitTime'] = '';
      }
    }
    return x;
  }

  function normFields(o){
    const x = blank();
    const s = isObject(o) ? o : {};
    for(const k of Object.keys(x)){
      if(k === 'fvg' || k === 'manualPriceNeededAck') x[k] = s[k] === true || s[k] === 'yes' || s[k] === 'true';
      else if(k.endsWith('Taken')) x[k] = s[k] === true || s[k] === 'yes' || s[k] === 'true';
      else if(k === 'bias') x[k] = biasOptions.includes(s[k]) ? s[k] : '';
      else if(k === 'fvgTf') x[k] = tfs.includes(s[k]) ? s[k] : '';
      else if(k.endsWith('Tf')) x[k] = liquidityTimeframes.includes(s[k]) ? s[k] : '';
      else if(isPriceField(k)) x[k] = clean(s[k]);
      else x[k] = asText(s[k]);
    }
    return x;
  }

  function isPriceField(k){
    return k.includes('Level') || k === 'currentPrice';
  }

  function priceNumber(v){
    const s = clean(v);
    if(!s || s === 'N/A') return null;
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function priceValidationMessages(fields){
    const x = normFields(fields || {});
    const messages = [];
    if(x.currentPrice && x.currentPrice !== 'N/A' && priceNumber(x.currentPrice) == null){
      messages.push('Current price must be greater than 0.');
    }
    const invalidLevels = [];
    for(let i = 1; i <= 3; i++){
      for(const p of ['dol', 'sweep']){
        const key = p + i + 'Level';
        if(x[key] && x[key] !== 'N/A' && priceNumber(x[key]) == null){
          invalidLevels.push((p === 'dol' ? 'DOL ' : 'Sweep ') + i);
        }
      }
    }
    if(invalidLevels.length){
      messages.push('Price levels must be greater than 0: ' + invalidLevels.join(', ') + '.');
    }
    return messages;
  }

  function priceValidationHtml(fields){
    const messages = priceValidationMessages(fields);
    return messages.length ? `<div class='price-validation' role='alert'>${messages.map(m => `<p>${esc(m)}</p>`).join('')}</div>` : '';
  }

  function normalizePriceSymbol(symbol){
    return asText(symbol).toUpperCase().replace(/\s+/g, '');
  }

  function validPriceSymbol(symbol){
    const normal = normalizePriceSymbol(symbol);
    return !!(normal && PRICE_SYMBOL_PATTERN.test(normal) && /[A-Z0-9]/.test(normal));
  }

  function priceError(kind, message){
    const err = new Error(message || 'price helper unavailable');
    err.priceKind = kind || 'unavailable';
    return err;
  }

  function priceErrorKind(err){
    return err && err.priceKind ? err.priceKind : 'unavailable';
  }

  function validatePricePayload(data){
    const price = data && data.price != null ? clean(String(data.price)) : '';
    if(!price || priceNumber(price) == null) throw priceError('malformed', 'malformed price response');
    return Object.assign({}, data, {price});
  }

  function inferPriceSource(source){
    const s = asText(source);
    if(s) return s;
    if(priceFetchState === 'ok') return 'hosted-yfinance';
    return 'manual';
  }

  function priceSnapshot(fields, source, at){
    const flds = normFields(fields || {});
    const capturedAt = at || isoNow();
    return {
      price: flds.currentPrice || '',
      symbol: flds.instrument || '',
      source: flds.currentPrice ? inferPriceSource(source) : '',
      capturedAt,
      capturedAtNy: nyTimestamp(capturedAt),
      delayDisclaimer: PRICE_DELAY_DISCLAIMER
    };
  }

  function normPriceSnapshot(snapshot, fields, fallbackAt){
    const s = isObject(snapshot) ? snapshot : {};
    const flds = normFields(fields || {});
    const capturedAt = asText(s.capturedAt) || fallbackAt || isoNow();
    return {
      price: clean(s.price || flds.currentPrice),
      symbol: asText(s.symbol || flds.instrument),
      source: asText(s.source) || (s.price || flds.currentPrice ? 'manual' : ''),
      capturedAt,
      capturedAtNy: asText(s.capturedAtNy) || nyTimestamp(capturedAt),
      delayDisclaimer: asText(s.delayDisclaimer) || PRICE_DELAY_DISCLAIMER
    };
  }

  function priceHistoryEvent(event, fields, source, at){
    const snap = priceSnapshot(fields, source, at);
    return Object.assign({id: uid(), event: asText(event) || 'saved-edit'}, snap);
  }

  function normPriceHistory(history, snapshot, fields, createdAt){
    const source = Array.isArray(history) ? history : [];
    const rows = source.map(row => {
      const s = isObject(row) ? row : {};
      const capturedAt = asText(s.capturedAt) || createdAt || isoNow();
      return {
        id: asText(s.id) || uid(),
        event: ['created','saved-edit','final-save'].includes(s.event) ? s.event : 'saved-edit',
        price: clean(s.price),
        symbol: asText(s.symbol),
        source: asText(s.source),
        capturedAt,
        capturedAtNy: asText(s.capturedAtNy) || nyTimestamp(capturedAt),
        delayDisclaimer: asText(s.delayDisclaimer) || PRICE_DELAY_DISCLAIMER
      };
    });
    if(rows.length) return rows;
    const snap = normPriceSnapshot(snapshot, fields, createdAt);
    return snap.price ? [Object.assign({id: uid(), event: 'created'}, snap)] : [];
  }

  function fmtNum(n){
    if(!Number.isFinite(n)) return 'N/A';
    const a = Math.abs(n);
    const places = a >= 100 ? 2 : a >= 1 ? 4 : 6;
    return Number(n.toFixed(places)).toString();
  }

  function dolDistance(level, current){
    const target = priceNumber(level);
    const base = priceNumber(current);
    if(target == null || base == null){
      return {ok: false, absolute: 'N/A', percent: 'N/A', label: 'Distance: N/A'};
    }
    const absoluteValue = Math.abs(target - base);
    const percent = base === 0 ? 'N/A' : (absoluteValue / Math.abs(base) * 100).toFixed(2) + '%';
    return {
      ok: true,
      absolute: fmtNum(absoluteValue),
      percent,
      label: 'Distance: ' + fmtNum(absoluteValue) + (percent === 'N/A' ? ' (percent N/A)' : ' (' + percent + ')')
    };
  }

  function priceSourceLabel(){
    const configured = priceApiBase();
    const hosted = configured === HOSTED_PRICE_API_BASE ? 'Vercel yfinance API' : 'configured yfinance API';
    return 'Manual/static entry; optional ' + hosted + ' with local helper fallback.';
  }

  function priceRefreshRemaining(){
    if(!lastPriceFetchAt) return 0;
    const elapsed = Math.floor((Date.now() - lastPriceFetchAt) / 1000);
    return Math.max(0, PRICE_REFRESH_SECONDS - elapsed);
  }

  function priceCountdownText(){
    if(priceFetchState === 'loading') return 'Updating now';
    const remaining = priceRefreshRemaining();
    return remaining ? 'Next price update in ' + remaining + 's' : 'Price update ready';
  }

  function priceCountdownHtml(){
    return `<div class='price-countdown'>${esc(priceCountdownText())}</div>`;
  }

  function priceStatusMessage(){
    if(priceFetchState === 'loading') return 'Fetching live price. Manual entry remains available.';
    if(priceFetchState === 'ok'){
      const source = lastPriceSource === 'local-yfinance' ? 'local yfinance helper' : 'hosted yfinance API';
      return 'Detected from ' + source + (lastPriceFetchAt ? ' at ' + nyTimestamp(lastPriceFetchAt) + '.' : '.');
    }
    if(priceFetchState === 'unsupported') return 'Unsupported symbol for auto-detect. Enter the price manually.';
    if(priceFetchState === 'malformed') return 'Price helper returned an unusable price. Enter the price manually.';
    if(priceFetchState === 'unavailable' || priceFetchState === 'error') return 'Live price unavailable. Enter the price manually.';
    return 'Ready. Enter price manually or use Auto-detect when the price helper is available.';
  }

  function priceStatusClass(){
    const state = priceFetchState || 'ready';
    if(['loading','ok'].includes(state)) return state;
    return ['unsupported','malformed','unavailable','error'].includes(state) ? 'warn' : 'ready';
  }

  function priceStatusHtml(){
    return `<div class='price-status ${priceStatusClass()}' id='priceStatusMessage'>${esc(priceStatusMessage())}</div>`;
  }

  function trimSlash(s){
    return cleanUrl(s).replace(/\/+$/, '');
  }

  function priceApiBase(){
    const configured = trimSlash(root.ICT_PRICE_API_BASE || '');
    if(configured) return configured;
    if(root.location && /\.vercel\.app$/.test(root.location.hostname || '')){
      return trimSlash(root.location.origin) + '/api/price';
    }
    return HOSTED_PRICE_API_BASE || '/api/price';
  }

  function priceHelperUrl(symbol){
    return priceApiBase() + '?symbol=' + encodeURIComponent(normalizePriceSymbol(symbol));
  }

  function localPriceHelperUrl(symbol){
    return LOCAL_PRICE_API_BASE + '?symbol=' + encodeURIComponent(normalizePriceSymbol(symbol));
  }

  function priceHelperUrls(symbol){
    const normal = normalizePriceSymbol(symbol);
    const urls = [priceHelperUrl(normal)];
    const local = localPriceHelperUrl(normal);
    if(localPriceFallbackAllowed() && !urls.includes(local)) urls.push(local);
    return urls;
  }

  function localPriceFallbackAllowed(){
    if(runtimeConfig.localPriceFallback === true || runtimeConfig.useLocalPriceApi === true) return true;
    if(!root.location) return true;
    const host = root.location.hostname || '';
    const protocol = root.location.protocol || '';
    return host === 'localhost' || host === '127.0.0.1' || protocol === 'file:' || host === '';
  }

  function fetchJsonWithTimeout(url, ms){
    if(typeof fetch !== 'function') return Promise.reject(new Error('fetch unavailable'));
    const hasAbort = typeof AbortController === 'function';
    const controller = hasAbort ? new AbortController() : null;
    const timer = hasAbort ? setTimeout(() => controller.abort(), ms) : null;
    return fetch(url, controller ? {signal: controller.signal} : undefined)
      .then(res => res.json()
        .catch(() => ({}))
        .then(body => {
          if(res.ok) return body;
          const bodyError = asText(body && body.error).toLowerCase();
          const kind = bodyError.includes('unsupported') ? 'unsupported' : 'unavailable';
          throw priceError(kind, 'price helper unavailable');
        }))
      .finally(() => {
        if(timer) clearTimeout(timer);
      });
  }

  function fetchPrice(symbol){
    const normal = normalizePriceSymbol(symbol);
    if(!validPriceSymbol(normal)) return Promise.reject(priceError('unsupported', 'unsupported symbol'));
    const urls = priceHelperUrls(normal);
    let index = 0;
    const next = () => fetchJsonWithTimeout(urls[index], PRICE_TIMEOUT_MS)
      .then(data => Object.assign({}, data, {helperUrl: urls[index]}))
      .catch(err => {
        index += 1;
        if(index >= urls.length) throw err;
        return next();
      });
    return next();
  }

  function derivePotentialPhase(phase){
    return potentialPhaseByPhase[phase] || '';
  }

  function blankMarketContext(){
    const out = {};
    marketTimeframes.forEach(tf => {
      out[tf] = {phase: '', note: '', potentialNextPhase: ''};
    });
    return out;
  }

  function normMarketContext(o){
    const source = isObject(o) ? o : {};
    const out = {};
    marketTimeframes.forEach(tf => {
      const key = marketPhaseKeys[tf];
      const row = isObject(source[tf]) ? source[tf] : (isObject(source[key]) ? source[key] : {});
      const phase = phaseOptions.includes(row.phase) ? row.phase : '';
      const explicitNext = phaseOptions.includes(row.potentialNextPhase) ? row.potentialNextPhase : '';
      out[tf] = {
        phase,
        note: asText(row.note),
        potentialNextPhase: explicitNext || derivePotentialPhase(phase)
      };
    });
    return out;
  }

  function arrayText(v){
    if(Array.isArray(v)) return v.map(asText).filter(Boolean);
    if(typeof v === 'string' && v.trim()) return v.split(',').map(asText).filter(Boolean);
    return [];
  }

  function normJournal(o){
    const s = isObject(o) ? o : {};
    return {
      screenshotRefs: arrayText(s.screenshotRefs || s.screenshots || s.screenshotRef),
      tags: arrayText(s.tags),
      lesson: asText(s.lesson)
    };
  }

  function normRisk(o){
    const s = isObject(o) ? o : {};
    return {
      plannedRiskPct: asText(s.plannedRiskPct),
      plannedR: asText(s.plannedR),
      maxLoss: asText(s.maxLoss)
    };
  }

  function dolLabel(fields, id){
    const flds = normFields(fields || {});
    const n = Number(String(id || '').replace('dol', ''));
    if(!n || n < 1 || n > 3) return 'No DOL selected';
    const draw = flds['dol' + n + 'Draw'] || 'DOL ' + n;
    const level = flds['dol' + n + 'Level'] || 'No level';
    return draw + ' @ ' + level;
  }

  function firstDolId(fields){
    const flds = normFields(fields || {});
    return dolIds.find(id => flds[id + 'Level'] || flds[id + 'Draw']) || '';
  }

  function normActiveDolId(value, fields){
    const id = dolIds.includes(value) ? value : firstDolId(fields);
    return id || '';
  }

  function activeDol(fields, id){
    const flds = normFields(fields || {});
    const dolId = normActiveDolId(id, flds);
    if(!dolId) return null;
    const prefix = dolId;
    const target = priceNumber(flds[prefix + 'Level']);
    const current = priceNumber(flds.currentPrice);
    const diff = target == null || current == null ? null : target - current;
    return {
      id: dolId,
      label: dolLabel(flds, dolId),
      draw: flds[prefix + 'Draw'],
      timeframe: flds[prefix + 'Tf'],
      level: flds[prefix + 'Level'],
      target,
      current,
      diff,
      direction: diff == null ? '' : diff > 0 ? 'upward delivery required' : diff < 0 ? 'downward delivery required' : 'at selected DOL',
      status: flds[prefix + 'Taken'] ? 'Swept' : diff == null ? 'Pending' : Math.abs(diff) === 0 ? 'Tagged' : 'Pending',
      distance: dolDistance(flds[prefix + 'Level'], flds.currentPrice)
    };
  }

  function ratioNumber(value){
    const raw = String(value == null ? '' : value).trim().replace(/r$/i, '');
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function formatRatio(value){
    const n = ratioNumber(value);
    return n == null ? '' : fmtNum(n) + 'R';
  }

  function inferRiskRatio(plan, fields, targetDolId){
    const p = isObject(plan) ? plan : {};
    const explicit = formatRatio(p.ratio || p.targetR);
    if(explicit) return explicit;
    const flds = normFields(fields || {});
    const dol = activeDol(flds, targetDolId);
    const direction = riskDirections.includes(p.direction) ? p.direction : '';
    const entry = priceNumber(p.entryPrice || flds.currentPrice);
    const target = priceNumber((dol && dol.level) || p.targetPrice);
    const stop = priceNumber(p.invalidationPrice);
    if(direction && entry != null && target != null && stop != null){
      const reward = Math.abs(target - entry);
      const risk = direction === 'Long' ? entry - stop : stop - entry;
      if(reward > 0 && risk > 0) return formatRatio(reward / risk);
    }
    return '2R';
  }

  function normRouteEvidence(rows){
    const source = Array.isArray(rows) ? rows : [];
    return source.map(row => {
      const s = isObject(row) ? row : {};
      const createdAt = asText(s.createdAt) || isoNow();
      return {
        id: asText(s.id) || uid(),
        arrayType: arrayTypes.includes(s.arrayType) ? s.arrayType : '',
        timeframe: liquidityTimeframes.includes(s.timeframe) ? s.timeframe : '',
        level: asText(s.level),
        behavior: routeBehaviors.includes(s.behavior) ? s.behavior : '',
        notes: asText(s.notes),
        createdAt,
        createdAtNy: asText(s.createdAtNy) || nyTimestamp(createdAt)
      };
    }).filter(row => row.arrayType || row.timeframe || row.level || row.behavior || row.notes);
  }

  function blankRiskPlan(fields, activeDolId){
    const flds = normFields(fields || {});
    const dol = activeDol(flds, activeDolId);
    return {
      direction: '',
      ratio: '2R',
      entryPrice: flds.currentPrice || '',
      targetDolId: dol ? dol.id : '',
      targetPrice: dol ? dol.level : '',
      invalidationPrice: '',
      riskPoints: '',
      rewardPoints: '',
      rr: '',
      status: 'incomplete',
      message: 'R:R unavailable - check entry, DOL target, invalidation, and direction.'
    };
  }

  function calculateRiskPlan(plan, fields, activeDolId){
    const p = isObject(plan) ? plan : {};
    const flds = normFields(fields || {});
    const targetDolId = normActiveDolId(p.targetDolId || activeDolId, flds);
    const dol = activeDol(flds, targetDolId);
    const direction = riskDirections.includes(p.direction) ? p.direction : '';
    const ratio = inferRiskRatio(p, flds, targetDolId);
    const ratioValue = ratioNumber(ratio);
    const entryPrice = clean(p.entryPrice || flds.currentPrice);
    const targetPrice = clean((dol && dol.level) || p.targetPrice);
    const entry = priceNumber(entryPrice);
    const target = priceNumber(targetPrice);
    const base = {
      direction,
      ratio,
      entryPrice,
      targetDolId,
      targetPrice,
      invalidationPrice: '',
      riskPoints: '',
      rewardPoints: '',
      rr: '',
      status: 'incomplete',
      message: 'R:R unavailable - check entry, DOL target, invalidation, and direction.'
    };
    if(!direction || ratioValue == null || entry == null || target == null) return base;
    const reward = Math.abs(target - entry);
    const validSide = direction === 'Long' ? target > entry : target < entry;
    if(!validSide || reward <= 0){
      return Object.assign(base, {
        status: 'invalid',
        message: 'Invalid R:R - target DOL must be on the correct side of entry/current price.'
      });
    }
    const risk = reward / ratioValue;
    const invalidation = direction === 'Long' ? entry - risk : entry + risk;
    return Object.assign(base, {
      riskPoints: fmtNum(risk),
      rewardPoints: fmtNum(reward),
      rr: formatRatio(ratioValue),
      invalidationPrice: fmtNum(invalidation),
      status: 'ready',
      message: 'Potential R:R to selected DOL. Educational only.'
    });
  }

  function normRiskPlan(plan, fields, activeDolId){
    return calculateRiskPlan(plan || blankRiskPlan(fields, activeDolId), fields, activeDolId);
  }

  function comp(x){
    const fields = normFields(x || {});
    const count = p => {
      let done = 0;
      let part = 0;
      for(let i = 1; i <= 3; i++){
        const any = fields[p + i + 'Level'] || fields[p + i + 'Draw'] || fields[p + i + 'Tf'] || fields[p + i + 'Taken'] || fields[p + i + 'Confidence'] || fields[p + i + 'HitTime'];
        const ok = fields[p + i + 'Level'] && fields[p + i + 'Draw'] && fields[p + i + 'Tf'];
        if(ok) done++;
        else if(any) part++;
      }
      return {done, part, ok: done > 0 && part === 0};
    };
    const d = count('dol');
    const s = count('sweep');
    const priceOk = !!(priceNumber(fields.currentPrice) != null || fields.manualPriceNeededAck);
    return {ok: !!(fields.instrument && fields.session && fields.bias && priceOk && d.ok && s.part === 0), dol: d, sweep: s, priceOk};
  }

  function cardStatus(card){
    return comp(card.fields || blank()).ok ? 'complete' : 'draft';
  }

  function normaliseCard(o){
    const source = isObject(o) ? o : {};
    const now = isoNow();
    const fields = normFields(source.fields || source);
    const createdAt = asText(source.createdAt || source.savedAt) || now;
    const updatedAt = asText(source.updatedAt || source.savedAt) || createdAt;
    const marketContext = normMarketContext(source.marketContext || (isObject(source.fields) ? source.fields.marketContext : null));
    const markerSource = isObject(source.markers) ? source.markers : {};
    const out = outcomes.includes(source.outcome) ? source.outcome : 'Open';
    const finalSaved = !!(source.finalSaved && finalOutcomes.includes(out));
    const activeId = normActiveDolId(source.activeDolId, fields);
    const snapshot = normPriceSnapshot(source.priceSnapshot, fields, createdAt);
    const routeEvidence = normRouteEvidence(source.routeEvidence);

    return {
      id: String(source.id || uid()),
      savedAt: asText(source.savedAt) || createdAt,
      createdAt,
      updatedAt,
      createdAtNy: asText(source.createdAtNy) || nyTimestamp(createdAt),
      updatedAtNy: asText(source.updatedAtNy) || nyTimestamp(updatedAt),
      fields,
      marketContext,
      activeDolId: activeId,
      priceSnapshot: snapshot,
      priceHistory: normPriceHistory(source.priceHistory, snapshot, fields, createdAt),
      routeEvidence,
      riskPlan: normRiskPlan(source.riskPlan, fields, activeId),
      markers: {
        biasValidated: !!(markerSource.biasValidated || source.biasValidated),
        biasInvalidated: !!(markerSource.biasInvalidated || source.biasInvalidated),
        dolRespected: !!(markerSource.dolRespected || source.drawRespected),
        sweepConfirmed: !!(markerSource.sweepConfirmed || source.sweepConfirmed),
        fvgFormed: !!(markerSource.fvgFormed || source.fvgFormed || fields.fvg),
        planFollowed: !!(markerSource.planFollowed || source.planFollowed)
      },
      outcome: out,
      notes: asText(source.notes || source.verificationNotes),
      finalSaved,
      favorite: !!source.favorite,
      journal: normJournal(source.journal),
      risk: normRisk(source.risk || {
        plannedRiskPct: source.plannedRiskPct,
        plannedR: source.plannedR,
        maxLoss: source.maxLoss
      })
    };
  }

  function extractPayload(p){
    const payload = typeof p === 'string' ? parse(p, null) : p;
    if(Array.isArray(payload)) return payload;
    if(payload && Array.isArray(payload.cards)) return payload.cards;
    if(payload && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function importSchemaWarning(payload){
    if(payload && !Array.isArray(payload) && payload.schema && payload.schema !== SCHEMA){
      return 'Imported file uses schema "' + asText(payload.schema) + '"; expected "' + SCHEMA + '". Cards were normalized best-effort.';
    }
    return '';
  }

  function persistCards(nextCards){
    const store = storage();
    if(!store) return true;
    try {
      store.setItem(KEY, JSON.stringify(nextCards));
      lastStorageError = '';
      return true;
    } catch(e) {
      lastStorageError = 'Storage limit reached. Export JSON, clear old cards, or reduce saved data before saving again.';
      return false;
    }
  }

  function loadCards(){
    const store = storage();
    if(!store) return [];

    let raw = extractPayload(parse(store.getItem(KEY) || '[]', []));
    if(raw.length){
      const normalised = raw.map(normaliseCard);
      persistCards(normalised);
      return normalised;
    }

    for(const key of LEGACY){
      raw = extractPayload(parse(store.getItem(key) || '[]', []));
      if(raw.length){
        const migrated = raw.map(normaliseCard);
        persistCards(migrated);
        return migrated;
      }
    }

    return [];
  }

  function getCards(){
    return cards.map(normaliseCard);
  }

  function saveCards(nextCards, options){
    const normalised = Array.isArray(nextCards) ? nextCards.map(normaliseCard) : [];
    if(!persistCards(normalised)) return getCards();
    cards = normalised;
    if(!options || options.remote !== false) cards.forEach(queueCardSync);
    return getCards();
  }

  function createBlankDraft(seed){
    const input = isObject(seed) ? seed : {};
    const now = isoNow();
    const fields = Object.assign(blank(), input.fields || {});
    const activeId = normActiveDolId(input.activeDolId, fields);
    const riskDefaults = getSettings().riskDefaults;
    return normaliseCard({
      id: input.id || uid(),
      savedAt: input.savedAt || now,
      createdAt: input.createdAt || input.savedAt || now,
      updatedAt: input.updatedAt || now,
      fields,
      marketContext: normMarketContext(input.marketContext || (input.fields && input.fields.marketContext)),
      activeDolId: activeId,
      priceSnapshot: input.priceSnapshot || priceSnapshot(fields, input.priceSource || 'manual', input.createdAt || input.savedAt || now),
      priceHistory: input.priceHistory || [priceHistoryEvent('created', fields, input.priceSource || 'manual', input.createdAt || input.savedAt || now)],
      routeEvidence: input.routeEvidence || [],
      riskPlan: input.riskPlan || blankRiskPlan(fields, activeId),
      markers: input.markers || {},
      outcome: input.outcome || 'Open',
      notes: input.notes || '',
      finalSaved: false,
      favorite: !!input.favorite,
      journal: input.journal || {},
      risk: Object.assign({}, riskDefaults, isObject(input.risk) ? input.risk : {})
    });
  }

  function mergeCard(card, patch){
    const p = isObject(patch) ? patch : {};
    const next = Object.assign({}, card, p);
    if(p.fields) next.fields = Object.assign({}, card.fields || {}, p.fields);
    if(p.marketContext) next.marketContext = normMarketContext(p.marketContext);
    if(p.routeEvidence) next.routeEvidence = normRouteEvidence(p.routeEvidence);
    if(p.markers) next.markers = Object.assign({}, card.markers || {}, p.markers);
    if(p.journal) next.journal = Object.assign({}, card.journal || {}, p.journal);
    if(p.risk) next.risk = Object.assign({}, card.risk || {}, p.risk);
    next.activeDolId = normActiveDolId(p.activeDolId || next.activeDolId, next.fields);
    next.riskPlan = normRiskPlan(p.riskPlan || next.riskPlan, next.fields, next.activeDolId);
    next.createdAt = card.createdAt || card.savedAt || isoNow();
    next.createdAtNy = card.createdAtNy || nyTimestamp(next.createdAt);
    next.updatedAt = p.updatedAt || isoNow();
    next.updatedAtNy = p.updatedAtNy || nyTimestamp(next.updatedAt);
    const event = p.priceHistoryEvent || (p.finalSaved ? 'final-save' : 'saved-edit');
    const priceSource = p.priceSource || 'manual';
    next.priceSnapshot = p.priceSnapshot || priceSnapshot(next.fields, priceSource, next.updatedAt);
    next.priceHistory = p.priceHistoryEvent === false
      ? (card.priceHistory || [])
      : (card.priceHistory || []).concat([priceHistoryEvent(event, next.fields, priceSource, next.updatedAt)]);
    return normaliseCard(next);
  }

  function updateCard(id, patch){
    let updated = null;
    const nextCards = cards.map(card => {
      if(card.id !== id) return card;
      updated = mergeCard(card, patch);
      return updated;
    });
    if(!updated) return null;
    const normalised = nextCards.map(normaliseCard);
    if(!persistCards(normalised)) return null;
    cards = normalised;
    const saved = cards.find(card => card.id === id) || updated;
    queueCardSync(saved);
    return saved;
  }

  function deleteCard(id){
    const before = cards.length;
    const nextCards = cards.filter(card => card.id !== id).map(normaliseCard);
    if(!persistCards(nextCards)) return false;
    cards = nextCards;
    if(cards.length !== before) queueCardDelete(id);
    return cards.length !== before;
  }

  function toggleFavorite(id){
    const card = cards.find(c => c.id === id);
    if(!card) return null;
    return updateCard(id, {favorite: !card.favorite, priceHistoryEvent: false});
  }

  function getMetrics(inputCards){
    const source = (Array.isArray(inputCards) ? inputCards : cards).map(normaliseCard);
    const hitMiss = source.filter(c => c.finalSaved && ['Hit','Miss'].includes(c.outcome));
    const hits = hitMiss.filter(c => c.outcome === 'Hit').length;
    const breakeven = source.filter(c => c.finalSaved && c.outcome === 'Breakeven').length;
    const needsFinal = source.filter(c => !c.finalSaved && c.outcome !== 'Open').length;
    return {
      rate: hitMiss.length ? Math.round(hits / hitMiss.length * 100) + '%' : '-',
      sample: hitMiss.length,
      hits,
      misses: hitMiss.length - hits,
      be: breakeven,
      needs: needsFinal,
      total: source.length,
      finalSaved: source.filter(c => c.finalSaved).length,
      drafts: source.filter(c => !c.finalSaved).length,
      favorites: source.filter(c => c.favorite).length
    };
  }

  function getSettings(){
    const store = storage();
    const saved = store ? parse(store.getItem(SETTINGS_KEY) || '{}', {}) : {};
    return {
      defaultInstrument: asText(saved.defaultInstrument || defaultSettings.defaultInstrument),
      defaultSession: asText(saved.defaultSession || defaultSettings.defaultSession),
      theme: normTheme(saved.theme || defaultSettings.theme),
      watchlist: arrayText(saved.watchlist),
      riskDefaults: normRisk(saved.riskDefaults || defaultSettings.riskDefaults)
    };
  }

  function saveSettings(settings, options){
    const next = Object.assign({}, getSettings(), isObject(settings) ? settings : {});
    next.theme = normTheme(next.theme);
    next.watchlist = arrayText(next.watchlist);
    next.riskDefaults = normRisk(next.riskDefaults);
    const store = storage();
    lastSettingsError = '';
    if(store){
      try {
        store.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch(e) {
        lastSettingsError = 'Settings could not be saved in this browser. The change is applied for this session only.';
      }
    }
    applyTheme(next.theme);
    if(!lastSettingsError && (!options || options.remote !== false)) queueSettingsSync(next);
    return next;
  }

  function exportCards(){
    return {
      schema: SCHEMA,
      version: VERSION,
      exportedAt: new Date().toISOString(),
      analytics: getMetrics(cards),
      settings: getSettings(),
      cards: getCards()
    };
  }

  function importCards(payload){
    const parsed = typeof payload === 'string' ? parse(payload, null) : payload;
    const warning = importSchemaWarning(parsed);
    const settingsImported = !!(isObject(parsed) && isObject(parsed.settings));
    if(settingsImported) saveSettings(parsed.settings);
    const settingsWarning = settingsImported && lastSettingsError ? lastSettingsError : '';
    const incoming = extractPayload(parsed).map(normaliseCard);
    const combinedWarning = [warning, settingsWarning].filter(Boolean).join(' ');
    if(!incoming.length){
      const base = {imported: 0, cards: getCards()};
      if(settingsImported) base.settingsImported = true;
      if(combinedWarning) base.warning = combinedWarning;
      return base;
    }

    const byId = {};
    cards.concat(incoming).forEach(card => {
      const next = normaliseCard(card);
      const current = byId[next.id];
      if(!current || new Date(next.updatedAt || next.savedAt || 0) >= new Date(current.updatedAt || current.savedAt || 0)){
        byId[next.id] = next;
      }
    });
    const merged = Object.values(byId).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    saveCards(merged);
    if(lastStorageError){
      const failed = {imported: 0, cards: getCards(), error: lastStorageError};
      if(settingsImported) failed.settingsImported = true;
      if(combinedWarning) failed.warning = combinedWarning;
      return failed;
    }
    const result = {imported: incoming.length, cards: getCards()};
    if(settingsImported) result.settingsImported = true;
    if(combinedWarning) result.warning = combinedWarning;
    return result;
  }

  function getSyncQueue(){
    const store = storage();
    const base = {cards: {}, deletes: {}, settings: null};
    if(!store) return base;
    const saved = parse(store.getItem(SYNC_QUEUE_KEY) || '{}', {});
    return {
      cards: isObject(saved.cards) ? saved.cards : {},
      deletes: isObject(saved.deletes) ? saved.deletes : {},
      settings: isObject(saved.settings) ? saved.settings : null
    };
  }

  function setSyncQueue(queue){
    const store = storage();
    if(!store) return;
    store.setItem(SYNC_QUEUE_KEY, JSON.stringify({
      cards: isObject(queue.cards) ? queue.cards : {},
      deletes: isObject(queue.deletes) ? queue.deletes : {},
      settings: isObject(queue.settings) ? queue.settings : null
    }));
  }

  function syncQueueCount(queue){
    const q = queue || getSyncQueue();
    return Object.keys(q.cards || {}).length + Object.keys(q.deletes || {}).length + (q.settings ? 1 : 0);
  }

  function getSyncDecisionMap(){
    const store = storage();
    return store ? parse(store.getItem(SYNC_ACCOUNT_DECISIONS_KEY) || '{}', {}) : {};
  }

  function setSyncDecisionMap(map){
    const store = storage();
    if(store) store.setItem(SYNC_ACCOUNT_DECISIONS_KEY, JSON.stringify(isObject(map) ? map : {}));
  }

  function getUserSyncDecision(userId){
    const id = userId || (supabaseUser && supabaseUser.id);
    if(!id) return null;
    const map = getSyncDecisionMap();
    return isObject(map[id]) ? map[id] : null;
  }

  function setUserSyncDecision(decision){
    if(!supabaseUser || !supabaseUser.id) return null;
    const map = getSyncDecisionMap();
    map[supabaseUser.id] = Object.assign({
      decidedAt: isoNow()
    }, isObject(decision) ? decision : {});
    setSyncDecisionMap(map);
    return map[supabaseUser.id];
  }

  function clearQueuedLocalUploads(){
    const queue = getSyncQueue();
    queue.cards = {};
    queue.deletes = {};
    queue.settings = null;
    setSyncQueue(queue);
  }

  function shouldPauseFirstLocalUpload(remoteCards){
    if(!supabaseUser || getUserSyncDecision()) return false;
    if(!cards.length) return false;
    return Array.isArray(remoteCards) && remoteCards.length === 0;
  }

  function signupErrorMessage(error){
    const message = error && error.message ? error.message : 'Supabase account creation failed.';
    return /rate limit/i.test(message)
      ? 'Supabase email rate limit reached. Try again later, or configure SMTP/email limits in Supabase before inviting more users.'
      : message;
  }

  function getTombstones(){
    const store = storage();
    return store ? parse(store.getItem(SYNC_TOMBSTONES_KEY) || '{}', {}) : {};
  }

  function setTombstones(tombstones){
    const store = storage();
    if(store) store.setItem(SYNC_TOMBSTONES_KEY, JSON.stringify(isObject(tombstones) ? tombstones : {}));
  }

  function supabaseConfig(){
    return {
      url: cleanUrl(root.ICT_SUPABASE_URL || DEFAULT_SUPABASE_URL),
      anonKey: cleanUrl(root.ICT_SUPABASE_ANON_KEY || '')
    };
  }

  function adminSupabaseEmail(){
    return cleanUrl(runtimeConfig.adminSupabaseEmail || root.ICT_ADMIN_SUPABASE_EMAIL || DEFAULT_ADMIN_SUPABASE_EMAIL);
  }

  function getSupabaseClient(){
    if(supabaseClient) return supabaseClient;
    const cfg = supabaseConfig();
    const factory = root.supabase && root.supabase.createClient;
    if(!cfg.url || !cfg.anonKey || typeof factory !== 'function') return null;
    supabaseClient = factory(cfg.url, cfg.anonKey);
    return supabaseClient;
  }

  function setSyncStatus(status, message, busy){
    syncState = Object.assign({}, syncState, {
      configured: !!getSupabaseClient(),
      status,
      message,
      busy: !!busy
    });
  }

  function syncStatusLabel(){
    if(syncState.busy) return 'Syncing';
    if(syncState.firstSyncPaused) return 'Review first sync';
    if(supabaseUser) return 'Connected';
    return getSupabaseClient() ? 'Login required' : 'Local only';
  }

  function backupStatusLabel(){
    if(syncState.busy) return 'Backup pending';
    if(syncState.firstSyncPaused) return 'Backup paused';
    if(!getSupabaseClient()) return 'Device only';
    if(syncState.status === 'Sync error' || syncState.status === 'Login failed') return 'Backup error';
    if(supabaseUser) return 'Backed up';
    return 'Signed out';
  }

  function backupStatusMessage(){
    if(syncState.firstSyncPaused) return "Choose whether to add this browser's existing cards to cloud backup.";
    if(syncState.status === 'Sync error' || syncState.status === 'Login failed') return syncState.message;
    if(syncState.busy) return 'Saving the latest card changes.';
    if(supabaseUser) return syncQueueCount() ? 'Local changes are waiting to back up.' : 'Your Focus Cards are ready for cloud backup.';
    if(!getSupabaseClient()) return 'Cloud backup is unavailable in this build. Local cards still work on this device.';
    return 'Sign in to back up Focus Cards for this device.';
  }

  function authRedirectUrl(){
    if(!root.location) return undefined;
    return root.location.origin + root.location.pathname + '#profile';
  }

  function remoteCardPayload(card){
    const c = normaliseCard(card);
    return {
      id: c.id,
      owner_id: supabaseUser && supabaseUser.id,
      card: c,
      instrument: c.fields.instrument || null,
      session: c.fields.session || null,
      card_date: c.fields.date || null,
      outcome: c.outcome || 'Open',
      final_saved: !!c.finalSaved,
      favorite: !!c.favorite,
      created_at: c.createdAt || c.savedAt || isoNow(),
      updated_at: c.updatedAt || c.savedAt || isoNow()
    };
  }

  function queueCardSync(card){
    if(!card || !card.id) return;
    const queue = getSyncQueue();
    queue.cards[card.id] = normaliseCard(card);
    delete queue.deletes[card.id];
    setSyncQueue(queue);
    flushSupabaseQueue();
  }

  function queueCardDelete(id){
    if(!id) return;
    const queue = getSyncQueue();
    delete queue.cards[id];
    queue.deletes[id] = true;
    setSyncQueue(queue);
    const tombstones = getTombstones();
    tombstones[id] = isoNow();
    setTombstones(tombstones);
    flushSupabaseQueue();
  }

  function queueSettingsSync(settings){
    const queue = getSyncQueue();
    queue.settings = getSettingsPayload(settings);
    setSyncQueue(queue);
    flushSupabaseQueue();
  }

  function getSettingsPayload(settings){
    const s = isObject(settings) ? settings : getSettings();
    return {
      defaultInstrument: asText(s.defaultInstrument),
      defaultSession: asText(s.defaultSession),
      theme: normTheme(s.theme),
      watchlist: arrayText(s.watchlist),
      riskDefaults: normRisk(s.riskDefaults)
    };
  }

  function mergeCards(localCards, remoteCards){
    const tombstones = getTombstones();
    const byId = {};
    (Array.isArray(localCards) ? localCards : []).concat(Array.isArray(remoteCards) ? remoteCards : []).forEach(card => {
      const next = normaliseCard(card);
      if(tombstones[next.id] && new Date(tombstones[next.id]) >= new Date(next.updatedAt || next.savedAt || 0)) return;
      const current = byId[next.id];
      if(!current || new Date(next.updatedAt || next.savedAt || 0) >= new Date(current.updatedAt || current.savedAt || 0)){
        byId[next.id] = next;
      }
    });
    return Object.values(byId).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }

  function loadRemoteCards(){
    const client = getSupabaseClient();
    if(!client || !supabaseUser) return Promise.resolve([]);
    return client
      .from(SUPABASE_CARDS_TABLE)
      .select('card,updated_at')
      .order('updated_at', {ascending: false})
      .then(({data, error}) => {
        if(error) throw error;
        return (Array.isArray(data) ? data : []).map(row => normaliseCard(row.card || {}));
      });
  }

  function loadRemoteSettings(){
    const client = getSupabaseClient();
    if(!client || !supabaseUser) return Promise.resolve(null);
    return client
      .from(SUPABASE_SETTINGS_TABLE)
      .select('settings')
      .eq('owner_id', supabaseUser.id)
      .maybeSingle()
      .then(({data, error}) => {
        if(error) throw error;
        return data && isObject(data.settings) ? data.settings : null;
      });
  }

  function upsertRemoteCard(card){
    const client = getSupabaseClient();
    if(!client || !supabaseUser) return Promise.resolve(false);
    return client.from(SUPABASE_CARDS_TABLE).upsert(remoteCardPayload(card)).then(({error}) => {
      if(error) throw error;
      return true;
    });
  }

  function deleteRemoteCard(id){
    const client = getSupabaseClient();
    if(!client || !supabaseUser) return Promise.resolve(false);
    return client.from(SUPABASE_CARDS_TABLE).delete().eq('id', id).then(({error}) => {
      if(error) throw error;
      return true;
    });
  }

  function upsertRemoteSettings(settings){
    const client = getSupabaseClient();
    if(!client || !supabaseUser) return Promise.resolve(false);
    return client.from(SUPABASE_SETTINGS_TABLE).upsert({
      owner_id: supabaseUser.id,
      settings: getSettingsPayload(settings),
      updated_at: isoNow()
    }).then(({error}) => {
      if(error) throw error;
      return true;
    });
  }

  function flushSupabaseQueue(options){
    const opts = isObject(options) ? options : {};
    const client = getSupabaseClient();
    if(!client || !supabaseUser || (syncState.busy && !opts.force)) return Promise.resolve(false);
    if(syncState.firstSyncPaused && !opts.allowFirstUpload){
      setSyncStatus('Review first sync', 'Choose whether to add existing local cards to cloud backup.', false);
      syncState.firstSyncPaused = true;
      if(route === 'profile') render();
      return Promise.resolve(false);
    }
    const queue = getSyncQueue();
    const processedCardIds = Object.keys(queue.cards || {});
    const processedDeleteIds = Object.keys(queue.deletes || {});
    const processedSettings = queue.settings;
    if(!processedCardIds.length && !processedDeleteIds.length && !processedSettings) return Promise.resolve(true);
    setSyncStatus('Syncing', 'Backing up local changes.', true);
    const jobs = processedCardIds.map(id => upsertRemoteCard(queue.cards[id]))
      .concat(processedDeleteIds.map(deleteRemoteCard));
    if(processedSettings) jobs.push(upsertRemoteSettings(processedSettings));
    return Promise.all(jobs).then(() => {
      const latest = getSyncQueue();
      processedCardIds.forEach(id => delete latest.cards[id]);
      processedDeleteIds.forEach(id => delete latest.deletes[id]);
      if(processedSettings && latest.settings && JSON.stringify(latest.settings) === JSON.stringify(processedSettings)){
        latest.settings = null;
      }
      setSyncQueue(latest);
      syncState.lastSyncAt = nyTimestamp();
      syncState.firstSyncPaused = false;
      setSyncStatus('Connected', 'Cloud backup is up to date.', false);
      const remaining = Object.keys(latest.cards || {}).length + Object.keys(latest.deletes || {}).length + (latest.settings ? 1 : 0);
      if(remaining) return flushSupabaseQueue({allowFirstUpload: !!opts.allowFirstUpload});
      return true;
    }).catch(error => {
      setSyncStatus('Sync error', error && error.message ? error.message : 'Cloud backup failed. Local cards are still saved.', false);
      return false;
    }).then(result => {
      if(route === 'profile') render();
      return result;
    });
  }

  function syncFromSupabase(options){
    const opts = isObject(options) ? options : {};
    const client = getSupabaseClient();
    if(!client) {
      setSyncStatus('Local only', 'Cloud backup is unavailable in this build.', false);
      return Promise.resolve(false);
    }
    if(!supabaseUser) {
      setSyncStatus('Login required', 'Sign in from Profile to back up Focus Cards.', false);
      return Promise.resolve(false);
    }
    if(syncState.busy && !opts.force) return Promise.resolve(false);
    setSyncStatus('Syncing', 'Checking cloud backup.', true);
    return Promise.all([loadRemoteCards(), loadRemoteSettings()])
      .then(([remoteCards, remoteSettings]) => {
        syncState.remoteCardCount = Array.isArray(remoteCards) ? remoteCards.length : null;
        if(shouldPauseFirstLocalUpload(remoteCards) && !opts.allowFirstUpload){
          syncState.firstSyncPaused = true;
          setSyncStatus('Review first sync', 'This browser has existing cards. Choose whether to add them to cloud backup.', false);
          render();
          return false;
        }
        syncState.firstSyncPaused = false;
        const merged = mergeCards(cards, remoteCards);
        saveCards(merged, {remote: false});
        if(remoteSettings) saveSettings(remoteSettings, {remote: false});
        return flushSupabaseQueue({force: true, allowFirstUpload: !!opts.allowFirstUpload});
      })
      .then(result => {
        if(result === false) return false;
        syncState.lastSyncAt = nyTimestamp();
        setSyncStatus('Connected', 'Cloud backup is up to date.', false);
        render();
        return true;
      })
      .catch(error => {
        setSyncStatus('Sync error', error && error.message ? error.message : 'Cloud backup failed. Local cards are still saved.', false);
        render();
        return false;
      });
  }

  function installAuthListener(client){
    if(authListenerInstalled || !client || !client.auth || !client.auth.onAuthStateChange) return;
    authListenerInstalled = true;
    client.auth.onAuthStateChange((event, session) => {
      supabaseSession = session || null;
      supabaseUser = supabaseSession ? supabaseSession.user : null;
      if(event === 'SIGNED_IN') {
        if(typeof setTimeout === 'function') setTimeout(() => syncFromSupabase({force: true}), 0);
        else syncFromSupabase({force: true});
      }
      if(event === 'SIGNED_OUT') {
        syncState.firstSyncPaused = false;
        setSyncStatus('Login required', 'Logged out. Local cards remain on this device.', false);
      }
      render();
    });
  }

  function validateSupabaseUser(client){
    if(!client || !supabaseSession) return Promise.resolve(false);
    if(!client.auth.getUser) return Promise.resolve(true);
    return client.auth.getUser().then(({data, error}) => {
      if(error || !data || !data.user) {
        supabaseSession = null;
        supabaseUser = null;
        syncState.firstSyncPaused = false;
        setSyncStatus('Login required', 'Saved session is no longer valid. Sign in again to back up Focus Cards.', false);
        if(client.auth.signOut) return client.auth.signOut().catch(() => false).then(() => false);
        return false;
      }
      supabaseUser = data.user;
      return true;
    });
  }

  function initSupabase(){
    const client = getSupabaseClient();
    if(!client) {
      setSyncStatus('Local only', 'Cloud backup is unavailable in this build.', false);
      return Promise.resolve(false);
    }
    return client.auth.getSession().then(({data}) => {
      supabaseSession = data && data.session ? data.session : null;
      supabaseUser = supabaseSession ? supabaseSession.user : null;
      installAuthListener(client);
      if(!supabaseUser) {
        setSyncStatus('Login required', 'Signed out. Local cards remain on this device.', false);
        return false;
      }
      setSyncStatus('Syncing', 'Checking saved session.', true);
      return validateSupabaseUser(client).then(valid => {
        if(!valid) {
          render();
          return false;
        }
        return syncFromSupabase({force: true});
      });
    }).catch(error => {
      setSyncStatus('Sync error', error && error.message ? error.message : 'Cloud backup could not start.', false);
      return false;
    });
  }

  function supabaseLogin(email, password){
    const client = getSupabaseClient();
    if(!client) {
      setSyncStatus('Local only', 'Cloud backup is unavailable in this build.', false);
      render();
      return Promise.resolve(false);
    }
    setSyncStatus('Syncing', 'Signing in.', true);
    return client.auth.signInWithPassword({email, password}).then(({data, error}) => {
      if(error) throw error;
      supabaseSession = data && data.session ? data.session : null;
      supabaseUser = supabaseSession ? supabaseSession.user : null;
      return syncFromSupabase({force: true});
    }).catch(error => {
      setSyncStatus('Login failed', error && error.message ? error.message : 'Sign in failed.', false);
      render();
      return false;
    });
  }

  function supabaseSignup(email, password){
    const client = getSupabaseClient();
    if(!client) {
      setSyncStatus('Local only', 'Cloud backup is unavailable in this build.', false);
      render();
      return Promise.resolve(false);
    }
    setSyncStatus('Syncing', 'Creating Supabase account.', true);
    return client.auth.signUp({
      email,
      password,
      options: {emailRedirectTo: authRedirectUrl()}
    }).then(({data, error}) => {
      if(error) throw error;
      supabaseSession = data && data.session ? data.session : null;
      supabaseUser = supabaseSession ? supabaseSession.user : null;
      if(supabaseUser) return syncFromSupabase({force: true});
      setSyncStatus('Confirm email', 'Account created. Check your email, confirm the account, then login here.', false);
      render();
      return true;
    }).catch(error => {
      setSyncStatus('Signup failed', signupErrorMessage(error), false);
      render();
      return false;
    });
  }

  function approveFirstSyncUpload(){
    if(!supabaseUser) {
      setSyncStatus('Login required', 'Sign in before backing up local cards.', false);
      render();
      return Promise.resolve(false);
    }
    setUserSyncDecision({localUpload: 'approved'});
    syncState.firstSyncPaused = false;
    cards.forEach(queueCardSync);
    return flushSupabaseQueue({force: true, allowFirstUpload: true}).then(ok => {
      if(ok) return syncFromSupabase({force: true, allowFirstUpload: true});
      return false;
    });
  }

  function skipFirstSyncUpload(){
    if(!supabaseUser) {
      setSyncStatus('Login required', 'Sign in before changing backup settings.', false);
      render();
      return Promise.resolve(false);
    }
    setUserSyncDecision({localUpload: 'skipped'});
    clearQueuedLocalUploads();
    syncState.firstSyncPaused = false;
    syncState.lastSyncAt = nyTimestamp();
    setSyncStatus('Connected', 'Existing local cards will stay on this browser. New saved changes can use cloud backup.', false);
    render();
    return Promise.resolve(true);
  }

  function supabaseLogout(){
    const client = getSupabaseClient();
    if(!client) return Promise.resolve(false);
    return client.auth.signOut().then(() => {
      supabaseSession = null;
      supabaseUser = null;
      syncState = Object.assign({}, syncState, {
        configured: true,
        status: 'Login required',
        message: 'Signed out. Local cards remain on this device.',
        busy: false
      });
      render();
      return true;
    });
  }

  function clearDeviceData(){
    const store = storage();
    if(store){
      [KEY, SETTINGS_KEY, DRAFT_KEY, 'ict_bias_card_meta_v1', SYNC_QUEUE_KEY, SYNC_TOMBSTONES_KEY, SYNC_ACCOUNT_DECISIONS_KEY]
        .concat(LEGACY)
        .forEach(k => store.removeItem(k));
    }
    const client = getSupabaseClient();
    const signOut = (supabaseUser || supabaseSession) && client && client.auth && client.auth.signOut
      ? client.auth.signOut().catch(() => false)
      : Promise.resolve(false);
    supabaseSession = null;
    supabaseUser = null;
    syncState = Object.assign({}, syncState, {
      configured: !!client,
      status: client ? 'Login required' : 'Local only',
      message: client ? 'This device was cleared. Sign in again to restore cloud backup.' : 'Cloud backup is unavailable in this build.',
      busy: false,
      firstSyncPaused: false
    });
    cards = [];
    reviewId = '';
    startDraft(null, {persist: false});
    return signOut;
  }

  function profileFormSettings(lookup, themeOverride){
    const find = typeof lookup === 'function' ? lookup : id => doc ? doc.getElementById(id) : null;
    const current = getSettings();
    const readValue = (id, fallback) => {
      const node = find(id);
      return node ? node.value : fallback;
    };
    return {
      defaultInstrument: readValue('defaultInstrument', current.defaultInstrument),
      defaultSession: readValue('defaultSession', current.defaultSession),
      theme: themeOverride || readValue('themeMode', current.theme),
      watchlist: arrayText(readValue('watchlist', current.watchlist)),
      riskDefaults: {
        plannedRiskPct: readValue('defaultRiskPct', current.riskDefaults.plannedRiskPct),
        plannedR: readValue('defaultPlannedR', current.riskDefaults.plannedR),
        maxLoss: readValue('defaultMaxLoss', current.riskDefaults.maxLoss)
      }
    };
  }

  function plannerRowState(fields, prefix, index){
    const x = normFields(fields || {});
    const base = prefix + index;
    const any = !!(x[base + 'Level'] || x[base + 'Draw'] || x[base + 'Tf'] || x[base + 'Taken'] || x[base + 'Confidence'] || x[base + 'HitTime']);
    const complete = !!(x[base + 'Level'] && x[base + 'Draw'] && x[base + 'Tf']);
    return {any, complete, label: (prefix === 'dol' ? 'DOL ' : 'Sweep ') + index};
  }

  function plannerValidationState(fields, ctx, cardId){
    const flds = normFields(fields || {});
    const settings = getSettings();
    const baseDate = today();
    const meaningful = Object.keys(flds).some(k => {
      const value = flds[k];
      if(k === 'date') return !!(value && value !== baseDate);
      if(k === 'time') return false;
      if(k === 'instrument') return !!(value && value !== (settings.defaultInstrument || ''));
      if(k === 'session') return !!(value && value !== (settings.defaultSession || ''));
      if(typeof value === 'boolean') return value === true;
      return !!value;
    }) || !!marketContextText(ctx) || !!cardId;
    const priceMessages = priceValidationMessages(flds);
    const dolRows = [1, 2, 3].map(i => plannerRowState(flds, 'dol', i));
    const sweepRows = [1, 2, 3].map(i => plannerRowState(flds, 'sweep', i));
    const completeDol = dolRows.filter(row => row.complete);
    const partialDol = dolRows.filter(row => row.any && !row.complete).map(row => row.label);
    const partialSweep = sweepRows.filter(row => row.any && !row.complete).map(row => row.label);
    const priceAck = !!(manualPriceNeededAck || flds.manualPriceNeededAck);
    const generateErrors = [];
    if(!flds.instrument) generateErrors.push('Instrument is required.');
    if(!flds.session) generateErrors.push('Session is required.');
    if(!flds.bias) generateErrors.push('Bias Determination For Session is required.');
    if(flds.currentPrice && priceNumber(flds.currentPrice) == null){
      generateErrors.push('Current price must be greater than 0, or clear it and acknowledge manual price is needed.');
    } else if(!flds.currentPrice && !priceAck){
      generateErrors.push('Enter a current price, or acknowledge that manual price is needed before generation.');
    }
    if(!completeDol.length) generateErrors.push('Add at least one complete DOL row with price level, draw rationale and timeframe.');
    if(partialDol.length) generateErrors.push('Complete or clear partial DOL rows: ' + partialDol.join(', ') + '.');
    if(partialSweep.length) generateErrors.push('Complete or clear partial Sweep rows: ' + partialSweep.join(', ') + '.');
    priceMessages.forEach(message => {
      if(!generateErrors.includes(message)) generateErrors.push(message);
    });
    const draftErrors = meaningful ? [] : ['Add at least one planning input before saving a draft.'];
    return {
      hasMeaningfulPlannerInput: meaningful,
      canSaveDraft: draftErrors.length === 0,
      canGenerateFocusPlan: generateErrors.length === 0,
      draftErrors,
      generateErrors,
      completeDolCount: completeDol.length
    };
  }

  function plannerValidationHtml(state, mode){
    const validation = state || plannerValidationState(f, marketContextDraft, plannerCardId);
    const messages = mode === 'draft' ? validation.draftErrors : validation.generateErrors;
    if(!messages.length) return '';
    return `<div class='planner-validation price-validation' role='alert'>${messages.map(m => `<p>${esc(m)}</p>`).join('')}</div>`;
  }

  function plannerHasInput(fields, ctx, cardId){
    return plannerValidationState(fields, ctx, cardId).hasMeaningfulPlannerInput;
  }

  function persistPlannerDraft(){
    const store = storage();
    if(!store){
      lastDraftState = 'Autosave unavailable in this browser.';
      return false;
    }
    try {
      if(plannerDraftDiscarded){
        store.removeItem(DRAFT_KEY);
        lastDraftSavedAt = '';
        lastDraftState = 'Draft discarded.';
        return true;
      }
      if(!plannerHasInput(f, marketContextDraft, plannerCardId)){
        store.removeItem(DRAFT_KEY);
        lastDraftSavedAt = '';
        lastDraftState = 'No active planner draft.';
        return true;
      }
      const savedAt = isoNow();
      store.setItem(DRAFT_KEY, JSON.stringify({
        version: VERSION,
        savedAt,
        fields: normFields(f),
        marketContext: normMarketContext(marketContextDraft),
        marketContextOpenTimeframes: marketTimeframes.filter(tf => marketContextOpenTimeframes.includes(tf)),
        plannerCardId,
        reviewId,
        manualPriceNeededAck,
        lastPriceSource,
        lastPriceFetchAt
      }));
      lastDraftSavedAt = savedAt;
      lastDraftState = 'Autosaved locally at ' + nyTimestamp(savedAt) + '.';
      return true;
    } catch(e) {
      lastDraftState = 'Unsaved changes. Browser storage is unavailable or full.';
      return false;
    }
  }

  function clearPlannerDraft(){
    const store = storage();
    if(store) store.removeItem(DRAFT_KEY);
    lastDraftSavedAt = '';
    lastDraftState = 'Draft discarded.';
    plannerDraftDiscarded = true;
  }

  function restorePlannerDraft(){
    const store = storage();
    const payload = store ? parse(store.getItem(DRAFT_KEY) || '{}', {}) : {};
    if(!isObject(payload) || !isObject(payload.fields)) return false;
    f = normFields(payload.fields);
    marketContextDraft = normMarketContext(payload.marketContext);
    marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft, payload.marketContextOpenTimeframes);
    plannerCardId = asText(payload.plannerCardId);
    if(plannerCardId && !cards.find(card => card.id === plannerCardId)) plannerCardId = '';
    reviewId = asText(payload.reviewId) || reviewId;
    lastPriceSource = asText(payload.lastPriceSource) || 'manual';
    lastPriceFetchAt = Number(payload.lastPriceFetchAt) || 0;
    priceFetchState = '';
    manualPriceNeededAck = payload.manualPriceNeededAck === true || f.manualPriceNeededAck === true;
    f.manualPriceNeededAck = manualPriceNeededAck;
    plannerValidationMode = '';
    lastDraftSavedAt = asText(payload.savedAt);
    lastDraftState = lastDraftSavedAt ? 'Restored autosaved draft from ' + nyTimestamp(lastDraftSavedAt) + '.' : 'Restored autosaved draft.';
    plannerDraftDiscarded = false;
    return true;
  }

  function normaliseRoute(value){
    const raw = asText(value || 'home');
    const next = raw === 'review' ? 'focus' : raw === 'journal' ? 'home' : raw;
    return ROUTES.includes(next) ? next : 'home';
  }

  function parseRouteHash(){
    const hash = root.location && root.location.hash ? String(root.location.hash).replace(/^#\/?/, '') : '';
    if(!hash) return null;
    const parts = hash.split('/');
    const routeName = safeDecode(parts[0] || 'home', 'home');
    if(routeName !== 'review' && routeName !== 'journal' && !ROUTES.includes(routeName)) return null;
    return {
      route: normaliseRoute(routeName),
      id: parts[1] ? safeDecode(parts[1], '') : ''
    };
  }

  function safeDecode(value, fallback){
    try {
      return decodeURIComponent(value);
    } catch(e) {
      return fallback || '';
    }
  }

  function routeHash(){
    const id = ['focus','timeline'].includes(route) && reviewId ? '/' + encodeURIComponent(reviewId) : '';
    return '#' + encodeURIComponent(route) + id;
  }

  function writeRouteHash(replace){
    if(!root.location) return;
    const hash = routeHash();
    if(root.location.hash === hash) return;
    if(root.history && (replace ? root.history.replaceState : root.history.pushState)){
      root.history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    } else {
      root.location.hash = hash;
    }
  }

  function ensurePlannerDraft(){
    if(plannerHasInput(f, marketContextDraft, plannerCardId)) return;
    startDraft(null, {persist: false});
  }

  function restoreRouteFromHash(){
    const parsed = parseRouteHash();
    if(!parsed) return false;
    route = parsed.route;
    if(parsed.id) reviewId = parsed.id;
    if(route === 'planner') ensurePlannerDraft();
    return true;
  }

  function handleRouteChangeFromHash(){
    if(route === 'planner') sync();
    if(restoreRouteFromHash()) render();
  }

  let route = 'home';
  let step = 0;
  let f = blank();
  let marketContextDraft = blankMarketContext();
  let marketContextOpenTimeframes = [];
  let lastStorageError = '';
  let lastSettingsError = '';
  let cards = loadCards();
  let reviewId = '';
  let notice = '';
  let noticeLevel = 'good';
  let homeSession = 'All';
  let priceFetchState = '';
  let lastPriceSource = 'manual';
  let lastPriceFetchAt = 0;
  let lastDraftState = '';
  let lastDraftSavedAt = '';
  let plannerDraftDiscarded = false;
  let manualPriceNeededAck = false;
  let plannerValidationMode = '';
  let supabaseClient = null;
  let supabaseSession = null;
  let supabaseUser = null;
  let authListenerInstalled = false;
  let syncState = {
    configured: false,
    status: 'Local only',
    message: 'Cloud backup is unavailable in this build.',
    busy: false,
    lastSyncAt: '',
    remoteCardCount: null,
    firstSyncPaused: false
  };

  function normaliseNoticeLevel(level){
    return NOTICE_LEVELS.includes(level) ? level : 'good';
  }

  function noticeClass(level){
    return normaliseNoticeLevel(level);
  }

  function noticeRole(level){
    return normaliseNoticeLevel(level) === 'bad' ? 'alert' : 'status';
  }

  function ensureLiveRegion(){
    if(!doc) return null;
    let node = doc.getElementById && doc.getElementById('globalStatus');
    if(node) return node;
    if(!doc.createElement) return null;
    node = doc.createElement('div');
    node.id = 'globalStatus';
    node.className = 'sr-only';
    if(node.setAttribute){
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'true');
    } else {
      node.role = 'status';
      node.ariaLive = 'polite';
      node.ariaAtomic = 'true';
    }
    if(app && app.parentNode && app.parentNode.insertBefore) app.parentNode.insertBefore(node, app);
    else if(doc.body && doc.body.appendChild) doc.body.appendChild(node);
    return node;
  }

  function announce(message, level){
    const text = asText(message);
    if(!text) return;
    const node = ensureLiveRegion();
    if(!node) return;
    const nextLevel = normaliseNoticeLevel(level);
    const role = noticeRole(nextLevel);
    const live = nextLevel === 'bad' ? 'assertive' : 'polite';
    if(node.setAttribute){
      node.setAttribute('role', role);
      node.setAttribute('aria-live', live);
      node.setAttribute('aria-atomic', 'true');
    } else {
      node.role = role;
      node.ariaLive = live;
      node.ariaAtomic = 'true';
    }
    node.textContent = '';
    if(typeof setTimeout === 'function') setTimeout(() => { node.textContent = text; }, 0);
    else node.textContent = text;
  }

  function setNotice(message, level){
    notice = asText(message);
    noticeLevel = normaliseNoticeLevel(level);
    announce(notice, noticeLevel);
    return notice;
  }

  const api = {
    KEY,
    LEGACY,
    SCHEMA,
    SETTINGS_KEY,
    DRAFT_KEY,
    blank,
    clean,
    normFields,
    normMarketContext,
    blankMarketContext,
    derivePotentialPhase,
    normaliseCard,
    normalizeCard: normaliseCard,
    nyTimestamp,
    nyDateInput,
    nyTimeInput,
    priceSnapshot,
    activeDol,
    normRouteEvidence,
    calculateRiskPlan,
    normRiskPlan,
    priceNumber,
    priceValidationMessages,
    normalizePriceSymbol,
    validPriceSymbol,
    plannerValidationState,
    dolDistance,
    priceSourceLabel,
    cleanUrl,
    priceApiBase,
    priceHelperUrl,
    localPriceHelperUrl,
    priceHelperUrls,
    localPriceFallbackAllowed,
    noticeClass,
    noticeRole,
    setNotice,
    clearDeviceData,
    supabaseConfig,
    adminSupabaseEmail,
    getSyncQueue,
    getUserSyncDecision,
    mergeCards,
    remoteCardPayload,
    syncFromSupabase,
    supabaseSignup,
    approveFirstSyncUpload,
    skipFirstSyncUpload,
    priceRefreshRemaining,
    priceCountdownText,
    selectedMarketTimeframes,
    focusReviewFields,
    plannerHasInput,
    setHomeSession,
    comp,
    clearPlannerDraft,
    discardPlannerDraft,
    draftState: () => ({message: lastDraftState, savedAt: lastDraftSavedAt}),
    priceMapLevels,
    priceMapHtml,
    text,
    getCards,
    saveCards,
    lastStorageError: () => lastStorageError,
    getMetrics,
    createBlankDraft,
    updateCard,
    deleteCard,
    toggleFavorite,
    exportCards,
    importCards,
    getSettings,
    saveSettings,
    lastSettingsError: () => lastSettingsError,
    parseRouteHash,
    go
  };
  root.ICTSweepState = api;
  root.ICTStateData = api;

  function options(a, v, p){
    return `<option value=''>${esc(p || '- select -')}</option>` +
      a.map(x => `<option value='${esc(x)}'${x === v ? ' selected' : ''}>${esc(x)}</option>`).join('');
  }

  function input(k, l, p, t){
    const numeric = isPriceField(k);
    return `<label class='label' for='${k}'>${esc(l)}</label><input class='in ${numeric ? 'numeric' : ''}' id='${k}' type='${numeric ? 'text' : t || 'text'}' ${numeric ? 'inputmode=decimal autocomplete=off' : ''} value='${esc(f[k])}' placeholder='${esc(p || '')}'>`;
  }

  function select(k, l, a, p){
    return `<label class='label' for='${k}'>${esc(l)}</label><select class='in' id='${k}'>${options(a, f[k], p)}</select>`;
  }

  function selectDisabled(k, l, a, p, disabled){
    return `<label class='label' for='${k}'>${esc(l)}</label><select class='in' id='${k}' ${disabled ? 'disabled' : ''}>${options(a, disabled ? '' : f[k], p)}</select>`;
  }

  function selectValue(id, l, a, v, p){
    return `<label class='label' for='${id}'>${esc(l)}</label><select class='in' id='${id}'>${options(a, v, p)}</select>`;
  }

  function textarea(k, l, p){
    return `<label class='label' for='${k}'>${esc(l)}</label><textarea class='in' id='${k}' placeholder='${esc(p || '')}'>${esc(f[k])}</textarea>`;
  }

  function line(k, v){
    return `<div class='line'><div class='k'>${esc(k)}</div><div class='v'>${v ? esc(v) : `<span class='empty'>-</span>`}</div></div>`;
  }

  function raw(k, v){
    return `<div class='line'><div class='k'>${esc(k)}</div><div class='v'>${v}</div></div>`;
  }

  function pill(t, c){
    return `<span class='pill ${c || ''}'>${esc(t)}</span>`;
  }

  function stack(x, p, l){
    const out = [];
    for(let i = 1; i <= 3; i++){
      const parts = p === 'dol' ? [
        x[p + i + 'Level'] && 'Price level: ' + x[p + i + 'Level'],
        x[p + i + 'Draw'] && 'Draw rationale: ' + x[p + i + 'Draw'],
        x[p + i + 'Tf'] && 'Timeframe: ' + x[p + i + 'Tf'],
        'Taken: ' + (x[p + i + 'Taken'] ? 'Yes' : 'No'),
        x[p + i + 'Level'] && dolDistance(x[p + i + 'Level'], x.currentPrice).label
      ].filter(Boolean) : [
        x[p + i + 'Level'] && 'Level ' + x[p + i + 'Level'],
        x[p + i + 'Draw'] && l + ': ' + x[p + i + 'Draw'],
        x[p + i + 'Tf'] && 'Timeframe: ' + x[p + i + 'Tf'],
        'Taken: ' + (x[p + i + 'Taken'] ? 'Yes' : 'No'),
        x[p + i + 'Confidence'] && 'Confidence: ' + x[p + i + 'Confidence'],
        x[p + i + 'HitTime'] && 'Hit time: ' + x[p + i + 'HitTime']
      ].filter(Boolean);
      if(parts.length) out.push((p === 'dol' ? 'DOL ' : 'Sweep ') + i + ' - ' + parts.join(' | '));
    }
    return out.join(NL);
  }

  function marketContextText(ctx){
    const context = normMarketContext(ctx);
    const rows = marketTimeframes.map(tf => {
      const row = context[tf];
      const parts = [
        row.phase && 'Phase: ' + row.phase,
        row.potentialNextPhase && 'Potential next: ' + row.potentialNextPhase,
        row.note && 'Note: ' + row.note
      ].filter(Boolean);
      return parts.length ? tf + ' - ' + parts.join(' | ') : '';
    }).filter(Boolean);
    return rows.join(NL);
  }

  function hasMarketContextRow(row){
    return !!(row && (row.phase || row.note || row.potentialNextPhase));
  }

  function selectedMarketTimeframes(ctx){
    const context = normMarketContext(ctx);
    const open = Array.isArray(arguments[1]) ? arguments[1] : marketContextOpenTimeframes;
    return marketTimeframes.filter(tf => open.includes(tf) || hasMarketContextRow(context[tf]));
  }

  function focusReviewFields(c, lookup){
    const out = {};
    const fields = c && c.fields ? c.fields : {};
    const findNode = typeof lookup === 'function'
      ? lookup
      : id => doc ? doc.getElementById(id) : null;
    for(let i = 1; i <= 3; i++){
      for(const p of ['dol', 'sweep']){
        const key = p + i + 'Taken';
        const node = findNode('focus_' + key);
        const mapNode = p === 'dol' ? findNode('priceMap_' + key) : null;
        out[key] = mapNode ? !!mapNode.checked : node ? !!node.checked : !!fields[key];
      }
    }
    const fvgNode = findNode('focusFvg');
    const fvgTfNode = findNode('focusFvgTf');
    out.fvg = fvgNode ? !!fvgNode.checked : !!fields.fvg;
    out.fvgTf = out.fvg ? (fvgTfNode ? asText(fvgTfNode.value) : asText(fields.fvgTf)) : '';
    return out;
  }

  function syncMarketContextOpenTimeframes(ctx){
    const context = normMarketContext(ctx);
    marketContextOpenTimeframes = marketTimeframes.filter(tf => marketContextOpenTimeframes.includes(tf) || hasMarketContextRow(context[tf]));
  }

  function marketContextPlanner(ctx){
    const context = normMarketContext(ctx);
    const selected = selectedMarketTimeframes(context);
    const available = marketTimeframes.filter(tf => !selected.includes(tf));
    const addControl = available.length
      ? `<div class='grid'><div><label class='label' for='marketContextAddTf'>Add timeframe</label><select class='in' id='marketContextAddTf'>${options(available, '', '- choose timeframe -')}</select></div></div>`
      : `<p class='hint'>All Market Context timeframes are open.</p>`;
    const empty = selected.length ? '' : `<div class='panel'><p class='hint'>Choose only the timeframe you want to record. Blank timeframes are not forced into the planner.</p></div>`;
    const rows = selected.map(tf => {
      const key = marketPhaseKeys[tf];
      const row = context[tf];
      const hint = row.phase ? phaseContextText[row.phase] : 'Select a phase to derive a conservative next context.';
      return `<div class='panel'><div class='progress'>${esc(tf)}</div><div class='grid'><div>${selectValue('ctx_' + key + '_phase', 'Current phase', phaseOptions, row.phase, '- phase -')}</div><div>${selectValue('ctx_' + key + '_next', 'Potential next phase', phaseOptions, row.potentialNextPhase, row.phase ? 'Derived: ' + derivePotentialPhase(row.phase) : '- potential next phase -')}</div></div><label class='label' for='ctx_${key}_note'>Context note</label><textarea class='in' id='ctx_${key}_note' placeholder='Observed structure only; no forecast.'>${esc(row.note)}</textarea><p class='hint'>${esc(hint)} This is context for the selected session, not a forecast.</p></div>`;
    }).join('');
    return addControl + empty + rows;
  }

  function marketContextRows(ctx){
    const text = marketContextText(ctx);
    if(!text) return `<div class='panel'><p class='hint'>No market context recorded.</p></div>`;
    return marketTimeframes.map(tf => {
      const row = normMarketContext(ctx)[tf];
      if(!(row.phase || row.note || row.potentialNextPhase)) return '';
      const hint = row.phase ? phaseContextText[row.phase] : '';
      return `<div class='card-row'><div><div class='progress'>${esc(tf)}</div><h3>${esc(row.phase || 'No phase')}</h3><p class='sub'>Potential next phase: ${esc(row.potentialNextPhase || '-')}</p>${row.note ? `<p class='sub'>${esc(row.note)}</p>` : ''}${hint ? `<p class='hint'>${esc(hint)}</p>` : ''}</div>${pill(row.potentialNextPhase || 'N/A', 'info')}</div>`;
    }).join('');
  }

  function biasSummary(x){
    if(!x.bias) return '';
    return `<div data-core-bias-summary='1'>${line('Bias Determination For Session', x.bias)}</div>`;
  }

  function signedNum(n){
    if(!Number.isFinite(n)) return 'N/A';
    return (n > 0 ? '+' : '') + fmtNum(n);
  }

  function priceMapLevels(x){
    const current = priceNumber(x.currentPrice);
    const rows = [];
    for(let i = 1; i <= 3; i++){
      [
        {prefix: 'dol', kind: 'DOL'},
        {prefix: 'sweep', kind: 'Sweep'}
      ].forEach(item => {
        const level = priceNumber(x[item.prefix + i + 'Level']);
        const draw = x[item.prefix + i + 'Draw'];
        const tf = x[item.prefix + i + 'Tf'];
        const hasAny = x[item.prefix + i + 'Level'] || draw || tf || x[item.prefix + i + 'Taken'];
        if(!hasAny || level == null) return;
        const diff = current == null ? null : level - current;
        const pct = current == null || current === 0 || diff == null ? 'N/A' : (diff / current * 100).toFixed(2) + '%';
        rows.push({
          prefix: item.prefix,
          index: i,
          fieldKey: item.prefix + i + 'Taken',
          kind: item.kind,
          name: draw || 'Unspecified liquidity',
          price: level,
          timeframe: tf || 'No timeframe',
          taken: !!x[item.prefix + i + 'Taken'],
          rationale: draw || '',
          above: current == null ? false : level > current,
          distPts: diff == null ? 'N/A' : signedNum(diff),
          distPct: pct
        });
      });
    }
    return rows.sort((a, b) => b.price - a.price);
  }

  function priceMapSourceInfo(current, meta){
    if(current == null){
      return {source: 'Manual pending', label: 'Manual needed', liveClass: 'pending'};
    }
    const source = asText(meta && meta.source) || lastPriceSource || 'manual';
    if(source === 'hosted-yfinance') return {source: 'hosted yfinance API', label: 'Live', liveClass: 'live'};
    if(source === 'local-yfinance') return {source: 'local yfinance helper', label: 'Live', liveClass: 'live'};
    return {source: 'manual entry', label: 'Manual', liveClass: 'manual'};
  }

  function priceMapHtml(x, meta){
    const current = priceNumber(x.currentPrice);
    const levels = priceMapLevels(x);
    const instrument = x.instrument || (meta && meta.instrument) || 'No instrument';
    const session = x.session || (meta && meta.session) || 'No session';
    const updated = x.time || (meta && meta.updatedAt) || 'Manual';
    const sourceInfo = priceMapSourceInfo(current, meta);
    const header = `<div class='price-map-header'><div><div class='progress'>Price Map</div><h3 class='price-map-title'>${esc(instrument)}</h3><div class='price-map-meta'>${esc(session)} · Updated ${esc(updated)}</div><div class='price-map-source'>Source: ${esc(sourceInfo.source)}</div></div><div class='price-map-status'><div class='price-map-live ${sourceInfo.liveClass}'>${esc(sourceInfo.label)}</div>${priceCountdownHtml()}</div></div>`;
    const priceProblem = ['error','unavailable','unsupported','malformed'].includes(priceFetchState);
    const notice = priceFetchState === 'loading'
      ? `<div class='price-map-loading'>Fetching ${esc(instrument)} price from yfinance...</div>`
      : priceProblem
        ? `<div class='price-map-error'>${esc(priceStatusMessage())}</div>`
        : '';
    if(current == null || !levels.length){
      return `<div class='price-map'>${header}<div class='price-map-empty'><h3>No price levels mapped yet</h3><p class='hint'>Add current price plus at least one numeric DOL or Sweep level to build the ladder.</p></div>${notice}</div>`;
    }
    const above = levels.filter(level => level.price > current);
    const below = levels.filter(level => level.price <= current);
    const row = level => {
      const sideClass = level.kind === 'Sweep' ? 'sweep' : (level.above ? 'dol above' : 'dol below');
      const classes = ['price-map-row', sideClass, level.taken ? 'taken' : ''].filter(Boolean).join(' ');
      const distance = level.distPts + ' pts · ' + level.distPct;
      const editableDol = meta && meta.editable && level.kind === 'DOL';
      const takenControl = editableDol ? `<label class='check-row compact price-map-taken'><input type='checkbox' id='priceMap_${level.fieldKey}' data-mirror-taken='${level.fieldKey}' ${level.taken ? 'checked' : ''}> <span>DOL taken</span></label>` : '';
      return `<div class='${classes}'><div><div class='price-map-row-title'><span class='pill ${level.kind === 'DOL' ? 'info' : 'warn'}'>${esc(level.kind)}</span><span>${esc(level.name)}</span></div><div class='price-map-row-sub'>${esc(level.timeframe)} · ${level.taken ? 'Taken' : 'Pending'}${level.rationale ? ' · ' + esc(level.rationale) : ''}</div>${takenControl}</div><div><div class='price-map-price'>${esc(fmtNum(level.price))}</div><div class='price-map-distance'>${esc(distance)}</div></div></div>`;
    };
    return `<div class='price-map'>${header}<div class='price-map-body'>${above.map(row).join('')}<div class='price-map-current'><span>CURRENT PRICE</span><strong>${esc(fmtNum(current))}</strong></div>${below.map(row).join('')}</div>${notice}</div>`;
  }

  function activeDolHtml(c){
    const dol = activeDol(c.fields, c.activeDolId);
    if(!dol) return `<div class='panel'><p class='hint'>Select or add a DOL target to focus the card.</p></div>`;
    return `<div class='metric-grid'><div class='metric'><div class='m'>${esc(dol.level || '-')}</div><div class='l'>Active DOL</div></div><div class='metric'><div class='m'>${esc(dol.distance.absolute)}</div><div class='l'>Points to DOL</div></div><div class='metric'><div class='m'>${esc(dol.distance.percent)}</div><div class='l'>Percent distance</div></div><div class='metric'><div class='m'>${esc(dol.status)}</div><div class='l'>DOL status</div></div></div><div class='panel'><h3>${esc(dol.label)}</h3><p class='sub'>${esc(dol.direction || 'Direction unavailable')} · ${esc(dol.timeframe || 'No timeframe')}</p><p class='hint'>Focus card tracks where price is relative to the selected DOL and how price is delivering toward it.</p></div>`;
  }

  function auditStripHtml(c){
    return `<div class='audit-strip'><span class='audit-pill'>Created <strong>${esc(c.createdAtNy || '-')}</strong></span><span class='audit-pill'>Last saved <strong>${esc(c.updatedAtNy || '-')}</strong></span></div>`;
  }

  function priceSnapshotCardHtml(c){
    const latest = c.priceSnapshot || {};
    const created = c.priceHistory && c.priceHistory.length ? c.priceHistory[0] : latest;
    return `<div class='snapshot-card'><div><div class='progress'>Latest saved price</div><div class='snapshot-value'>${esc(latest.price || c.fields.currentPrice || '-')}</div><div class='snapshot-meta'>${esc(latest.symbol || c.fields.instrument || 'No symbol')} · ${esc(latest.source || 'manual')} · ${esc(latest.capturedAtNy || c.updatedAtNy || '-')}</div></div><div class='snapshot-side'><span>Created price</span><strong>${esc(created.price || '-')}</strong></div></div><p class='snapshot-disclaimer'>${esc(PRICE_DELAY_DISCLAIMER)}</p><p class='hint'>Price source: ${esc(latest.source || 'manual')}</p>`;
  }

  function priceOverrideHtml(c){
    return `<div class='override-panel'><label class='label' for='focusCurrentPrice'>Override price before saving</label><input class='in numeric' id='focusCurrentPrice' inputmode='decimal' value='${esc(c.fields.currentPrice)}' placeholder='manual current price'><p class='hint'>Save changes or Final save to capture a new timestamp and price snapshot.</p></div>`;
  }

  function riskPlanHtml(c){
    const rp = normRiskPlan(c.riskPlan, c.fields, c.activeDolId);
    const statusClass = rp.status === 'ready' ? 'ok' : rp.status === 'invalid' ? 'bad' : 'warn';
    const dolOptions = dolIds.map(id => {
      const label = dolLabel(c.fields, id);
      const has = c.fields[id + 'Level'] || c.fields[id + 'Draw'];
      return has ? `<option value='${id}'${rp.targetDolId === id ? ' selected' : ''}>${esc(label)}</option>` : '';
    }).join('');
    return `<div class='status-row'>${pill(rp.status, statusClass)}${rp.rr ? pill(rp.rr, 'info') : ''}</div><div class='grid'><div><label class='label' for='riskDirection'>Direction</label><select class='in' id='riskDirection'>${options(riskDirections, rp.direction, '- direction -')}</select></div><div><label class='label' for='riskTargetDol'>Target DOL</label><select class='in' id='riskTargetDol'><option value=''>- target DOL -</option>${dolOptions}</select></div></div><div class='grid'><div><label class='label' for='riskEntryPrice'>Current / entry</label><input class='in numeric' id='riskEntryPrice' inputmode='decimal' value='${esc(rp.entryPrice)}' placeholder='current or entry price'></div><div><label class='label' for='riskRatio'>Target R:R</label><select class='in' id='riskRatio'>${options(riskRatios, rp.ratio, '- ratio -')}</select></div></div><div class='metric-grid'><div class='metric'><div class='m'>${esc(rp.targetPrice || '-')}</div><div class='l'>Target DOL</div></div><div class='metric'><div class='m'>${esc(rp.invalidationPrice || '-')}</div><div class='l'>Invalidation / stop</div></div><div class='metric'><div class='m'>${esc(rp.riskPoints || '-')}</div><div class='l'>Risk points</div></div><div class='metric'><div class='m'>${esc(rp.rewardPoints || '-')}</div><div class='l'>Reward points</div></div><div class='metric'><div class='m'>${esc(rp.rr || '-')}</div><div class='l'>Potential R:R</div></div></div><p class='hint'>${esc(rp.message)}</p>`;
  }

  function routeEvidenceHtml(c){
    const rows = c.routeEvidence && c.routeEvidence.length ? c.routeEvidence.map(row => `<div class='card-row'><div><div class='progress'>${esc(row.createdAtNy)}</div><h3>${esc([row.arrayType, row.behavior].filter(Boolean).join(' · ') || 'Route evidence')}</h3><p class='sub'>${esc(row.timeframe || 'No timeframe')} · ${esc(row.level || 'No level')}</p>${row.notes ? `<p class='hint'>${esc(row.notes)}</p>` : ''}</div>${pill(row.behavior || 'Pending', row.behavior === 'Respect' ? 'ok' : row.behavior === 'Disrespect' ? 'bad' : 'warn')}</div>`).join('') : `<div class='panel'><p class='hint'>No route evidence logged yet. Add respect/disrespect observations for SIBI, BISI, CE, OB, FVG, highs or lows.</p></div>`;
    return `${rows}<div class='panel'><div class='progress'>Add route evidence</div><div class='grid'><div><label class='label' for='routeArrayType'>Array type</label><select class='in' id='routeArrayType'>${options(arrayTypes, '', '- array -')}</select></div><div><label class='label' for='routeBehavior'>Observed behavior</label><select class='in' id='routeBehavior'>${options(routeBehaviors, '', '- behavior -')}</select></div></div><div class='grid'><div><label class='label' for='routeTimeframe'>Timeframe</label><select class='in' id='routeTimeframe'>${options(liquidityTimeframes, '', '- timeframe -')}</select></div><div><label class='label' for='routeLevel'>Level / zone</label><input class='in' id='routeLevel' placeholder='price or range'></div></div><label class='label' for='routeNotes'>Observation notes</label><textarea class='in' id='routeNotes' placeholder='How is price getting to the DOL? Respecting/disrespecting SIBI, BISI, CE, etc.'></textarea></div>`;
  }

  function priceHistoryHtml(c){
    const rows = (c.priceHistory || []).slice(-5).reverse().map(row => `<div class='price-history-row'><span>${esc(row.capturedAtNy || '-')} · ${esc(row.event)}</span><strong>${esc(row.price || '-')}</strong></div>`).join('');
    return `<details class='price-history-compact'><summary>Recent price captures</summary>${rows || `<p class='hint'>No price history saved yet.</p>`}</details>`;
  }

  function fvgReviewHtml(c){
    const formed = !!(c.fields.fvg || c.markers.fvgFormed);
    return `<label class='check-row'><input type='checkbox' id='focusFvg' ${formed ? 'checked' : ''}> <span>FVG formed after sweep</span></label><label class='label' for='focusFvgTf'>FVG timeframe</label><select class='in' id='focusFvgTf' ${formed ? '' : 'disabled'}>${options(tfs, formed ? c.fields.fvgTf : '', '- FVG timeframe -')}</select><p class='hint'>You can update this after the card is created because the FVG may form during the trade window.</p>`;
  }

  function summary(x, ctx){
    return biasSummary(x) +
      line('Date', x.date) +
      line('Time', x.time) +
      line('Instrument', x.instrument) +
      line('Session', x.session) +
      line('Current price', x.currentPrice) +
      line('Price source', priceSourceLabel()) +
      line('Market Context', marketContextText(ctx)) +
      line('DOL stack', stack(x, 'dol', 'Liquidity draw')) +
      line('Sweep stack', stack(x, 'sweep', 'Sweep liquidity')) +
      line('FVG', x.fvg ? 'Confirmed' + (x.fvgTf ? ' | ' + x.fvgTf : '') : 'Not confirmed');
  }

  function metricHtml(inputCards){
    const m = getMetrics(inputCards || cards);
    return `<div class='metric-grid'><div class='metric'><div class='m'>${m.rate}</div><div class='l'>Final hit rate</div></div><div class='metric'><div class='m'>${m.sample}</div><div class='l'>Hit/Miss sample</div></div><div class='metric'><div class='m'>${m.be}</div><div class='l'>Breakeven</div></div><div class='metric'><div class='m'>${m.needs}</div><div class='l'>Needs final save</div></div></div>`;
  }

  function row(p, i, t, l){
    if(p === 'dol'){
      return `<div class='panel'><div class='progress'>${t} ${i} of 3</div><div class='grid'><div>${input(p + i + 'Level', 'Price level', 'price level or N/A')}</div><div>${select(p + i + 'Draw', 'Draw rationale', draws, '- select draw rationale -')}</div></div>${select(p + i + 'Tf', 'Timeframe used', liquidityTimeframes, '- timeframe -')}<p class='hint'>DOL taken is confirmed from Focus Card Details after review.</p></div>`;
    }
    return `<div class='panel'><div class='progress'>${t} ${i} of 3</div><div class='grid'><div>${input(p + i + 'Level', t + ' liquidity price level', 'price level or N/A')}</div><div>${select(p + i + 'Draw', l, draws, '- select liquidity draw -')}</div></div><div class='grid'><div>${select(p + i + 'Tf', 'Timeframe used', liquidityTimeframes, '- timeframe -')}</div><label class='check-row'><input type='checkbox' id='${p + i}Taken' ${f[p + i + 'Taken'] ? 'checked' : ''}> <span>Sweep taken</span></label></div><div class='grid'><div>${select(p + i + 'Confidence', t + ' confidence', conf, '- confidence -')}</div><div>${select(p + i + 'HitTime', 'Hit time', times, '- expected hit time -')}</div></div></div>`;
  }

  const conceptLibrary = [
    {cat: 'DOL', name: 'Previous Day High', text: 'Map PDH as a possible draw on liquidity.'},
    {cat: 'DOL', name: 'Previous Day Low', text: 'Map PDL as a possible draw on liquidity.'},
    {cat: 'DOL', name: 'Previous Week High', text: 'Map PWH as a higher-timeframe liquidity draw.'},
    {cat: 'DOL', name: 'Previous Week Low', text: 'Map PWL as a higher-timeframe liquidity draw.'},
    {cat: 'Sweep', name: 'Asia High/Low', text: 'Record Asia range liquidity as a possible sweep area.'},
    {cat: 'Sweep', name: 'London High/Low', text: 'Record London range liquidity as a possible sweep area.'},
    {cat: 'Sweep', name: 'Relative Equal Highs/Lows', text: 'Record relative equal highs or lows as resting liquidity.'},
    {cat: 'Sweep', name: 'Liquidity Sweep', text: 'Use only as a mapped observation, not as a trade signal.'},
    {cat: 'FVG', name: 'Fair Value Gap', text: 'Track whether an FVG formed after the sweep.'},
    {cat: 'Bias', name: 'Bullish Bias Read', text: 'Seek sell-side raid, rejection, then delivery toward buy-side liquidity.'},
    {cat: 'Bias', name: 'Bearish Bias Read', text: 'Seek buy-side raid, rejection, then delivery toward sell-side liquidity.'},
    {cat: 'Killzone', name: 'New York AM', text: 'Use as a planning session label only.'}
  ];
  let savedFilter = 'All';
  let savedSearch = '';
  let liquidityFilter = 'All';
  let liquiditySearch = '';
  let plannerCardId = '';

  function icon(name){
    return `<span class='material-symbols-rounded' aria-hidden='true'>${esc(name)}</span>`;
  }

  function today(){
    return nyDateInput();
  }

  function sortedCards(){
    return cards.slice().sort((a, b) => new Date(b.updatedAt || b.savedAt) - new Date(a.updatedAt || a.savedAt));
  }

  function latestCard(){
    const sorted = sortedCards();
    return sorted.find(c => !c.finalSaved) || sorted[0] || null;
  }

  function startDraft(seed, options){
    const settings = getSettings();
    const input = isObject(seed) ? seed : {};
    const opts = isObject(options) ? options : {};
    const base = blank();
    base.date = today();
    base.instrument = settings.defaultInstrument || '';
    base.session = settings.defaultSession || '';
    const seedFields = input.fields ? input.fields : input;
    f = normFields(Object.assign(base, seedFields || {}));
    marketContextDraft = normMarketContext(input.marketContext || (input.fields && input.fields.marketContext));
    marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft, []);
    plannerCardId = '';
    priceFetchState = '';
    lastPriceSource = 'manual';
    manualPriceNeededAck = false;
    plannerValidationMode = '';
    plannerDraftDiscarded = opts.discarded === true;
    step = 0;
    if(opts.persist !== false) persistPlannerDraft();
  }

  function discardPlannerDraft(){
    clearPlannerDraft();
    startDraft(null, {persist: false, discarded: true});
  }

  function statusPill(c){
    const status = cardStatus(c);
    return c.finalSaved ? pill('Final saved', 'info') : (status === 'complete' ? pill('Complete', 'ok') : pill('Draft', 'warn'));
  }

  function biasPill(value){
    return value ? pill(value, value === 'Bullish' ? 'ok' : 'bad') : pill('No bias', 'warn');
  }

  function outcomePill(value){
    return pill(value || 'Open', value === 'Hit' ? 'ok' : value === 'Miss' ? 'bad' : value === 'Breakeven' ? 'warn' : value === 'Read' ? 'info' : '');
  }

  function stackRows(x, p, label){
    const rows = [];
    for(let i = 1; i <= 3; i++){
      const any = x[p + i + 'Level'] || x[p + i + 'Draw'] || x[p + i + 'Tf'] || x[p + i + 'Taken'] || x[p + i + 'Confidence'] || x[p + i + 'HitTime'];
      if(any){
        const body = p === 'dol'
          ? `<h3>${esc(x[p + i + 'Draw'] || 'Unspecified liquidity')}</h3><p class='sub'>Price level: ${esc(x[p + i + 'Level'] || 'No level')} · Timeframe: ${esc(x[p + i + 'Tf'] || 'No timeframe')}</p><p class='hint'>${esc(dolDistance(x[p + i + 'Level'], x.currentPrice).label)}</p>`
          : `<h3>${esc(x[p + i + 'Draw'] || 'Unspecified liquidity')}</h3><p class='sub'>${esc(x[p + i + 'Level'] || 'No level')} · Timeframe: ${esc(x[p + i + 'Tf'] || 'No timeframe')} · ${esc(x[p + i + 'Confidence'] || 'No confidence')} · ${esc(x[p + i + 'HitTime'] || 'No hit time')}</p>`;
        const status = `<label class='check-row compact'><input type='checkbox' id='focus_${p + i}Taken' ${x[p + i + 'Taken'] ? 'checked' : ''}> <span>${p === 'dol' ? 'DOL taken' : 'Sweep taken'}</span></label>`;
        rows.push(`<div class='card-row'><div><div class='progress'>${esc(label)} ${i}</div>${body}</div><div class='status-row'>${pill(x[p + i + 'Level'] || 'N/A', 'info')}${status}</div></div>`);
      }
    }
    return rows.join('') || `<div class='panel'><p class='hint'>No ${esc(label.toLowerCase())} records yet.</p></div>`;
  }

  function pageHead(kicker, title, sub, back){
    return `<div class='btn-row-between'><div><div class='progress'>${esc(kicker)}</div><h2>${esc(title)}</h2>${sub ? `<p class='sub'>${esc(sub)}</p>` : ''}</div>${back ? `<button class='btn ghost' data-route='${esc(back)}'>${icon('arrow_back')}Back</button>` : ''}</div>`;
  }

  function renderTabBar(active){
    const tabs = [
      ['home', 'home', 'Home'],
      ['planner', 'edit_note', 'Planner'],
      ['saved', 'folder_open', 'Saved'],
      ['profile', 'person', 'Profile']
    ];
    return `<nav class='tab-bar' aria-label='Primary'><div class='inner'>${tabs.map(t => `<button class='btn ${active === t[0] ? 'active' : ''}' data-route='${t[0]}' ${active === t[0] ? `aria-current='page'` : ''}>${icon(t[1])}<span>${t[2]}</span></button>`).join('')}</div></nav>`;
  }

  function activeTab(){
    if(['home','planner','saved','profile'].includes(route)) return route;
    if(['focus','review','timeline'].includes(route)) return 'saved';
    if(route === 'liquidity-map') return 'planner';
    if(route === 'risk' || route === 'component-gallery') return 'profile';
    return 'home';
  }

  function setHomeSession(value){
    homeSession = ['All'].concat(sessions).includes(value) ? value : 'All';
    if(route === 'home') render();
    return homeSession;
  }

  function fabHtml(){
    if(!['home','saved','risk','profile'].includes(route)) return '';
    return `<button class='fab' id='globalNewBtn' aria-label='Start new plan'>${icon('add')}</button><button class='desktop-new-plan btn primary' id='globalNewDesktopBtn'>${icon('add')}New analysis</button>`;
  }

  function renderShell(content){
    const skip = route === 'planner' ? `<a class='skip-link' href='#plannerActions'>Skip to planner actions</a>` : '';
    return `<div class='app-shell'>${skip}<main class='app-main'>${notice ? `<div class='save-state ${noticeClass(noticeLevel)}' role='${noticeRole(noticeLevel)}'>${esc(notice)}</div>` : ''}${content}</main>${fabHtml()}${renderTabBar(activeTab())}</div>`;
  }

  function home(){
    const homeCards = homeSession === 'All' ? cards : cards.filter(c => c.fields.session === homeSession);
    const sorted = homeCards.slice().sort((a, b) => new Date(b.updatedAt || b.savedAt) - new Date(a.updatedAt || a.savedAt));
    const current = sorted.find(c => !c.finalSaved) || sorted[0] || null;
    const settings = getSettings();
    const sessionOptions = ['All'].concat(sessions);
    const chips = sessionOptions.map(s => `<button class='chip ${homeSession === s ? 'chip-active' : ''}' data-session-chip='${esc(s)}' aria-pressed='${homeSession === s ? 'true' : 'false'}'>${esc(s)}</button>`).join('');
    const hero = current ? `<div class='card-hero'><div class='progress'>Today's focus</div><h2>${esc(current.fields.instrument || 'No instrument')}</h2><p class='sub'>${esc(current.fields.session || 'No session')} · ${esc(current.fields.date || 'No date')}</p><div class='status-row'>${biasPill(current.fields.bias)}${statusPill(current)}${outcomePill(current.outcome)}</div><div class='hero-actions'><button class='btn primary' data-open-card='${esc(current.id)}'>Open focus card</button><button class='btn ghost' id='continuePlanBtn'>Continue plan</button></div></div>` : `<div class='card-hero'><div class='progress'>Today's focus</div><h2>Build first plan</h2><p class='sub'>Start with one instrument, one bias thesis, mapped liquidity and review notes.</p><div class='hero-actions'><button class='btn primary' id='startHeroBtn'>Start new analysis</button><button class='btn ghost' data-route='saved'>Saved cards</button></div></div>`;
    return `<section class='screen'>${pageHead('Market focus', 'ICT Sweep Tracker', 'Educational tool. Not financial advice.', '')}<div class='field'><label class='label' for='homePrompt'>Planning prompt</label><input class='in' id='homePrompt' placeholder='What are you planning today?'></div><div class='card'><div class='progress'>Plan assistant</div><h3>Bias-led liquidity plan</h3><p class='sub'>Structure observations. No forecasts or trade signals.</p><div class='hero-actions'><button class='btn primary' id='startPlanBtn'>Start new analysis</button><button class='btn' data-route='liquidity-map'>Liquidity map</button><button class='btn' data-route='risk'>Risk review</button></div></div><div class='row-actions' aria-label='Session filter'>${chips}</div>${homeSession !== 'All' ? `<p class='hint'>Showing ${esc(homeSession)} cards and metrics.</p>` : ''}${hero}<h3>Review metrics</h3>${metricHtml(homeCards)}<div class='card'><div class='progress'>Watchlist</div><h3>${settings.watchlist.length ? settings.watchlist.map(esc).join(' · ') : 'No watchlist set'}</h3><p class='sub'>Edit defaults in Profile.</p></div></section>`;
  }

  function planner(){
    const c = comp(f);
    const instrumentInput = `<label class='label' for='instrument'>Instrument</label><input class='in' id='instrument' list='inst' value='${esc(f.instrument)}' placeholder='Select or type instrument'><datalist id='inst'>${instruments.map(x => `<option value='${esc(x)}'>`).join('')}</datalist>`;
    const status = raw('Status', c.ok ? pill('Complete', 'ok') : pill('Draft', 'warn'));
    const draftMessage = lastDraftState || (plannerHasInput(f, marketContextDraft, plannerCardId) ? 'Autosave ready. Planner changes are kept locally before you save a card.' : 'No active planner draft.');
    const validation = plannerValidationState(f, marketContextDraft, plannerCardId);
    const validationHtml = plannerValidationMode ? plannerValidationHtml(validation, plannerValidationMode) : '';
    return `<section class='screen'><div class='card'><div class='progress'>AI Trade Plan Builder</div><h2>Build a deterministic focus plan</h2><p class='sub'>This assistant formats your inputs only. It does not call external AI, forecast price or generate trade signals.</p></div><div class='card'><div class='grid'><div>${input('date', 'Date', '', 'date')}</div><div>${input('time', 'Time', '', 'time')}</div></div><div class='grid'><div>${instrumentInput}</div><div>${select('session', 'Session', sessions, 'Optional')}</div></div>${input('currentPrice', 'Current price / tool-entry price', 'manual price at entry')}<label class='check-row'><input type='checkbox' id='manualPriceNeededAck' ${manualPriceNeededAck ? 'checked' : ''}> <span>Manual price needed before generation</span></label><div class='row-actions'><button class='btn' id='autoPriceBtn'>${icon('sync')}Auto-detect price</button>${priceCountdownHtml()}</div>${priceStatusHtml()}<p class='hint'>Price source: ${esc(priceSourceLabel())}</p><p class='hint'>Auto-detect uses the configured yfinance price API when available. Local development can also use the helper at 127.0.0.1:8765.</p>${priceValidationHtml(f)}<label class='label'>Bias Determination For Session</label><div class='segmented' role='group' aria-label='Bias Determination For Session'>${biasOptions.map(b => `<button class='segmented-option' data-bias='${b}' aria-pressed='${f.bias === b ? 'true' : 'false'}'>${esc(b)}</button>`).join('')}</div><p class='hint'>Session bias is a planning label for the selected session only. Before 10:30am NY, full-day prediction is not supported by this tool.</p></div><div class='card'><div class='progress'>Price Map</div><h3>Liquidity ladder</h3><div id='priceMapPreview'>${priceMapHtml(f)}</div></div><div class='card'><div class='progress'>Market Context</div><h3>Phase map by timeframe</h3><p class='sub'>Record observed context only. Potential next phase is a conservative planning note, not a trade signal or forecast.</p>${marketContextPlanner(marketContextDraft)}</div><div class='card'><div class='progress'>Draw on liquidity stack</div><h3>Up to three DOL records</h3>${row('dol', 1, 'DOL', 'Draw rationale / liquidity draw')}${row('dol', 2, 'DOL', 'Draw rationale / liquidity draw')}${row('dol', 3, 'DOL', 'Draw rationale / liquidity draw')}</div><div class='card'><div class='progress'>Potential sweep stack</div><h3>Up to three sweep records</h3>${row('sweep', 1, 'Sweep', 'Potential sweep liquidity')}${row('sweep', 2, 'Sweep', 'Potential sweep liquidity')}${row('sweep', 3, 'Sweep', 'Potential sweep liquidity')}<div class='panel'><h3>FVG Formation</h3><label class='check-row'><input type='checkbox' id='fvg' ${f.fvg ? 'checked' : ''}> <span>FVG formed after sweep</span></label>${selectDisabled('fvgTf', 'FVG timeframe', tfs, '- FVG timeframe -', !f.fvg)}</div></div><div class='card'><div class='progress'>Generated preview</div><div class='focus-output' id='plannerPreview'>${summary(f, marketContextDraft)}${status}</div></div><div id='plannerValidation'>${validationHtml}</div><div class='panel draft-state'><div><strong>Draft state</strong><p class='hint' id='draftState'>${esc(draftMessage)}</p></div><button class='btn ghost' id='discardDraftBtn'>Discard draft</button></div><div aria-hidden='true' style='height:96px'></div><div class='sticky-cta' id='plannerActions' style='bottom:var(--bottom-nav-height)' tabindex='-1'><div class='inner'><button class='btn ghost' id='saveDraftBtn'>${icon('save')}Save Draft</button><button class='btn primary' id='nextBtn'>Generate Focus Plan</button></div></div></section>`;
  }

  function saved(){
    const query = savedSearch.toLowerCase();
    const filtered = sortedCards().filter(c => {
      const hay = [c.fields.instrument, c.fields.session, c.fields.bias, marketContextText(c.marketContext), stack(c.fields, 'dol', 'Liquidity draw'), stack(c.fields, 'sweep', 'Sweep liquidity'), c.notes].join(' ').toLowerCase();
      const matchesSearch = !query || hay.includes(query);
      const matchesFilter = savedFilter === 'All' ||
        (savedFilter === 'Final Saved' && c.finalSaved) ||
        (savedFilter === 'Drafts' && !c.finalSaved) ||
        (savedFilter === 'Hits' && c.outcome === 'Hit') ||
        (savedFilter === 'Misses' && c.outcome === 'Miss') ||
        (savedFilter === 'Favorites' && c.favorite);
      return matchesSearch && matchesFilter;
    });
    const filters = ['All','Final Saved','Drafts','Hits','Misses','Favorites'].map(v => `<button class='chip ${savedFilter === v ? 'chip-active' : ''}' data-saved-filter='${esc(v)}' aria-pressed='${savedFilter === v ? 'true' : 'false'}'>${esc(v)}</button>`).join('');
    const list = filtered.length ? filtered.map(c => `<div class='card'><div class='saved-head'><button class='saved-row' data-open-card='${esc(c.id)}'><span class='saved-title'>${esc(c.fields.instrument || 'No instrument')}<small>${esc(c.fields.session || 'No session')} · ${esc(c.fields.date || new Date(c.savedAt).toLocaleDateString())}</small></span></button><button class='btn btn-icon ghost' data-favorite='${esc(c.id)}' aria-label='Toggle favorite'>${icon(c.favorite ? 'star' : 'star_border')}</button></div><div class='status-row'>${biasPill(c.fields.bias)}${statusPill(c)}${outcomePill(c.outcome)}${pill((comp(c.fields).dol.done || 0) + ' DOL', 'info')}${pill((comp(c.fields).sweep.done || 0) + ' sweep', 'info')}${pill(c.fields.fvg || c.markers.fvgFormed ? 'FVG noted' : 'No FVG', c.fields.fvg || c.markers.fvgFormed ? 'ok' : '')}</div><p class='saved-preview'>${esc(stack(c.fields, 'dol', 'Liquidity draw') || 'No DOL added')}</p></div>`).join('') : `<div class='panel'><h3>No saved focus cards</h3><p class='hint'>Build a plan or adjust the current search and filter.</p></div>`;
    return `<section class='screen'>${pageHead('Saved focus cards', 'Saved Cards', 'Search, filter and open local focus cards.', '')}<div class='field'><label class='label' for='savedSearch'>Search cards</label><input class='in' id='savedSearch' value='${esc(savedSearch)}' placeholder='Instrument, session, bias, liquidity or notes'></div><div class='row-actions'>${filters}</div>${metricHtml()}<div class='row-actions'><button class='btn' id='verifyBtn'>Verify data</button><button class='btn' id='exportTextBtn'>Export text</button><button class='btn' id='exportJsonBtn'>Export JSON</button><button class='btn' id='importJsonBtn'>Import JSON</button><input class='file-input' id='importFile' type='file' accept='application/json,.json'></div>${list}</section>`;
  }

  function check(i, l, v){
    return `<label class='check-row'><input type='checkbox' id='${i}' ${v ? 'checked' : ''}> <span>${esc(l)}</span></label>`;
  }

  function focusCard(){
    const c = cards.find(x => x.id === reviewId) || latestCard();
    if(!c) return `<section class='screen'>${pageHead('Focus card', 'No Card Selected', 'Open a saved card or build a new plan.', 'saved')}<div class='panel'><p class='hint'>No local focus card is available.</p></div></section>`;
    reviewId = c.id;
    const status = cardStatus(c);
    const activeOptions = dolIds.map(id => {
      const has = c.fields[id + 'Level'] || c.fields[id + 'Draw'];
      return has ? `<option value='${id}'${c.activeDolId === id ? ' selected' : ''}>${esc(dolLabel(c.fields, id))}</option>` : '';
    }).join('');
    const latest = (c.priceHistory || []).slice(-1)[0] || c.priceSnapshot || {};
    const mapSource = (latest && latest.source) || (c.priceSnapshot && c.priceSnapshot.source) || 'manual';
    return `<section class='screen focus-detail'>${pageHead('Focus card details', c.fields.instrument || 'No instrument', c.fields.session || 'No session', 'saved')}<div class='card-hero'><div class='progress'>${esc(c.fields.date || 'No date')}</div><h2>${esc(c.fields.instrument || 'No instrument')}</h2><p class='sub'>${esc(c.fields.session || 'No session')} · ${esc(c.fields.bias || 'No bias selected')}</p><div class='status-row'>${biasPill(c.fields.bias)}${c.finalSaved ? pill('Final saved', 'info') : pill(status === 'complete' ? 'Complete draft' : 'Draft', status === 'complete' ? 'ok' : 'warn')}${outcomePill(c.outcome)}</div><p class='hint'>Session bias only. Educational tool. Not financial advice.</p></div>${auditStripHtml(c)}<div class='focus-grid'><div><div class='card'><div class='progress'>Price Map Dashboard</div>${priceValidationHtml(c.fields)}${priceMapHtml(c.fields, {updatedAt: c.updatedAt, source: mapSource, editable: true})}</div><div class='card'><div class='progress'>Focus DOL</div><label class='label' for='activeDol'>Active draw on liquidity</label><select class='in' id='activeDol'><option value=''>- active DOL -</option>${activeOptions}</select>${activeDolHtml(c)}</div><div class='card'><div class='progress'>Potential risk-to-reward</div>${riskPlanHtml(c)}</div><div class='card'><div class='progress'>Route to DOL / PD array evidence</div>${routeEvidenceHtml(c)}</div></div><div><div class='card snapshot-section'>${priceSnapshotCardHtml(c)}${priceOverrideHtml(c)}${priceHistoryHtml(c)}</div><div class='card'><div class='progress'>Market Context</div>${marketContextRows(c.marketContext)}</div><div class='card'><div class='progress'>DOL stack</div>${stackRows(c.fields, 'dol', 'DOL')}</div><div class='card'><div class='progress'>Potential sweep stack</div>${stackRows(c.fields, 'sweep', 'Sweep')}</div><div class='card'><div class='progress'>FVG</div>${fvgReviewHtml(c)}</div><div class='card'><h3>Trade highlights</h3><div class='review-grid'>${check('mark_dolRespected', 'DOL respected', c.markers.dolRespected)}${check('mark_sweepConfirmed', 'LTF sweep confirmed', c.markers.sweepConfirmed)}${check('mark_fvgFormed', 'FVG formed after sweep', c.markers.fvgFormed)}${check('mark_planFollowed', 'Plan followed', c.markers.planFollowed)}</div><label class='label' for='reviewOutcome'>Outcome</label><select class='in' id='reviewOutcome'>${options(outcomes, c.outcome, '- outcome -')}</select><label class='label' for='reviewNotes'>Review notes</label><textarea class='in' id='reviewNotes' placeholder='Add review notes'>${esc(c.notes)}</textarea><div class='grid'><div><label class='label' for='riskPct'>Planned risk %</label><input class='in' id='riskPct' value='${esc(c.risk.plannedRiskPct)}' placeholder='0.5'></div><div><label class='label' for='plannedR'>Planned R</label><input class='in' id='plannedR' value='${esc(c.risk.plannedR)}' placeholder='2R'></div></div><label class='label' for='maxLoss'>Max loss</label><input class='in' id='maxLoss' value='${esc(c.risk.maxLoss)}' placeholder='Optional amount'></div></div></div><div class='row-actions'><button class='btn' id='loadBtn'>Load to planner</button><button class='btn' data-route='timeline'>Timeline</button><button class='btn' id='copyBtn'>Copy</button><button class='btn' id='shareBtn'>Share</button><button class='btn' id='saveChangesBtn'>Save changes</button><button class='btn good' id='finalSaveBtn'>Final save</button><button class='btn danger' id='deleteBtn'>Delete</button></div></section>`;

  }

  function timeline(){
    const c = cards.find(x => x.id === reviewId) || latestCard();
    const items = c ? [
      ['Before session', 'Pre-session prep', !!(c.fields.instrument && c.fields.session)],
      ['Before session', 'Session bias', !!c.fields.bias],
      ['Before session', 'Market context', !!marketContextText(c.marketContext)],
      ['During session', 'Liquidity draw', comp(c.fields).dol.done > 0],
      ['During session', 'Potential sweep', comp(c.fields).sweep.done > 0],
      ['During session', 'Confirmation / FVG check', !!(c.markers.sweepConfirmed || c.markers.fvgFormed || c.fields.fvg)],
      ['After trade', 'Outcome review', c.outcome !== 'Open' || c.finalSaved]
    ] : [];
    const nodes = items.length ? items.map((it, idx) => `<div class='timeline-node ${it[2] ? 'complete' : idx === items.findIndex(x => !x[2]) ? 'live' : 'pending'}'><div class='progress'>${esc(it[0])}</div><h3>${esc(it[1])}</h3><p class='sub'>${it[2] ? 'Completed from saved card data.' : 'Pending review.'}</p></div>`).join('') : `<div class='panel'><p class='hint'>No active card timeline yet.</p></div>`;
    return `<section class='screen'>${pageHead('Execution timeline', c ? c.fields.instrument || 'Focus card' : 'No card selected', 'Read-only checklist derived from the current focus card.', 'saved')}<div class='timeline'>${nodes}</div>${c ? `<div class='card'><label class='label' for='timelineNote'>Add note</label><textarea class='in' id='timelineNote'>${esc(c.notes)}</textarea><button class='btn primary' id='timelineNoteBtn'>Save note</button></div>` : ''}</section>`;
  }

  function liquidityMap(){
    const cats = ['All','DOL','Sweep','FVG','Bias','Killzone'].map(v => `<button class='chip ${liquidityFilter === v ? 'chip-active' : ''}' data-liquidity-filter='${esc(v)}' aria-pressed='${liquidityFilter === v ? 'true' : 'false'}'>${esc(v)}</button>`).join('');
    const q = liquiditySearch.toLowerCase();
    const list = conceptLibrary.filter(c => (liquidityFilter === 'All' || c.cat === liquidityFilter) && (!q || (c.name + ' ' + c.text + ' ' + c.cat).toLowerCase().includes(q))).map((c, i) => `<div class='card'><div class='progress'>${esc(c.cat)}</div><h3>${esc(c.name)}</h3><p class='sub'>${esc(c.text)}</p><button class='btn primary' data-add-concept='${i}'>Add to plan</button></div>`).join('') || `<div class='panel'><p class='hint'>No concepts match the current filters.</p></div>`;
    return `<section class='screen'>${pageHead('Liquidity map', 'Setup Library', 'Add educational concepts into the current draft plan.', 'home')}<div class='field'><label class='label' for='liquiditySearch'>Search concepts</label><input class='in' id='liquiditySearch' value='${esc(liquiditySearch)}' placeholder='PDH, sweep, FVG, killzone'></div><div class='row-actions'>${cats}</div>${list}</section>`;
  }

  function risk(){
    const m = getMetrics(cards);
    const final = cards.filter(c => c.finalSaved);
    const pct = key => final.length ? Math.round(final.filter(c => c.markers[key]).length / final.length * 100) : 0;
    const bar = (label, value) => `<div class='panel'><div class='btn-row-between'><strong>${esc(label)}</strong><span>${value}%</span></div><div style='height:10px;background:var(--surface-line);border-radius:var(--radius-pill);overflow:hidden'><div style='width:${value}%;height:100%;background:var(--primary)'></div></div></div>`;
    return `<section class='screen'>${pageHead('Risk tracker', 'Review Quality', 'Statistics come only from final-saved local cards.', 'home')}<div class='card-hero'><div class='progress'>Planned risk</div><h2>${esc(getSettings().riskDefaults.plannedRiskPct || 'Not set')}</h2><p class='sub'>Default risk fields can be edited from Profile. This is review tracking, not a forecast.</p></div>${metricHtml()}${bar('Bias quality', pct('biasValidated'))}${bar('DOL quality', pct('dolRespected'))}${bar('Sweep quality', pct('sweepConfirmed'))}${bar('FVG confirmation', pct('fvgFormed'))}${bar('Plan followed', pct('planFollowed'))}${!cards.length ? `<div class='panel'><p class='hint'>No review data yet.</p></div>` : ''}</section>`;
  }

  function componentGallery(){
    const sampleFields = normFields({
      instrument: 'MNQ',
      currentPrice: '20000',
      dol1Level: '20250',
      dol1Draw: 'Previous day high (PDH)',
      dol1Tf: 'Daily',
      sweep1Level: '19850',
      sweep1Draw: 'Asia low',
      sweep1Tf: '15m'
    });
    return `<section class='screen'>${pageHead('Design system', 'Component Gallery', 'Internal preview for reusable UI states.', 'profile')}<div class='card'><h3>Buttons</h3><div class='row-actions'><button class='btn primary'>Primary</button><button class='btn'>Default</button><button class='btn ghost'>Ghost</button><button class='btn good'>Success</button><button class='btn danger'>Danger</button><button class='btn btn-icon ghost' aria-label='Icon button'>${icon('star')}</button></div></div><div class='card'><h3>Chips and pills</h3><div class='status-row'><button class='chip chip-active'>Active chip</button><button class='chip'>Neutral chip</button>${pill('Complete', 'ok')}${pill('Draft', 'warn')}${pill('Final saved', 'info')}${pill('Miss', 'bad')}</div></div><div class='card'><h3>Form controls</h3><div class='grid'><div><label class='label' for='galleryInput'>Input</label><input class='in' id='galleryInput' value='MNQ'></div><div><label class='label' for='gallerySelect'>Select</label><select class='in' id='gallerySelect'><option>New York AM</option></select></div></div><label class='check-row'><input type='checkbox' checked> <span>Checked state</span></label></div><div class='card'><h3>Cards and empty states</h3><div class='panel'><p class='hint'>Panel / empty state copy remains compact and instructional.</p></div></div><div class='card-dashed card'><div class='progress'>Dashed card</div><h3>Screenshot placeholder</h3><p class='sub'>Local-only metadata state.</p></div><div class='card'><h3>Timeline nodes</h3><div class='timeline'><div class='timeline-node complete'><div class='progress'>Complete</div><h3>Bias mapped</h3><p class='sub'>Completed state.</p></div><div class='timeline-node live'><div class='progress'>Live</div><h3>Sweep watch</h3><p class='sub'>Current state.</p></div><div class='timeline-node pending'><div class='progress'>Pending</div><h3>Outcome review</h3><p class='sub'>Pending state.</p></div></div></div><div class='card'><h3>Price map states</h3>${priceMapHtml(sampleFields)}<div class='price-map price-map-empty'><p>No numeric current price yet.</p></div><div class='price-map price-map-loading'><p>Loading price update...</p></div><div class='price-map price-map-error'><p>Price helper unavailable.</p></div></div></section>`;
  }

  function supabasePanelHtml(){
    const configured = !!getSupabaseClient();
    const queue = getSyncQueue();
    const pending = syncQueueCount(queue);
    const serverCount = syncState.remoteCardCount == null ? '-' : String(syncState.remoteCardCount);
    const statusLabel = backupStatusLabel();
    const statusClass = statusLabel === 'Backed up' ? 'good' : statusLabel === 'Backup error' ? 'bad' : 'warn';
    const firstSyncActions = supabaseUser && syncState.firstSyncPaused
      ? `<div class='panel'><h3>Add existing cards to backup?</h3><p class='hint'>This browser has existing cards. Add them to cloud backup?</p><div class='row-actions'><button class='btn primary' id='approveFirstSyncBtn'>Back up local cards</button><button class='btn ghost' id='skipFirstSyncBtn'>Keep on this device</button></div></div>`
      : '';
    const login = supabaseUser
      ? `<p class='hint good'>Signed in.</p>${firstSyncActions}<div class='row-actions'><button class='btn' id='syncNowBtn'>Back up now</button><button class='btn ghost' id='supabaseLogoutBtn'>Sign out</button></div>`
      : configured
        ? `<label class='label' for='adminPin'>4-digit PIN</label><input class='in' id='adminPin' type='password' inputmode='numeric' pattern='[0-9]*' maxlength='4' autocomplete='current-password' placeholder='PIN' aria-label='4-digit PIN'><p class='hint'>Enter the 4-digit PIN for this backup.</p><div class='row-actions'><button class='btn primary' id='adminLoginBtn'>Sign in</button></div>`
        : `<p class='hint warn'>Cloud backup is unavailable in this build. Local cards still work on this device.</p>`;
    return `<div class='card'><div class='progress'>Account</div><h3>Account & Backup</h3><p class='hint ${statusClass}'>${esc(statusLabel)}: ${esc(backupStatusMessage())}</p><div class='line'><div class='k'>Local cards</div><div class='v'>${cards.length}</div></div><div class='line'><div class='k'>Cloud backup</div><div class='v'>${pending ? 'Pending' : serverCount}</div></div><div class='line'><div class='k'>Last backup</div><div class='v'>${esc(syncState.lastSyncAt || '-')}</div></div>${login}</div>`;
  }

  function profile(){
    const settings = getSettings();
    const m = getMetrics(cards);
    const recent = latestCard();
    return `<section class='screen'>${pageHead('Trader profile', 'Profile', 'Local settings, account backup and portable data tools.', '')}${supabasePanelHtml()}<div class='card'><h3>Local summary</h3>${line('Saved cards', m.total)}${line('Final saved', m.finalSaved)}${line('Favorites', m.favorites)}${line('Recent plan', recent ? (recent.fields.instrument || 'No instrument') : '')}</div><div class='card'><h3>Settings</h3><label class='label' for='defaultInstrument'>Default instrument</label><input class='in' id='defaultInstrument' value='${esc(settings.defaultInstrument)}' placeholder='MNQ'><label class='label' for='defaultSession'>Default session</label><select class='in' id='defaultSession'>${options(sessions, settings.defaultSession, 'No default')}</select><label class='label' for='themeMode'>Theme</label><select class='in' id='themeMode'><option value='light'${settings.theme === 'light' ? ' selected' : ''}>Light mode</option><option value='dark'${settings.theme === 'dark' ? ' selected' : ''}>Dark mode</option></select><label class='label' for='watchlist'>Watchlist</label><input class='in' id='watchlist' value='${esc(settings.watchlist.join(', '))}' placeholder='MNQ, ES, GC'><div class='grid'><div><label class='label' for='defaultRiskPct'>Default risk %</label><input class='in' id='defaultRiskPct' value='${esc(settings.riskDefaults.plannedRiskPct)}'></div><div><label class='label' for='defaultPlannedR'>Default planned R</label><input class='in' id='defaultPlannedR' value='${esc(settings.riskDefaults.plannedR)}'></div></div><label class='label' for='defaultMaxLoss'>Default max loss</label><input class='in' id='defaultMaxLoss' value='${esc(settings.riskDefaults.maxLoss)}'><button class='btn primary' id='saveSettingsBtn'>Save settings</button></div><div class='card'><h3>Data tools</h3><p class='hint'>Export JSON regularly before clearing browser data, changing devices or testing beta builds. Clearing this device does not delete cloud backup.</p><div class='row-actions'><button class='btn primary' id='exportJsonBtn'>Export data</button><button class='btn' id='importJsonBtn'>Import data</button><a class='btn' id='feedbackLink' href='https://github.com/JGDev1215/ICT/issues/new' target='_blank' rel='noopener'>Beta feedback</a><button class='btn' data-route='component-gallery'>Component gallery</button><button class='btn danger' id='clearDataBtn'>Clear this device data</button><input class='file-input' id='importFile' type='file' accept='application/json,.json'></div></div></section>`;
  }

  function sync(){
    if(!doc) return;
    for(const k of Object.keys(f)){
      const n = doc.getElementById(k);
      if(n) f[k] = n.type === 'checkbox' ? n.checked : (isPriceField(k) ? clean(n.value) : asText(n.value));
    }
    const priceAck = doc.getElementById('manualPriceNeededAck');
    if(priceAck) manualPriceNeededAck = !!priceAck.checked;
    f.manualPriceNeededAck = manualPriceNeededAck;
    if(!f.fvg) f.fvgTf = '';
    marketTimeframes.forEach(tf => {
      const key = marketPhaseKeys[tf];
      const phase = doc.getElementById('ctx_' + key + '_phase');
      const next = doc.getElementById('ctx_' + key + '_next');
      const note = doc.getElementById('ctx_' + key + '_note');
      if(phase || next || note){
        const phaseValue = phaseOptions.includes(phase && phase.value) ? phase.value : '';
        const nextValue = phaseOptions.includes(next && next.value) ? next.value : derivePotentialPhase(phaseValue);
        marketContextDraft[tf] = {
          phase: phaseValue,
          note: note ? asText(note.value) : '',
          potentialNextPhase: nextValue
        };
      }
    });
    marketContextDraft = normMarketContext(marketContextDraft);
    if(plannerDraftDiscarded && !plannerHasOnlyDefaultPrefill()) plannerDraftDiscarded = false;
    persistPlannerDraft();
    const draftState = doc.getElementById('draftState');
    if(draftState) draftState.textContent = lastDraftState || 'Autosave ready.';
  }

  function plannerHasOnlyDefaultPrefill(){
    if(plannerCardId || marketContextText(marketContextDraft)) return false;
    const settings = getSettings();
    const baseDate = today();
    return Object.keys(f).every(k => {
      const value = f[k];
      if(k === 'date') return !value || value === baseDate;
      if(k === 'instrument') return value === (settings.defaultInstrument || '');
      if(k === 'session') return value === (settings.defaultSession || '');
      if(typeof value === 'boolean') return value === false;
      return !value;
    }) && !manualPriceNeededAck;
  }

  function savePlanner(openDetails){
    sync();
    const validation = plannerValidationState(f, marketContextDraft, plannerCardId);
    if(openDetails ? !validation.canGenerateFocusPlan : !validation.canSaveDraft){
      plannerValidationMode = openDetails ? 'generate' : 'draft';
      setNotice(openDetails ? 'Complete the required planner fields before generating.' : 'Add planning input before saving a draft.', 'warn');
      render();
      return;
    }
    plannerValidationMode = '';
    let c;
    if(plannerCardId && cards.find(x => x.id === plannerCardId)){
      c = updateCard(plannerCardId, {fields: f, marketContext: marketContextDraft, finalSaved: false, priceSource: lastPriceSource, priceHistoryEvent: 'saved-edit'});
    } else {
      c = createBlankDraft({fields: f, marketContext: marketContextDraft, priceSource: lastPriceSource});
      const saved = saveCards([c].concat(cards)).find(card => card.id === c.id);
      if(!saved){
        setNotice(lastStorageError || 'Draft could not be saved.', 'bad');
        render();
        return;
      }
      c = saved;
      plannerCardId = c.id;
    }
    if(lastStorageError || !c){
      setNotice(lastStorageError || 'Draft could not be saved.', 'bad');
      render();
      return;
    }
    reviewId = c.id;
    route = openDetails ? 'focus' : 'planner';
    setNotice(openDetails ? 'Focus plan saved.' : 'Draft saved.', 'good');
    persistPlannerDraft();
    writeRouteHash();
    render();
  }

  function text(c){
    return [
      'ICT DOL Sweep Card',
      'Instrument: ' + (c.fields.instrument || '-'),
      'Date: ' + (c.fields.date || '-'),
      'Time: ' + (c.fields.time || '-'),
      'Session: ' + (c.fields.session || '-'),
      'Current price: ' + (c.fields.currentPrice || '-'),
      'Price source: ' + priceSourceLabel(),
      'Created NY: ' + (c.createdAtNy || '-'),
      'Last edited NY: ' + (c.updatedAtNy || '-'),
      'Active DOL: ' + (c.activeDolId ? dolLabel(c.fields, c.activeDolId) : '-'),
      'Latest price snapshot: ' + ((c.priceSnapshot && c.priceSnapshot.price) || '-'),
      'Potential R:R: ' + ((c.riskPlan && c.riskPlan.rr) || '-'),
      'R:R status: ' + ((c.riskPlan && c.riskPlan.status) || '-'),
      'Route evidence: ' + ((c.routeEvidence || []).map(r => [r.arrayType, r.timeframe, r.level, r.behavior, r.notes].filter(Boolean).join(' | ')).join(' ; ') || '-'),
      'Bias Determination For Session: ' + (c.fields.bias || '-'),
      'Legacy bias validation: ' + (c.fields.biasValidation || '-'),
      'Legacy bias invalidation: ' + (c.fields.biasInvalidation || '-'),
      'Session bias warning: Before 10:30am NY, full-day prediction is not supported by this tool.',
      'Market Context: ' + (marketContextText(c.marketContext) || '-'),
      'DOL stack: ' + (stack(c.fields, 'dol', 'Liquidity draw') || '-'),
      'Sweep stack: ' + (stack(c.fields, 'sweep', 'Sweep liquidity') || '-'),
      'FVG: ' + (c.fields.fvg ? 'Confirmed ' + (c.fields.fvgTf || '') : 'Not confirmed'),
      'Outcome: ' + c.outcome,
      'Final saved: ' + (c.finalSaved ? 'Yes' : 'No'),
      'Favorite: ' + (c.favorite ? 'Yes' : 'No'),
      'Planned risk %: ' + (c.risk.plannedRiskPct || '-'),
      'Planned R: ' + (c.risk.plannedR || '-'),
      'Max loss: ' + (c.risk.maxLoss || '-'),
      'Notes: ' + (c.notes || '-')
    ].join(NL);
  }

  function down(name, body, type){
    const url = URL.createObjectURL(new Blob([body], {type: type || 'text/plain'}));
    const a = doc.createElement('a');
    a.href = url;
    a.download = name;
    doc.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bind(){
    if(!doc) return;
    doc.querySelectorAll('.numeric').forEach(n => {
      const tidy = () => n.value = clean(n.value);
      n.addEventListener('input', tidy);
      n.addEventListener('paste', () => setTimeout(tidy, 0));
    });

    const q = id => doc.getElementById(id);
    const on = (id, fn) => {
      const n = q(id);
      if(n) n.onclick = fn;
    };

    doc.querySelectorAll('.skip-link').forEach(n => {
      n.onclick = ev => {
        if(ev && ev.preventDefault) ev.preventDefault();
        const target = q('plannerActions');
        if(target){
          if(target.scrollIntoView) target.scrollIntoView({block: 'center'});
          target.focus();
        }
      };
    });

    doc.querySelectorAll('[data-route]').forEach(n => {
      n.onclick = () => go(n.getAttribute('data-route'));
    });

    doc.querySelectorAll('[data-session-chip]').forEach(n => {
      n.onclick = () => {
        setHomeSession(n.getAttribute('data-session-chip'));
      };
    });

    const newAnalysis = () => {
      if(plannerHasInput(f, marketContextDraft, plannerCardId) && !confirm('Start a new draft and replace the current planner inputs?')) return;
      go('planner', {new: true});
    };
    on('globalNewBtn', newAnalysis);
    on('globalNewDesktopBtn', newAnalysis);
    on('startPlanBtn', () => go('planner', {new: true}));
    on('startHeroBtn', () => go('planner', {new: true}));
    on('continuePlanBtn', () => {
      const c = latestCard();
      if(c){
        f = normFields(c.fields);
        marketContextDraft = normMarketContext(c.marketContext);
        marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft, []);
        plannerCardId = c.id;
      } else {
        startDraft();
      }
      persistPlannerDraft();
      go('planner');
    });

    doc.querySelectorAll('[data-mirror-taken]').forEach(n => {
      n.onchange = () => {
        const key = n.getAttribute('data-mirror-taken');
        const paired = q('focus_' + key);
        if(paired) paired.checked = n.checked;
      };
    });
    doc.querySelectorAll('[id^="focus_dol"][id$="Taken"]').forEach(n => {
      n.onchange = () => {
        const key = n.id.replace(/^focus_/, '');
        const paired = q('priceMap_' + key);
        if(paired) paired.checked = n.checked;
      };
    });
    on('saveDraftBtn', () => savePlanner(false));
    on('nextBtn', () => savePlanner(true));
    on('discardDraftBtn', () => {
      if(plannerHasInput(f, marketContextDraft, plannerCardId) && !confirm('Discard the current planner draft?')) return;
      discardPlannerDraft();
      setNotice('Planner draft discarded.', 'warn');
      render();
    });
    on('autoPriceBtn', () => {
      sync();
      const symbol = normalizePriceSymbol(f.instrument);
      f.instrument = symbol;
      if(!symbol){
        setNotice('Enter an instrument before auto-detecting price.', 'warn');
        render();
        return;
      }
      if(!validPriceSymbol(symbol)){
        priceFetchState = 'unsupported';
        setNotice('Unsupported symbol for auto-detect. Enter the price manually.', 'warn');
        render();
        return;
      }
      if(typeof fetch !== 'function'){
        priceFetchState = 'unavailable';
        setNotice('Auto-detect price needs browser fetch support.', 'warn');
        render();
        return;
      }
      priceFetchState = 'loading';
      announce(priceStatusMessage(), 'warn');
      render();
      fetchPrice(symbol)
        .then(data => {
          const payload = validatePricePayload(data);
          f.currentPrice = payload.price;
          f.time = f.time || nyTimeInput();
          priceFetchState = 'ok';
          lastPriceFetchAt = Date.now();
          lastPriceSource = data.helperUrl === localPriceHelperUrl(symbol) ? 'local-yfinance' : 'hosted-yfinance';
          manualPriceNeededAck = false;
          f.manualPriceNeededAck = false;
          const source = lastPriceSource === 'local-yfinance' ? 'local yfinance helper' : 'hosted yfinance API';
          setNotice('Price auto-detected from ' + source + '.', 'good');
          plannerValidationMode = '';
          render();
        })
        .catch(err => {
          const kind = priceErrorKind(err);
          priceFetchState = kind === 'unsupported' ? 'unsupported' : kind === 'malformed' ? 'malformed' : 'unavailable';
          setNotice(priceStatusMessage(), 'warn');
          render();
        });
    });

    const addMarketContextTf = q('marketContextAddTf');
    if(addMarketContextTf){
      addMarketContextTf.onchange = () => {
        sync();
        const tf = addMarketContextTf.value;
        if(marketTimeframes.includes(tf) && !marketContextOpenTimeframes.includes(tf)){
          marketContextOpenTimeframes.push(tf);
          marketContextOpenTimeframes = marketTimeframes.filter(x => marketContextOpenTimeframes.includes(x));
        }
        persistPlannerDraft();
        render();
      };
    }

    doc.querySelectorAll('[data-open-card]').forEach(n => {
      n.onclick = () => {
        go('focus', {id: n.getAttribute('data-open-card')});
      };
    });

    doc.querySelectorAll('[data-favorite]').forEach(n => {
      n.onclick = () => {
        const updated = toggleFavorite(n.getAttribute('data-favorite'));
        setNotice(updated ? 'Favorite updated.' : (lastStorageError || 'Favorite could not be updated.'), updated ? 'good' : 'bad');
        render();
      };
    });

    doc.querySelectorAll('[data-bias]').forEach(n => {
      n.onclick = () => {
        sync();
        f.bias = n.getAttribute('data-bias');
        render();
      };
    });

    const updatePlannerOutputs = () => {
      const preview = q('plannerPreview');
      if(preview) preview.innerHTML = summary(f, marketContextDraft) + raw('Status', comp(f).ok ? pill('Complete', 'ok') : pill('Draft', 'warn'));
      const map = q('priceMapPreview');
      if(map) map.innerHTML = priceMapHtml(f);
      const validation = q('plannerValidation');
      if(validation) validation.innerHTML = plannerValidationMode ? plannerValidationHtml(plannerValidationState(f, marketContextDraft, plannerCardId), plannerValidationMode) : '';
      const priceStatus = q('priceStatusMessage');
      if(priceStatus){
        priceStatus.textContent = priceStatusMessage();
        priceStatus.className = 'price-status ' + priceStatusClass();
      }
    };

    const plannerFields = Object.keys(f).map(id => q(id)).filter(Boolean);
    const manualPriceAck = q('manualPriceNeededAck');
    if(manualPriceAck && !plannerFields.includes(manualPriceAck)) plannerFields.push(manualPriceAck);
    plannerFields.forEach(n => {
      const ev = n.tagName === 'SELECT' || n.type === 'checkbox' ? 'change' : 'input';
      n.addEventListener(ev, () => {
        sync();
        if(n.id === 'currentPrice'){
          priceFetchState = '';
          lastPriceSource = 'manual';
          if(f.currentPrice){
            manualPriceNeededAck = false;
            f.manualPriceNeededAck = false;
            const ack = q('manualPriceNeededAck');
            if(ack) ack.checked = false;
          }
        }
        if(n.id === 'manualPriceNeededAck' && manualPriceNeededAck && f.currentPrice){
          manualPriceNeededAck = false;
          f.manualPriceNeededAck = false;
          n.checked = false;
        }
        if(n.id === 'fvg'){
          const fvgTf = q('fvgTf');
          if(fvgTf){
            fvgTf.disabled = !f.fvg;
            if(!f.fvg) fvgTf.value = '';
          }
        }
        updatePlannerOutputs();
        syncMarketContextOpenTimeframes(marketContextDraft);
      });
    });

    const contextFields = [];
    marketTimeframes.forEach(tf => {
      const key = marketPhaseKeys[tf];
      ['phase','next','note'].forEach(kind => {
        const node = q('ctx_' + key + '_' + kind);
        if(node) contextFields.push(node);
      });
    });
    contextFields.forEach(n => {
      const ev = n.tagName === 'SELECT' ? 'change' : 'input';
      n.addEventListener(ev, () => {
        sync();
        if(n.id.endsWith('_phase')){
          const key = n.id.replace('ctx_', '').replace('_phase', '');
          const next = q('ctx_' + key + '_next');
          if(next) next.value = derivePotentialPhase(n.value);
          sync();
        }
        updatePlannerOutputs();
      });
    });

    const savedSearchInput = q('savedSearch');
    if(savedSearchInput){
      savedSearchInput.oninput = () => {
        savedSearch = savedSearchInput.value;
        render();
      };
    }

    doc.querySelectorAll('[data-saved-filter]').forEach(n => {
      n.onclick = () => {
        savedFilter = n.getAttribute('data-saved-filter');
        render();
      };
    });

    const liquiditySearchInput = q('liquiditySearch');
    if(liquiditySearchInput){
      liquiditySearchInput.oninput = () => {
        liquiditySearch = liquiditySearchInput.value;
        render();
      };
    }

    doc.querySelectorAll('[data-liquidity-filter]').forEach(n => {
      n.onclick = () => {
        liquidityFilter = n.getAttribute('data-liquidity-filter');
        render();
      };
    });

    doc.querySelectorAll('[data-add-concept]').forEach(n => {
      n.onclick = () => {
        addConcept(Number(n.getAttribute('data-add-concept')));
      };
    });

    on('verifyBtn', () => {
      saveCards(cards);
      setNotice(lastStorageError || 'Saved data verified and normalised.', lastStorageError ? 'bad' : 'good');
      render();
    });
    on('exportTextBtn', () => down('ict-dol-sweep-cards.txt', cards.map(text).join(NL + NL + '---' + NL + NL) || 'No saved cards.', 'text/plain'));
    on('exportJsonBtn', () => down('ict-dol-sweep-cards.json', JSON.stringify(exportCards(), null, 2), 'application/json'));
    on('importJsonBtn', () => q('importFile') && q('importFile').click());

    const imp = q('importFile');
    if(imp){
      imp.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const result = importCards(String(reader.result || ''));
          const successParts = [];
          if(result.imported) successParts.push(result.imported + ' card(s) imported');
          if(result.settingsImported) successParts.push('settings imported');
          const message = result.error || result.warning || (successParts.length ? successParts.join(' and ') + '.' : 'No valid cards or settings found in the JSON file.');
          setNotice(message, result.error ? 'bad' : result.warning || !successParts.length ? 'warn' : 'good');
          render();
        };
        reader.onerror = () => {
          setNotice('Could not read the selected file. Try again or choose another file.', 'bad');
          render();
        };
        reader.readAsText(file);
      };
    }

    const cur = () => cards.find(c => c.id === reviewId);
    const focusFvg = q('focusFvg');
    if(focusFvg){
      focusFvg.onchange = () => {
        const fvgTf = q('focusFvgTf');
        if(fvgTf){
          fvgTf.disabled = !focusFvg.checked;
          if(!focusFvg.checked) fvgTf.value = '';
        }
      };
    }
    function read(finalSave){
      const c = cur();
      if(!c) return;
      const outcome = q('reviewOutcome').value || 'Open';
      if(finalSave && outcome === 'Open'){
        setNotice('Choose a non-Open outcome before Final save.', 'warn');
        render();
        return;
      }
      const fieldsPatch = Object.assign({}, focusReviewFields(c, q));
      const focusPrice = q('focusCurrentPrice') ? clean(q('focusCurrentPrice').value) : c.fields.currentPrice;
      if(focusPrice !== c.fields.currentPrice) fieldsPatch.currentPrice = focusPrice;
      const activeDolId = normActiveDolId(q('activeDol') ? q('activeDol').value : c.activeDolId, Object.assign({}, c.fields, fieldsPatch));
      const routeRows = c.routeEvidence.slice();
      const routeRow = {
        arrayType: q('routeArrayType') ? q('routeArrayType').value : '',
        timeframe: q('routeTimeframe') ? q('routeTimeframe').value : '',
        level: q('routeLevel') ? q('routeLevel').value.trim() : '',
        behavior: q('routeBehavior') ? q('routeBehavior').value : '',
        notes: q('routeNotes') ? q('routeNotes').value.trim() : ''
      };
      if(routeRow.arrayType || routeRow.timeframe || routeRow.level || routeRow.behavior || routeRow.notes){
        const createdAt = isoNow();
        routeRows.push(Object.assign({id: uid(), createdAt, createdAtNy: nyTimestamp(createdAt)}, routeRow));
      }
      const riskPlan = {
        direction: q('riskDirection') ? q('riskDirection').value : c.riskPlan.direction,
        targetDolId: q('riskTargetDol') ? q('riskTargetDol').value : activeDolId,
        ratio: q('riskRatio') ? q('riskRatio').value : c.riskPlan.ratio,
        entryPrice: q('riskEntryPrice') ? q('riskEntryPrice').value : c.riskPlan.entryPrice,
        targetPrice: c.riskPlan.targetPrice,
        invalidationPrice: c.riskPlan.invalidationPrice
      };
      if(focusPrice !== c.fields.currentPrice && (!riskPlan.entryPrice || clean(riskPlan.entryPrice) === clean(c.fields.currentPrice))){
        riskPlan.entryPrice = focusPrice;
      }
      const saved = updateCard(c.id, {
        fields: fieldsPatch,
        activeDolId,
        routeEvidence: routeRows,
        riskPlan,
        markers: {
          biasValidated: q('mark_biasValidated') ? !!q('mark_biasValidated').checked : !!c.markers.biasValidated,
          biasInvalidated: q('mark_biasInvalidated') ? !!q('mark_biasInvalidated').checked : !!c.markers.biasInvalidated,
          dolRespected: !!q('mark_dolRespected').checked,
          sweepConfirmed: !!q('mark_sweepConfirmed').checked,
          fvgFormed: q('focusFvg') ? !!q('focusFvg').checked : !!q('mark_fvgFormed').checked,
          planFollowed: !!q('mark_planFollowed').checked
        },
        outcome,
        notes: q('reviewNotes').value.trim(),
        finalSaved: !!(finalSave && finalOutcomes.includes(outcome)),
        priceSource: focusPrice !== c.fields.currentPrice ? 'manual' : (c.priceSnapshot.source || 'manual'),
        priceHistoryEvent: finalSave ? 'final-save' : 'saved-edit',
        journal: c.journal,
        risk: {
          plannedRiskPct: q('riskPct') ? q('riskPct').value.trim() : c.risk.plannedRiskPct,
          plannedR: q('plannedR') ? q('plannedR').value.trim() : c.risk.plannedR,
          maxLoss: q('maxLoss') ? q('maxLoss').value.trim() : c.risk.maxLoss
        }
      });
      if(!saved){
        setNotice(lastStorageError || 'Changes could not be saved.', 'bad');
        render();
        return;
      }
      setNotice(finalSave ? 'Final saved.' : 'Changes saved. Card is no longer final-saved.', 'good');
      render();
    }

    on('saveChangesBtn', () => cur() && read(false));
    on('finalSaveBtn', () => cur() && read(true));
    on('copyBtn', () => {
      const c = cur();
      const t = c && text(c);
      if(!t) return;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => {
        setNotice('Card copied.', 'good');
        render();
      }).catch(() => {
        const box = doc.createElement('textarea');
        box.value = t;
        doc.body.appendChild(box);
        box.select();
        doc.execCommand('copy');
        box.remove();
        setNotice('Card copied.', 'good');
        render();
      });
    });
    on('shareBtn', () => {
      const c = cur();
      const t = c && text(c);
      if(!t) return;
      if(navigator.share){
        navigator.share({title: 'ICT DOL Sweep Card', text: t}).then(() => {
          setNotice('Share sheet opened.', 'good');
          render();
        }).catch(() => {});
      } else if(navigator.clipboard) {
        navigator.clipboard.writeText(t).then(() => {
          setNotice('Share text copied.', 'good');
          render();
        });
      }
    });
    on('loadBtn', () => {
      const c = cur();
      if(c){
        f = normFields(c.fields);
        marketContextDraft = normMarketContext(c.marketContext);
        marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft, []);
        plannerCardId = c.id;
        step = 0;
        persistPlannerDraft();
        go('planner');
      }
    });
    on('deleteBtn', () => {
      const c = cur();
      if(c && confirm('Delete this saved card?')){
        if(!deleteCard(c.id)){
          setNotice(lastStorageError || 'Card could not be deleted.', 'bad');
          render();
          return;
        }
        reviewId = '';
        setNotice('Card deleted.', 'good');
        go('saved');
      }
    });

    on('timelineNoteBtn', () => {
      const c = cards.find(x => x.id === reviewId) || latestCard();
      if(c && q('timelineNote')){
        const saved = updateCard(c.id, {notes: q('timelineNote').value.trim(), finalSaved: false, priceHistoryEvent: false});
        setNotice(saved ? 'Timeline note saved.' : (lastStorageError || 'Timeline note could not be saved.'), saved ? 'good' : 'bad');
        render();
      }
    });

    on('saveSettingsBtn', () => {
      saveSettings(profileFormSettings(q));
      setNotice(lastSettingsError || 'Settings saved.', lastSettingsError ? 'bad' : 'good');
      render();
    });
    on('adminLoginBtn', () => {
      const pin = q('adminPin') ? q('adminPin').value.trim() : '';
      if(!/^\d{4}$/.test(pin)){
        setNotice('Enter the 4-digit PIN.', 'warn');
        render();
        return;
      }
      supabaseLogin(adminSupabaseEmail(), pin).then(ok => {
        setNotice(ok ? 'Signed in. Backup is ready.' : syncState.message, ok ? 'good' : 'bad');
        render();
      });
    });
    on('supabaseLogoutBtn', () => {
      supabaseLogout().then(() => {
        setNotice('Signed out.', 'good');
        render();
      });
    });
    on('approveFirstSyncBtn', () => {
      approveFirstSyncUpload().then(ok => {
        setNotice(ok ? 'Local cards added to cloud backup.' : syncState.message, ok ? 'good' : 'bad');
        render();
      });
    });
    on('skipFirstSyncBtn', () => {
      skipFirstSyncUpload().then(ok => {
        setNotice(ok ? 'Existing local cards will stay on this device.' : syncState.message, ok ? 'good' : 'bad');
        render();
      });
    });
    on('syncNowBtn', () => {
      syncFromSupabase({force: true}).then(ok => {
        setNotice(ok ? 'Backup complete.' : syncState.message, ok ? 'good' : 'bad');
        render();
      });
    });

    const themeMode = q('themeMode');
    if(themeMode){
      themeMode.onchange = () => {
        saveSettings(profileFormSettings(q, themeMode.value));
        setNotice(lastSettingsError || 'Theme updated.', lastSettingsError ? 'bad' : 'good');
        render();
      };
    }

    on('clearDataBtn', () => {
      if(confirm('Clear cards, settings, planner drafts, local backup session and pending sync data on this device only? Cloud backup is not deleted and may return after signing in again.')){
        const clearMessage = 'This device data was cleared. Cloud backup is unchanged; sign in again to restore backed-up cards.';
        const signOut = clearDeviceData();
        setNotice(clearMessage, 'warn');
        go('home', {replace: true});
        if(signOut && signOut.then){
          signOut.then(() => {
            if(route === 'home'){
              setNotice(clearMessage, 'warn');
              render();
            }
          });
        }
      }
    });
  }

  function addConcept(idx){
    const item = conceptLibrary[idx];
    if(!item) return;
    if(!plannerHasInput(f, marketContextDraft, plannerCardId)) startDraft();
    if(item.cat === 'DOL'){
      const slot = [1,2,3].find(i => !f['dol' + i + 'Draw']) || 1;
      f['dol' + slot + 'Draw'] = item.name;
    } else if(item.cat === 'Sweep'){
      const slot = [1,2,3].find(i => !f['sweep' + i + 'Draw']) || 1;
      f['sweep' + slot + 'Draw'] = item.name;
    } else if(item.cat === 'FVG'){
      f.fvg = true;
      f.fvgTf = f.fvgTf || '5m';
    } else if(item.cat === 'Bias'){
      f.bias = item.name.indexOf('Bullish') === 0 ? 'Bullish' : 'Bearish';
    } else if(item.cat === 'Killzone'){
      f.session = 'New York AM';
    }
    setNotice(item.name + ' added to draft.', 'good');
    persistPlannerDraft();
    go('planner');
  }

  function go(next, params){
    if(route === 'planner') sync();
    const target = normaliseRoute(next || 'home');
    if(params && params.id) reviewId = params.id;
    if(target === 'planner'){
      if(params && params.new) startDraft();
      else ensurePlannerDraft();
    }
    route = target;
    writeRouteHash(params && params.replace);
    render();
  }

  function render(){
    if(!app) return;
    applyTheme(getSettings().theme);
    if(doc && doc.body && doc.body.setAttribute && doc.body.removeAttribute){
      if(['focus','review','timeline'].includes(route) && reviewId) doc.body.setAttribute('data-ict-review-id', reviewId);
      else doc.body.removeAttribute('data-ict-review-id');
    }
    let content = home();
    if(route === 'planner') content = planner();
    else if(route === 'saved') content = saved();
    else if(route === 'focus' || route === 'review') content = focusCard();
    else if(route === 'timeline') content = timeline();
    else if(route === 'liquidity-map' || route === 'notes') content = liquidityMap();
    else if(route === 'risk') content = risk();
    else if(route === 'profile') content = profile();
    else if(route === 'component-gallery') content = componentGallery();
    ensureLiveRegion();
    app.innerHTML = renderShell(content);
    notice = '';
    noticeLevel = 'good';
    bind();
  }

  function tick(){
    if(!doc) return;
    const c = doc.getElementById('nyClock');
    if(c) c.innerHTML = new Date().toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour12: false}) + ` <span>NY</span>`;
    doc.querySelectorAll('.price-countdown').forEach(n => {
      n.textContent = priceCountdownText();
    });
  }

  restorePlannerDraft();
  restoreRouteFromHash();
  if(root.addEventListener){
    root.addEventListener('popstate', handleRouteChangeFromHash);
    root.addEventListener('hashchange', handleRouteChangeFromHash);
  }
  applyTheme(getSettings().theme);
  if(typeof setInterval === 'function') setInterval(tick, 1000);
  tick();
  initSupabase();
  render();
})();
