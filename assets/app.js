(function(){
  'use strict';

  const VERSION = 'v0.7.9';
  const KEY = 'ict_cards_v078';
  const SETTINGS_KEY = 'ict_settings_v1';
  const SCHEMA = 'ict_dol_sweep_export_v7';
  const NL = String.fromCharCode(10);
  const DQ = String.fromCharCode(34);
  const SQ = String.fromCharCode(39);
  const LEGACY = ['ict_cards_v077', 'ict_cards_v076', 'ict_dol_sweep_cards_v2', 'ict_slips_v1'];

  const root = typeof window !== 'undefined' ? window : globalThis;
  const doc = root.document || null;
  const app = doc ? doc.getElementById('app') : null;

  const instruments = ['MNQ','NQ','MES','ES','MYM','YM','MGC','GC','CL','EURUSD','GBPUSD','BTCUSD'];
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

  function isObject(v){
    return !!(v && typeof v === 'object' && !Array.isArray(v));
  }

  function asText(v){
    return String(v == null ? '' : v).trim();
  }

  function clean(v){
    let s = String(v || '').trim();
    if(s.toUpperCase() === 'N/A') return 'N/A';
    let r = '';
    let dot = false;
    for(const ch of s.replaceAll(',', '.')){
      if(ch >= '0' && ch <= '9') r += ch;
      else if(ch === '.' && !dot){
        r += ch;
        dot = true;
      }
    }
    return r;
  }

  function blank(){
    const x = {
      date: '',
      time: '',
      instrument: '',
      session: '',
      currentPrice: '',
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
      if(k === 'fvg') x[k] = s[k] === true || s[k] === 'yes' || s[k] === 'true';
      else if(k.endsWith('Taken')) x[k] = s[k] === true || s[k] === 'yes' || s[k] === 'true';
      else if(k === 'bias') x[k] = biasOptions.includes(s[k]) ? s[k] : '';
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
    return Number.isFinite(n) ? n : null;
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
    return 'Manual/static entry; optional local yfinance helper when running on this Mac.';
  }

  function priceHelperUrl(symbol){
    return 'http://127.0.0.1:8765/price?symbol=' + encodeURIComponent(symbol || '');
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

  function comp(x){
    const count = p => {
      let done = 0;
      let part = 0;
      for(let i = 1; i <= 3; i++){
        const any = x[p + i + 'Level'] || x[p + i + 'Draw'] || x[p + i + 'Tf'] || x[p + i + 'Taken'] || x[p + i + 'Confidence'] || x[p + i + 'HitTime'];
        const ok = p === 'dol'
          ? x[p + i + 'Level'] && x[p + i + 'Draw'] && x[p + i + 'Tf']
          : x[p + i + 'Level'] && x[p + i + 'Draw'] && x[p + i + 'Tf'] && x[p + i + 'Confidence'] && x[p + i + 'HitTime'];
        if(ok) done++;
        else if(any) part++;
      }
      return {done, part, ok: done > 0 && part === 0};
    };
    const d = count('dol');
    const s = count('sweep');
    return {ok: !!(x.instrument && d.ok && s.ok), dol: d, sweep: s};
  }

  function cardStatus(card){
    return comp(card.fields || blank()).ok ? 'complete' : 'draft';
  }

  function normaliseCard(o){
    const source = isObject(o) ? o : {};
    const now = new Date().toISOString();
    const fields = normFields(source.fields || source);
    const marketContext = normMarketContext(source.marketContext || (isObject(source.fields) ? source.fields.marketContext : null));
    const markerSource = isObject(source.markers) ? source.markers : {};
    const out = outcomes.includes(source.outcome) ? source.outcome : 'Open';
    const finalSaved = !!(source.finalSaved && finalOutcomes.includes(out));

    return {
      id: String(source.id || uid()),
      savedAt: asText(source.savedAt) || now,
      updatedAt: asText(source.updatedAt || source.savedAt) || now,
      fields,
      marketContext,
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

  function persistCards(nextCards){
    const store = storage();
    if(store) store.setItem(KEY, JSON.stringify(nextCards));
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

  function saveCards(nextCards){
    cards = Array.isArray(nextCards) ? nextCards.map(normaliseCard) : [];
    persistCards(cards);
    return getCards();
  }

  function createBlankDraft(seed){
    const input = isObject(seed) ? seed : {};
    return normaliseCard({
      id: input.id || uid(),
      savedAt: input.savedAt || new Date().toISOString(),
      updatedAt: input.updatedAt || new Date().toISOString(),
      fields: Object.assign(blank(), input.fields || {}),
      marketContext: normMarketContext(input.marketContext || (input.fields && input.fields.marketContext)),
      markers: input.markers || {},
      outcome: input.outcome || 'Open',
      notes: input.notes || '',
      finalSaved: false,
      favorite: !!input.favorite,
      journal: input.journal || {},
      risk: input.risk || {}
    });
  }

  function mergeCard(card, patch){
    const p = isObject(patch) ? patch : {};
    const next = Object.assign({}, card, p);
    if(p.fields) next.fields = Object.assign({}, card.fields || {}, p.fields);
    if(p.marketContext) next.marketContext = normMarketContext(p.marketContext);
    if(p.markers) next.markers = Object.assign({}, card.markers || {}, p.markers);
    if(p.journal) next.journal = Object.assign({}, card.journal || {}, p.journal);
    if(p.risk) next.risk = Object.assign({}, card.risk || {}, p.risk);
    next.updatedAt = p.updatedAt || new Date().toISOString();
    return normaliseCard(next);
  }

  function updateCard(id, patch){
    let updated = null;
    const nextCards = cards.map(card => {
      if(card.id !== id) return card;
      updated = mergeCard(card, patch);
      return updated;
    });
    if(updated) saveCards(nextCards);
    return updated;
  }

  function deleteCard(id){
    const before = cards.length;
    saveCards(cards.filter(card => card.id !== id));
    return cards.length !== before;
  }

  function toggleFavorite(id){
    const card = cards.find(c => c.id === id);
    if(!card) return null;
    return updateCard(id, {favorite: !card.favorite});
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
      watchlist: arrayText(saved.watchlist),
      riskDefaults: normRisk(saved.riskDefaults || defaultSettings.riskDefaults)
    };
  }

  function saveSettings(settings){
    const next = Object.assign({}, getSettings(), isObject(settings) ? settings : {});
    next.watchlist = arrayText(next.watchlist);
    next.riskDefaults = normRisk(next.riskDefaults);
    const store = storage();
    if(store) store.setItem(SETTINGS_KEY, JSON.stringify(next));
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
    const incoming = extractPayload(payload).map(normaliseCard);
    if(!incoming.length) return {imported: 0, cards: getCards()};

    const byId = {};
    cards.concat(incoming).forEach(card => {
      byId[card.id] = normaliseCard(card);
    });
    const merged = Object.values(byId).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    saveCards(merged);
    return {imported: incoming.length, cards: getCards()};
  }

  let route = 'home';
  let step = 0;
  let f = blank();
  let marketContextDraft = blankMarketContext();
  let marketContextOpenTimeframes = [];
  let cards = loadCards();
  let reviewId = '';
  let notice = '';
  let priceFetchState = '';

  const api = {
    KEY,
    LEGACY,
    SCHEMA,
    SETTINGS_KEY,
    blank,
    normFields,
    normMarketContext,
    blankMarketContext,
    derivePotentialPhase,
    normaliseCard,
    normalizeCard: normaliseCard,
    priceNumber,
    dolDistance,
    priceSourceLabel,
    priceHelperUrl,
    selectedMarketTimeframes,
    focusDolTakenFields,
    priceMapLevels,
    priceMapHtml,
    getCards,
    saveCards,
    getMetrics,
    createBlankDraft,
    updateCard,
    deleteCard,
    toggleFavorite,
    exportCards,
    importCards,
    getSettings,
    saveSettings,
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
    return marketTimeframes.filter(tf => marketContextOpenTimeframes.includes(tf) || hasMarketContextRow(context[tf]));
  }

  function focusDolTakenFields(c, lookup){
    const out = {};
    const fields = c && c.fields ? c.fields : {};
    const findNode = typeof lookup === 'function'
      ? lookup
      : id => doc ? doc.getElementById(id) : null;
    for(let i = 1; i <= 3; i++){
      const node = findNode('focus_dol' + i + 'Taken');
      out['dol' + i + 'Taken'] = node ? !!node.checked : !!fields['dol' + i + 'Taken'];
    }
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

  function priceMapHtml(x, meta){
    const current = priceNumber(x.currentPrice);
    const levels = priceMapLevels(x);
    const instrument = x.instrument || (meta && meta.instrument) || 'No instrument';
    const session = x.session || (meta && meta.session) || 'No session';
    const updated = x.time || (meta && meta.updatedAt) || 'Manual';
    const source = current == null ? 'Manual pending' : 'yfinance/manual';
    const header = `<div class='price-map-header'><div><div class='progress'>Price Map</div><h3 class='price-map-title'>${esc(instrument)}</h3><div class='price-map-meta'>${esc(session)} · Updated ${esc(updated)}</div><div class='price-map-source'>Source: ${esc(source)}</div></div><div class='price-map-live'>${esc(current == null ? 'Pending' : 'Live')}</div></div>`;
    const notice = priceFetchState === 'loading'
      ? `<div class='price-map-loading'>Fetching ${esc(instrument)} price from yfinance...</div>`
      : priceFetchState === 'error'
        ? `<div class='price-map-error'>Live price unavailable. Use the last known price or enter price manually.</div>`
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
      return `<div class='${classes}'><div><div class='price-map-row-title'><span class='pill ${level.kind === 'DOL' ? 'info' : 'warn'}'>${esc(level.kind)}</span><span>${esc(level.name)}</span></div><div class='price-map-row-sub'>${esc(level.timeframe)} · ${level.taken ? 'Taken' : 'Pending'}${level.rationale ? ' · ' + esc(level.rationale) : ''}</div></div><div><div class='price-map-price'>${esc(fmtNum(level.price))}</div><div class='price-map-distance'>${esc(distance)}</div></div></div>`;
    };
    return `<div class='price-map'>${header}<div class='price-map-body'>${above.map(row).join('')}<div class='price-map-current'><span>CURRENT PRICE</span><strong>${esc(fmtNum(current))}</strong></div>${below.map(row).join('')}</div>${notice}</div>`;
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

  function metricHtml(){
    const m = getMetrics(cards);
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
    return new Date().toISOString().slice(0, 10);
  }

  function sortedCards(){
    return cards.slice().sort((a, b) => new Date(b.updatedAt || b.savedAt) - new Date(a.updatedAt || a.savedAt));
  }

  function latestCard(){
    const sorted = sortedCards();
    return sorted.find(c => !c.finalSaved) || sorted[0] || null;
  }

  function startDraft(seed){
    const settings = getSettings();
    const input = isObject(seed) ? seed : {};
    const base = blank();
    base.date = today();
    base.instrument = settings.defaultInstrument || '';
    base.session = settings.defaultSession || '';
    const seedFields = input.fields ? input.fields : input;
    f = normFields(Object.assign(base, seedFields || {}));
    marketContextDraft = normMarketContext(input.marketContext || (input.fields && input.fields.marketContext));
    marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft);
    plannerCardId = '';
    priceFetchState = '';
    step = 0;
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
        const status = p === 'dol'
          ? `<label class='check-row'><input type='checkbox' id='focus_${p + i}Taken' ${x[p + i + 'Taken'] ? 'checked' : ''}> <span>DOL taken</span></label>`
          : pill(x[p + i + 'Taken'] ? 'Taken' : 'Not taken', x[p + i + 'Taken'] ? 'ok' : 'warn');
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
      ['journal', 'stylus_note', 'Journal'],
      ['profile', 'person', 'Profile']
    ];
    return `<nav class='tab-bar' aria-label='Primary'><div class='inner'>${tabs.map(t => `<button class='btn ${active === t[0] ? 'active' : ''}' data-route='${t[0]}' ${active === t[0] ? `aria-current='page'` : ''}>${icon(t[1])}<span>${t[2]}</span></button>`).join('')}</div></nav>`;
  }

  function activeTab(){
    if(['home','planner','saved','journal','profile'].includes(route)) return route;
    if(['focus','review','timeline'].includes(route)) return 'saved';
    if(route === 'liquidity-map') return 'planner';
    if(route === 'risk') return 'profile';
    return 'home';
  }

  function fabHtml(){
    if(!['home','saved','journal','risk','profile'].includes(route)) return '';
    return `<button class='fab' id='globalNewBtn' aria-label='Start new plan'>${icon('add')}</button>`;
  }

  function renderShell(content){
    return `<div class='app-shell'><main class='app-main'>${notice ? `<div class='save-state good' role='status'>${esc(notice)}</div>` : ''}${content}</main>${fabHtml()}${renderTabBar(activeTab())}</div>`;
  }

  function home(){
    const current = latestCard();
    const settings = getSettings();
    const chips = sessions.map(s => `<button class='chip' data-session-chip='${esc(s)}'>${esc(s)}</button>`).join('');
    const hero = current ? `<div class='card-hero'><div class='progress'>Today's focus</div><h2>${esc(current.fields.instrument || 'No instrument')}</h2><p class='sub'>${esc(current.fields.session || 'No session')} · ${esc(current.fields.date || 'No date')}</p><div class='status-row'>${biasPill(current.fields.bias)}${statusPill(current)}${outcomePill(current.outcome)}</div><div class='hero-actions'><button class='btn primary' data-open-card='${esc(current.id)}'>Open focus card</button><button class='btn ghost' id='continuePlanBtn'>Continue plan</button></div></div>` : `<div class='card-hero'><div class='progress'>Today's focus</div><h2>Build first plan</h2><p class='sub'>Start with one instrument, one bias thesis, mapped liquidity and review notes.</p><div class='hero-actions'><button class='btn primary' id='startBtn'>Start new analysis</button><button class='btn ghost' data-route='saved'>Saved cards</button></div></div>`;
    return `<section class='screen'>${pageHead('Market focus', 'ICT Sweep Tracker', 'Educational planning tool only. Not financial advice.', '')}<div class='field'><label class='label' for='homePrompt'>Planning prompt</label><input class='in' id='homePrompt' placeholder='What are you planning today?'></div><div class='card'><div class='progress'>Plan assistant</div><h3>Bias-led liquidity plan</h3><p class='sub'>Use the planner to structure observations. The app does not forecast price or provide trade recommendations.</p><div class='hero-actions'><button class='btn primary' id='startBtn'>Start new analysis</button><button class='btn' data-route='liquidity-map'>Liquidity map</button><button class='btn' data-route='risk'>Risk review</button></div></div><div class='row-actions'>${chips}</div>${hero}<h3>Review metrics</h3>${metricHtml()}<div class='card'><div class='progress'>Watchlist</div><h3>${settings.watchlist.length ? settings.watchlist.map(esc).join(' · ') : 'No watchlist set'}</h3><p class='sub'>Set default instruments and sessions from Profile.</p></div></section>`;
  }

  function planner(){
    const c = comp(f);
    const instrumentInput = `<label class='label' for='instrument'>Instrument</label><input class='in' id='instrument' list='inst' value='${esc(f.instrument)}' placeholder='Select or type instrument'><datalist id='inst'>${instruments.map(x => `<option value='${esc(x)}'>`).join('')}</datalist>`;
    const status = raw('Status', c.ok ? pill('Complete', 'ok') : pill('Draft', 'warn'));
    return `<section class='screen'><div class='card'><div class='progress'>AI Trade Plan Builder</div><h2>Build a deterministic focus plan</h2><p class='sub'>This assistant formats your inputs only. It does not call external AI, forecast price or generate trade signals.</p></div><div class='card'><div class='grid'><div>${input('date', 'Date', '', 'date')}</div><div>${input('time', 'Time', '', 'time')}</div></div><div class='grid'><div>${instrumentInput}</div><div>${select('session', 'Session', sessions, 'Optional')}</div></div>${input('currentPrice', 'Current price / tool-entry price', 'manual price at entry')}<div class='row-actions'><button class='btn' id='autoPriceBtn'>${icon('sync')}Auto-detect price</button></div><p class='hint'>Price source: ${esc(priceSourceLabel())}</p><p class='hint'>Auto-detect uses an optional local yfinance helper at 127.0.0.1:8765. GitHub Pages remains manual-only.</p><label class='label'>Bias Determination For Session</label><div class='segmented' role='group' aria-label='Bias Determination For Session'>${biasOptions.map(b => `<button class='segmented-option' data-bias='${b}' aria-pressed='${f.bias === b ? 'true' : 'false'}'>${esc(b)}</button>`).join('')}</div><p class='hint'>Session bias is a planning label for the selected session only. Before 10:30am NY, full-day prediction is not supported by this tool.</p></div><div class='card'><div class='progress'>Price Map</div><h3>Liquidity ladder</h3><div id='priceMapPreview'>${priceMapHtml(f)}</div></div><div class='card'><div class='progress'>Market Context</div><h3>Phase map by timeframe</h3><p class='sub'>Record observed context only. Potential next phase is a conservative planning note, not a trade signal or forecast.</p>${marketContextPlanner(marketContextDraft)}</div><div class='card'><div class='progress'>Draw on liquidity stack</div><h3>Up to three DOL records</h3>${row('dol', 1, 'DOL', 'Draw rationale / liquidity draw')}${row('dol', 2, 'DOL', 'Draw rationale / liquidity draw')}${row('dol', 3, 'DOL', 'Draw rationale / liquidity draw')}</div><div class='card'><div class='progress'>Potential sweep stack</div><h3>Up to three sweep records</h3>${row('sweep', 1, 'Sweep', 'Potential sweep liquidity')}${row('sweep', 2, 'Sweep', 'Potential sweep liquidity')}${row('sweep', 3, 'Sweep', 'Potential sweep liquidity')}<div class='panel'><h3>FVG Formation</h3><label class='check-row'><input type='checkbox' id='fvg' ${f.fvg ? 'checked' : ''}> <span>FVG formed after sweep</span></label>${select('fvgTf', 'FVG timeframe', tfs, '- FVG timeframe -')}</div></div><div class='card'><div class='progress'>Generated preview</div><div class='focus-output' id='plannerPreview'>${summary(f, marketContextDraft)}${status}</div></div><div aria-hidden='true' style='height:96px'></div><div class='sticky-cta' style='bottom:var(--bottom-nav-height)'><div class='inner'><button class='btn ghost' id='saveDraftBtn'>${icon('save')}Save Draft</button><button class='btn primary' id='nextBtn'>Generate Focus Plan</button></div></div></section>`;
  }

  function saved(){
    const query = savedSearch.toLowerCase();
    const filtered = sortedCards().filter(c => {
      const hay = [c.fields.instrument, c.fields.session, c.fields.bias, marketContextText(c.marketContext), stack(c.fields, 'dol', 'Liquidity draw'), stack(c.fields, 'sweep', 'Sweep liquidity'), c.notes, c.journal.lesson, c.journal.tags.join(' ')].join(' ').toLowerCase();
      const matchesSearch = !query || hay.includes(query);
      const matchesFilter = savedFilter === 'All' ||
        (savedFilter === 'Final Saved' && c.finalSaved) ||
        (savedFilter === 'Drafts' && !c.finalSaved) ||
        (savedFilter === 'Hits' && c.outcome === 'Hit') ||
        (savedFilter === 'Misses' && c.outcome === 'Miss') ||
        (savedFilter === 'Favorites' && c.favorite);
      return matchesSearch && matchesFilter;
    });
    const filters = ['All','Final Saved','Drafts','Hits','Misses','Favorites'].map(v => `<button class='chip ${savedFilter === v ? 'chip-active' : ''}' data-saved-filter='${esc(v)}'>${esc(v)}</button>`).join('');
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
    return `<section class='screen'>${pageHead('Focus card details', c.fields.instrument || 'No instrument', c.fields.session || 'No session', 'saved')}<div class='card-hero'><div class='progress'>${esc(c.fields.date || 'No date')}</div><h2>${esc(c.fields.instrument || 'No instrument')}</h2><p class='sub'>${esc(c.fields.session || 'No session')} · ${esc(c.fields.bias || 'No bias selected')}</p><div class='status-row'>${biasPill(c.fields.bias)}${c.finalSaved ? pill('Final saved', 'info') : pill(status === 'complete' ? 'Complete draft' : 'Draft', status === 'complete' ? 'ok' : 'warn')}${outcomePill(c.outcome)}</div><p class='hint'>Bias Determination For Session only. Before 10:30am NY, full-day prediction is not supported by this tool.</p></div><div class='card'><div class='progress'>Price snapshot</div>${priceMapHtml(c.fields, {updatedAt: c.updatedAt})}${line('Date', c.fields.date)}${line('Time', c.fields.time)}${line('Current price', c.fields.currentPrice)}${line('Price source', priceSourceLabel())}</div><div class='card'><div class='progress'>Market Context</div>${marketContextRows(c.marketContext)}</div><div class='card'><div class='progress'>DOL stack</div>${stackRows(c.fields, 'dol', 'DOL')}</div><div class='card'><div class='progress'>Potential sweep stack</div>${stackRows(c.fields, 'sweep', 'Sweep')}</div><div class='grid'><div class='card'><div class='progress'>FVG</div><h3>${c.fields.fvg || c.markers.fvgFormed ? 'FVG recorded' : 'No FVG recorded'}</h3><p class='sub'>${esc(c.fields.fvgTf || 'No timeframe')}</p></div><div class='card'><div class='progress'>Risk estimate</div>${line('Planned risk %', c.risk.plannedRiskPct)}${line('Planned R', c.risk.plannedR)}${line('Max loss', c.risk.maxLoss)}</div></div><div class='card'><h3>Trade highlights</h3><div class='review-grid'>${check('mark_dolRespected', 'DOL respected', c.markers.dolRespected)}${check('mark_sweepConfirmed', 'LTF sweep confirmed', c.markers.sweepConfirmed)}${check('mark_fvgFormed', 'FVG formed after sweep', c.markers.fvgFormed)}${check('mark_planFollowed', 'Plan followed', c.markers.planFollowed)}</div><label class='label' for='reviewOutcome'>Outcome</label><select class='in' id='reviewOutcome'>${options(outcomes, c.outcome, '- outcome -')}</select><label class='label' for='reviewNotes'>Verification notes</label><textarea class='in' id='reviewNotes' placeholder='Add review notes'>${esc(c.notes)}</textarea><div class='grid'><div><label class='label' for='riskPct'>Planned risk %</label><input class='in' id='riskPct' value='${esc(c.risk.plannedRiskPct)}' placeholder='0.5'></div><div><label class='label' for='plannedR'>Planned R</label><input class='in' id='plannedR' value='${esc(c.risk.plannedR)}' placeholder='2R'></div></div><label class='label' for='maxLoss'>Max loss</label><input class='in' id='maxLoss' value='${esc(c.risk.maxLoss)}' placeholder='Optional amount'><label class='label' for='journalLesson'>Journal lesson</label><textarea class='in' id='journalLesson' placeholder='Lesson learned'>${esc(c.journal.lesson)}</textarea><label class='label' for='journalTags'>Behaviour tags</label><input class='in' id='journalTags' value='${esc(c.journal.tags.join(', '))}' placeholder='patient, followed plan'></div><div class='row-actions'><button class='btn' id='loadBtn'>Load to planner</button><button class='btn' data-route='timeline'>Timeline</button><button class='btn' id='copyBtn'>Copy</button><button class='btn' id='shareBtn'>Share</button><button class='btn' id='saveChangesBtn'>Save changes</button><button class='btn good' id='finalSaveBtn'>Final save</button><button class='btn danger' id='deleteBtn'>Delete</button></div></section>`;
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
    const cats = ['All','DOL','Sweep','FVG','Bias','Killzone'].map(v => `<button class='chip ${liquidityFilter === v ? 'chip-active' : ''}' data-liquidity-filter='${esc(v)}'>${esc(v)}</button>`).join('');
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

  function journal(){
    const entries = sortedCards().filter(c => c.notes || c.journal.lesson || c.journal.tags.length || c.outcome !== 'Open');
    const list = entries.length ? entries.map(c => `<div class='card'><div class='progress'>${esc(c.outcome)} · ${esc(c.fields.date || new Date(c.savedAt).toLocaleDateString())}</div><h3>${esc(c.fields.instrument || 'No instrument')}</h3><p class='sub'>${esc(c.journal.lesson || c.notes || 'No journal lesson recorded.')}</p><div class='status-row'>${c.journal.tags.map(t => pill(t, 'info')).join('')}${statusPill(c)}</div><button class='btn' data-open-card='${esc(c.id)}'>Open focus card</button></div>`).join('') : `<div class='panel'><h3>No journal entries yet</h3><p class='hint'>Add notes or lessons from a focus card after review.</p></div>`;
    return `<section class='screen'>${pageHead('Trade journal', 'Journal', entries.length + ' reviewed entries', '')}<div class='card-dashed card'><div class='progress'>Screenshots</div><h3>Screenshot metadata placeholder</h3><p class='sub'>Image uploads are left out of v1 to avoid storing large files in localStorage.</p></div><button class='btn' id='exportJsonBtn'>Export journal data</button>${list}</section>`;
  }

  function profile(){
    const settings = getSettings();
    const m = getMetrics(cards);
    const recent = latestCard();
    return `<section class='screen'>${pageHead('Trader profile', 'Profile', 'Local settings and portable data tools.', '')}<div class='card'><h3>Local summary</h3>${line('Saved cards', m.total)}${line('Final saved', m.finalSaved)}${line('Favorites', m.favorites)}${line('Recent plan', recent ? (recent.fields.instrument || 'No instrument') : '')}</div><div class='card'><h3>Settings</h3><label class='label' for='defaultInstrument'>Default instrument</label><input class='in' id='defaultInstrument' value='${esc(settings.defaultInstrument)}' placeholder='MNQ'><label class='label' for='defaultSession'>Default session</label><select class='in' id='defaultSession'>${options(sessions, settings.defaultSession, 'No default')}</select><label class='label' for='watchlist'>Watchlist</label><input class='in' id='watchlist' value='${esc(settings.watchlist.join(', '))}' placeholder='MNQ, ES, GC'><div class='grid'><div><label class='label' for='defaultRiskPct'>Default risk %</label><input class='in' id='defaultRiskPct' value='${esc(settings.riskDefaults.plannedRiskPct)}'></div><div><label class='label' for='defaultPlannedR'>Default planned R</label><input class='in' id='defaultPlannedR' value='${esc(settings.riskDefaults.plannedR)}'></div></div><label class='label' for='defaultMaxLoss'>Default max loss</label><input class='in' id='defaultMaxLoss' value='${esc(settings.riskDefaults.maxLoss)}'><button class='btn primary' id='saveSettingsBtn'>Save settings</button></div><div class='card'><h3>Data tools</h3><div class='row-actions'><button class='btn' id='exportJsonBtn'>Export data</button><button class='btn' id='importJsonBtn'>Import data</button><button class='btn danger' id='clearDataBtn'>Clear all local data</button><input class='file-input' id='importFile' type='file' accept='application/json,.json'></div></div></section>`;
  }

  function sync(){
    if(!doc) return;
    for(const k of Object.keys(f)){
      const n = doc.getElementById(k);
      if(n) f[k] = n.type === 'checkbox' ? n.checked : (isPriceField(k) ? clean(n.value) : asText(n.value));
    }
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
  }

  function savePlanner(openDetails){
    sync();
    let c;
    if(plannerCardId && cards.find(x => x.id === plannerCardId)){
      c = updateCard(plannerCardId, {fields: f, marketContext: marketContextDraft, finalSaved: false});
    } else {
      c = createBlankDraft({fields: f, marketContext: marketContextDraft});
      saveCards([c].concat(cards));
      plannerCardId = c.id;
    }
    reviewId = c.id;
    route = openDetails ? 'focus' : 'planner';
    notice = openDetails ? 'Focus plan saved.' : 'Draft saved.';
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
      'Bias Determination For Session: ' + (c.fields.bias || '-'),
      'Session bias warning: Before 10:30am NY, full-day prediction is not supported by this tool.',
      'Market Context: ' + (marketContextText(c.marketContext) || '-'),
      'DOL stack: ' + (stack(c.fields, 'dol', 'Liquidity draw') || '-'),
      'Sweep stack: ' + (stack(c.fields, 'sweep', 'Sweep liquidity') || '-'),
      'FVG: ' + (c.fields.fvg ? 'Confirmed ' + (c.fields.fvgTf || '') : 'Not confirmed'),
      'Outcome: ' + c.outcome,
      'Final saved: ' + (c.finalSaved ? 'Yes' : 'No'),
      'Favorite: ' + (c.favorite ? 'Yes' : 'No'),
      'Journal lesson: ' + (c.journal.lesson || '-'),
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

    doc.querySelectorAll('[data-route]').forEach(n => {
      n.onclick = () => go(n.getAttribute('data-route'));
    });

    on('globalNewBtn', () => {
      if(Object.values(f).some(Boolean) && !confirm('Start a new draft and replace the current planner inputs?')) return;
      startDraft();
      route = 'planner';
      render();
    });
    on('startBtn', () => { startDraft(); route = 'planner'; render(); });
    on('continuePlanBtn', () => {
      const c = latestCard();
      if(c){
        f = normFields(c.fields);
        marketContextDraft = normMarketContext(c.marketContext);
        marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft);
        plannerCardId = c.id;
      } else {
        startDraft();
      }
      route = 'planner';
      render();
    });
    on('saveDraftBtn', () => savePlanner(false));
    on('nextBtn', () => savePlanner(true));
    on('autoPriceBtn', () => {
      sync();
      const symbol = f.instrument;
      if(!symbol){
        notice = 'Enter an instrument before auto-detecting price.';
        render();
        return;
      }
      if(typeof fetch !== 'function'){
        priceFetchState = 'error';
        notice = 'Auto-detect price needs browser fetch support.';
        render();
        return;
      }
      priceFetchState = 'loading';
      render();
      fetch(priceHelperUrl(symbol))
        .then(res => res.ok ? res.json() : Promise.reject(new Error('price helper unavailable')))
        .then(data => {
          if(!data || data.price == null) throw new Error('no price returned');
          f.currentPrice = clean(String(data.price));
          const now = new Date();
          f.time = f.time || now.toTimeString().slice(0, 5);
          priceFetchState = 'ok';
          notice = 'Price auto-detected from local yfinance helper.';
          render();
        })
        .catch(() => {
          priceFetchState = 'error';
          notice = 'Auto-detect unavailable. Start tools/yfinance_price_server.py or enter price manually.';
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
        render();
      };
    }

    doc.querySelectorAll('[data-open-card]').forEach(n => {
      n.onclick = () => {
        reviewId = n.getAttribute('data-open-card');
        route = 'focus';
        render();
      };
    });

    doc.querySelectorAll('[data-favorite]').forEach(n => {
      n.onclick = () => {
        toggleFavorite(n.getAttribute('data-favorite'));
        notice = 'Favorite updated.';
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
    };

    const plannerFields = Object.keys(f).map(id => q(id)).filter(Boolean);
    plannerFields.forEach(n => {
      const ev = n.tagName === 'SELECT' || n.type === 'checkbox' ? 'change' : 'input';
      n.addEventListener(ev, () => {
        sync();
        if(n.id === 'currentPrice') priceFetchState = '';
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
      notice = 'Saved data verified and normalised.';
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
          notice = result.imported ? result.imported + ' card(s) imported.' : 'No valid cards found in the JSON file.';
          render();
        };
        reader.readAsText(file);
      };
    }

    const cur = () => cards.find(c => c.id === reviewId);
    function read(finalSave){
      const c = cur();
      if(!c) return;
      const outcome = q('reviewOutcome').value || 'Open';
      if(finalSave && outcome === 'Open'){
        notice = 'Choose a non-Open outcome before Final save.';
        render();
        return;
      }
      updateCard(c.id, {
        fields: focusDolTakenFields(c, q),
        markers: {
          biasValidated: q('mark_biasValidated') ? !!q('mark_biasValidated').checked : !!c.markers.biasValidated,
          biasInvalidated: q('mark_biasInvalidated') ? !!q('mark_biasInvalidated').checked : !!c.markers.biasInvalidated,
          dolRespected: !!q('mark_dolRespected').checked,
          sweepConfirmed: !!q('mark_sweepConfirmed').checked,
          fvgFormed: !!q('mark_fvgFormed').checked,
          planFollowed: !!q('mark_planFollowed').checked
        },
        outcome,
        notes: q('reviewNotes').value.trim(),
        finalSaved: !!(finalSave && finalOutcomes.includes(outcome)),
        journal: {
          tags: arrayText(q('journalTags') ? q('journalTags').value : c.journal.tags),
          lesson: q('journalLesson') ? q('journalLesson').value.trim() : c.journal.lesson
        },
        risk: {
          plannedRiskPct: q('riskPct') ? q('riskPct').value.trim() : c.risk.plannedRiskPct,
          plannedR: q('plannedR') ? q('plannedR').value.trim() : c.risk.plannedR,
          maxLoss: q('maxLoss') ? q('maxLoss').value.trim() : c.risk.maxLoss
        }
      });
      notice = finalSave ? 'Final saved.' : 'Changes saved. Card is no longer final-saved.';
      render();
    }

    on('saveChangesBtn', () => cur() && read(false));
    on('finalSaveBtn', () => cur() && read(true));
    on('copyBtn', () => {
      const c = cur();
      const t = c && text(c);
      if(!t) return;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => {
        notice = 'Card copied.';
        render();
      }).catch(() => {
        const box = doc.createElement('textarea');
        box.value = t;
        doc.body.appendChild(box);
        box.select();
        doc.execCommand('copy');
        box.remove();
        notice = 'Card copied.';
        render();
      });
    });
    on('shareBtn', () => {
      const c = cur();
      const t = c && text(c);
      if(!t) return;
      if(navigator.share){
        navigator.share({title: 'ICT DOL Sweep Card', text: t}).then(() => {
          notice = 'Share sheet opened.';
          render();
        }).catch(() => {});
      } else if(navigator.clipboard) {
        navigator.clipboard.writeText(t).then(() => {
          notice = 'Share text copied.';
          render();
        });
      }
    });
    on('loadBtn', () => {
      const c = cur();
      if(c){
        f = normFields(c.fields);
        marketContextDraft = normMarketContext(c.marketContext);
        marketContextOpenTimeframes = selectedMarketTimeframes(marketContextDraft);
        plannerCardId = c.id;
        step = 0;
        route = 'planner';
        render();
      }
    });
    on('deleteBtn', () => {
      const c = cur();
      if(c && confirm('Delete this saved card?')){
        deleteCard(c.id);
        reviewId = '';
        route = 'saved';
        notice = 'Card deleted.';
        render();
      }
    });

    on('timelineNoteBtn', () => {
      const c = cards.find(x => x.id === reviewId) || latestCard();
      if(c && q('timelineNote')){
        updateCard(c.id, {notes: q('timelineNote').value.trim(), finalSaved: false});
        notice = 'Timeline note saved.';
        render();
      }
    });

    on('saveSettingsBtn', () => {
      saveSettings({
        defaultInstrument: q('defaultInstrument').value,
        defaultSession: q('defaultSession').value,
        watchlist: arrayText(q('watchlist').value),
        riskDefaults: {
          plannedRiskPct: q('defaultRiskPct').value,
          plannedR: q('defaultPlannedR').value,
          maxLoss: q('defaultMaxLoss').value
        }
      });
      notice = 'Settings saved.';
      render();
    });

    on('clearDataBtn', () => {
      if(confirm('Clear all local cards, settings and bias metadata?')){
        const store = storage();
        if(store){
          [KEY, SETTINGS_KEY, 'ict_bias_card_meta_v1'].concat(LEGACY).forEach(k => store.removeItem(k));
        }
        cards = [];
        startDraft();
        route = 'home';
        notice = 'Local data cleared.';
        render();
      }
    });
  }

  function addConcept(idx){
    const item = conceptLibrary[idx];
    if(!item) return;
    if(!Object.values(f).some(Boolean)) startDraft();
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
    route = 'planner';
    notice = item.name + ' added to draft.';
    render();
  }

  function go(next, params){
    if(route === 'planner') sync();
    if(params && params.id) reviewId = params.id;
    if(next === 'review') next = 'focus';
    if(next === 'planner' && params && params.new) startDraft();
    route = next || 'home';
    render();
  }

  function render(){
    if(!app) return;
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
    else if(route === 'journal') content = journal();
    else if(route === 'profile') content = profile();
    app.innerHTML = renderShell(content);
    notice = '';
    bind();
  }

  function tick(){
    if(!doc) return;
    const c = doc.getElementById('nyClock');
    if(c) c.innerHTML = new Date().toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour12: false}) + ` <span>NY</span>`;
  }

  if(typeof setInterval === 'function') setInterval(tick, 1000);
  tick();
  render();
})();
