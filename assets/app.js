(function () {
  'use strict';

  const APP_VERSION = 'v0.8.0';
  const STORAGE_KEY = 'ict_dol_sweep_cards_v2';
  const LEGACY_KEYS = ['ict_cards_v077', 'ict_cards_v076', 'ict_dol_sweep_cards_v1', 'ict_slips_v1'];
  const EXPORT_SCHEMA = 'ict_dol_sweep_export_v5';

  const app = document.getElementById('app');
  if (!app) return;

  const instruments = ['MNQ', 'NQ', 'MES', 'ES', 'MYM', 'YM', 'MGC', 'GC', 'CL', 'EURUSD', 'GBPUSD', 'BTCUSD'];

  const drawOptions = [
    { label: 'Previous day high (PDH)', side: 'buy' },
    { label: 'Previous day low (PDL)', side: 'sell' },
    { label: 'Previous week high (PWH)', side: 'buy' },
    { label: 'Previous week low (PWL)', side: 'sell' },
    { label: 'Previous month high (PMH)', side: 'buy' },
    { label: 'Previous month low (PML)', side: 'sell' },
    { label: 'Asia high', side: 'buy' },
    { label: 'Asia low', side: 'sell' },
    { label: 'London high', side: 'buy' },
    { label: 'London low', side: 'sell' },
    { label: 'New York AM high', side: 'buy' },
    { label: 'New York AM low', side: 'sell' },
    { label: 'Session high', side: 'buy' },
    { label: 'Session low', side: 'sell' },
    { label: 'Relative equal highs (REH)', side: 'buy' },
    { label: 'Relative equal lows (REL)', side: 'sell' },
    { label: 'Old high / prior swing high', side: 'buy' },
    { label: 'Old low / prior swing low', side: 'sell' },
    { label: 'Buy-side liquidity above price', side: 'buy' },
    { label: 'Sell-side liquidity below price', side: 'sell' },
    { label: 'New Week Opening Gap (NWOG)', side: 'neutral' },
    { label: 'New Day Opening Gap (NDOG)', side: 'neutral' },
    { label: 'HTF fair value gap / imbalance', side: 'neutral' },
    { label: 'Unfilled FVG / imbalance', side: 'neutral' },
    { label: 'Midnight open', side: 'neutral' },
    { label: 'Weekly open', side: 'neutral' },
    { label: 'Opening range high', side: 'buy' },
    { label: 'Opening range low', side: 'sell' },
    { label: 'Other mapped liquidity', side: 'neutral' }
  ];

  const drawLabels = drawOptions.map((item) => item.label);
  const sessions = ['London', 'Pre-New York', 'New York AM', 'New York PM', 'Other'];
  const times = ['London Killzone', 'Pre NY', 'NY AM', 'NY Lunch', 'London Close', 'During Macro', 'Outside Killzone', 'Today', 'Tomorrow', 'This week', 'Other / discretionary'];
  const confidence = ['Low', 'Medium', 'High'];
  const timeframes = ['Monthly', 'Weekly', 'Daily', '4H', '1H', '15m', '5m', '3m', '1m'];
  const fvgTimeframes = ['15m', '5m', '3m', '1m'];
  const outcomes = ['Open', 'Hit', 'Miss', 'Breakeven'];

  let view = 'home';
  let step = 0;
  let selectedCardId = '';
  let flash = '';
  let f = defaultFields();

  function defaultFields() {
    const fields = {
      date: '',
      instrument: '',
      session: '',
      fvg: false,
      fvgTf: '',
      drawRespected: false,
      sweepConfirmed: false,
      sweepLedToDol: false,
      fvgFormed: false,
      planFollowed: false,
      outcome: 'Open',
      verificationNotes: ''
    };

    for (let i = 1; i <= 3; i += 1) {
      fields[`dol${i}Tf`] = '';
      fields[`dol${i}Level`] = '';
      fields[`dol${i}Draw`] = '';
      fields[`dol${i}Confidence`] = '';
      fields[`dol${i}HitTime`] = '';

      fields[`sweep${i}Tf`] = '';
      fields[`sweep${i}Level`] = '';
      fields[`sweep${i}Draw`] = '';
      fields[`sweep${i}Confidence`] = '';
      fields[`sweep${i}HitTime`] = '';
    }

    return fields;
  }

  function setFlash(message) {
    flash = message || '';
  }

  function clearFlash() {
    flash = '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function optionList(items, value, placeholder) {
    return `<option value="">${escapeHtml(placeholder || '— select —')}</option>${items
      .map((item) => `<option value="${escapeHtml(item)}" ${item === value ? 'selected' : ''}>${escapeHtml(item)}</option>`)
      .join('')}`;
  }

  function input(id, label, placeholder, type) {
    const isPrice = id.includes('Level');
    const realType = isPrice ? 'text' : (type || 'text');
    const attrs = isPrice ? ' inputmode="decimal" autocomplete="off" data-price="true"' : '';
    return `<label class="label" for="${id}">${escapeHtml(label)}</label><input class="in ${isPrice ? 'numeric' : ''}" id="${id}" type="${realType}"${attrs} value="${escapeHtml(f[id])}" placeholder="${escapeHtml(placeholder || '')}">`;
  }

  function textarea(id, label, placeholder, value) {
    return `<label class="label" for="${id}">${escapeHtml(label)}</label><textarea class="in" id="${id}" placeholder="${escapeHtml(placeholder || '')}">${escapeHtml(value ?? f[id] ?? '')}</textarea>`;
  }

  function select(id, label, items, placeholder) {
    return `<label class="label" for="${id}">${escapeHtml(label)}</label><select class="in" id="${id}">${optionList(items, f[id], placeholder)}</select>`;
  }

  function checkbox(id, label, checked) {
    return `<label class="check-row"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> <span>${escapeHtml(label)}</span></label>`;
  }

  function line(label, value) {
    const rendered = value ? escapeHtml(value) : '<span class="empty">—</span>';
    return `<div class="line"><div class="k">${escapeHtml(label)}</div><div class="v">${rendered}</div></div>`;
  }

  function badge(text, tone) {
    return `<span class="pill ${tone || ''}">${escapeHtml(text)}</span>`;
  }

  function normaliseBoolean(value) {
    return value === true || value === 'true' || value === 'yes' || value === '1';
  }

  function sanitizePrice(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^n\/?a$/i.test(raw)) return 'N/A';

    return raw
      .replace(',', '.')
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
  }

  function syncVisibleFields() {
    Object.keys(f).forEach((key) => {
      const node = document.getElementById(key);
      if (!node) return;

      if (node.type === 'checkbox') {
        f[key] = node.checked;
      } else if (node.dataset.price === 'true') {
        f[key] = sanitizePrice(node.value);
        node.value = f[key];
      } else {
        f[key] = node.value.trim();
      }
    });
  }

  function attachNumericCleaners() {
    document.querySelectorAll('[data-price="true"]').forEach((node) => {
      const clean = () => {
        const cleaned = sanitizePrice(node.value);
        if (cleaned !== node.value) node.value = cleaned;
      };

      node.addEventListener('blur', clean);
      node.addEventListener('paste', () => window.setTimeout(clean, 0));
    });
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `card_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      setFlash('Saved data could not be read. Export backup may be needed if browser storage is corrupted.');
      return fallback;
    }
  }

  function normaliseFields(rawFields) {
    const base = defaultFields();
    const source = rawFields && typeof rawFields === 'object' ? rawFields : {};

    Object.keys(base).forEach((key) => {
      if (!(key in source)) return;

      if (typeof base[key] === 'boolean') {
        base[key] = normaliseBoolean(source[key]);
      } else if (key.includes('Level')) {
        base[key] = sanitizePrice(source[key]);
      } else {
        base[key] = String(source[key] ?? '').trim();
      }
    });

    if (!outcomes.includes(base.outcome)) base.outcome = 'Open';
    return base;
  }

  function normaliseCard(raw, index) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const fields = normaliseFields(source.fields || source);

    return {
      id: source.id || makeId(),
      createdAt: source.createdAt || source.savedAt || new Date().toISOString(),
      updatedAt: source.updatedAt || source.savedAt || new Date().toISOString(),
      finalSavedAt: source.finalSavedAt || '',
      isFinal: normaliseBoolean(source.isFinal || source.finalSaved),
      status: statusFor(fields),
      fields
    };
  }

  function readStoredCardsFromKey(key) {
    const parsed = safeParse(localStorage.getItem(key), null);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normaliseCard);
  }

  function loadCards() {
    const primary = readStoredCardsFromKey(STORAGE_KEY);
    if (primary.length) return primary;

    for (const key of LEGACY_KEYS) {
      const migrated = readStoredCardsFromKey(key);
      if (migrated.length) {
        saveCards(migrated, false);
        return migrated;
      }
    }

    return [];
  }

  function saveCards(cards, showMessage = true) {
    try {
      const normalised = cards.map(normaliseCard);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalised));
      if (showMessage) setFlash('Saved locally.');
      return true;
    } catch (error) {
      setFlash('Save failed. Browser storage may be full or unavailable.');
      return false;
    }
  }

  function getCard(id) {
    return loadCards().find((card) => card.id === id);
  }

  function updateCard(id, updater, message) {
    const cards = loadCards();
    const index = cards.findIndex((card) => card.id === id);
    if (index === -1) {
      setFlash('Card not found.');
      return false;
    }

    const updated = updater({ ...cards[index], fields: { ...cards[index].fields } });
    updated.updatedAt = new Date().toISOString();
    updated.status = statusFor(updated.fields);
    cards[index] = updated;

    if (saveCards(cards, false)) {
      setFlash(message || 'Saved locally.');
      return true;
    }

    return false;
  }

  function deleteCard(id) {
    const cards = loadCards().filter((card) => card.id !== id);
    if (saveCards(cards, false)) {
      setFlash('Card deleted.');
      selectedCardId = '';
      view = 'saved';
      render();
    }
  }

  function row(prefix, index, fields = f) {
    return {
      tf: fields[`${prefix}${index}Tf`],
      level: fields[`${prefix}${index}Level`],
      draw: fields[`${prefix}${index}Draw`],
      confidence: fields[`${prefix}${index}Confidence`],
      hitTime: fields[`${prefix}${index}HitTime`]
    };
  }

  function rowStarted(rowData) {
    return Boolean(rowData.tf || rowData.level || rowData.draw || rowData.confidence || rowData.hitTime);
  }

  function rowComplete(rowData) {
    return Boolean(rowData.tf && rowData.level && rowData.draw);
  }

  function countStack(prefix, fields = f) {
    let complete = 0;
    let partial = 0;

    for (let i = 1; i <= 3; i += 1) {
      const current = row(prefix, i, fields);
      if (rowComplete(current)) complete += 1;
      else if (rowStarted(current)) partial += 1;
    }

    return {
      complete,
      partial,
      valid: complete > 0 && partial === 0
    };
  }

  function sideFor(label) {
    const match = drawOptions.find((option) => option.label === label);
    return match ? match.side : 'neutral';
  }

  function directionRead(fields = f) {
    const dolSides = [];
    const sweepSides = [];

    for (let i = 1; i <= 3; i += 1) {
      const dol = row('dol', i, fields);
      const sweep = row('sweep', i, fields);

      if (rowComplete(dol)) dolSides.push(sideFor(dol.draw));
      if (rowComplete(sweep)) sweepSides.push(sideFor(sweep.draw));
    }

    const knownDol = dolSides.filter((side) => side !== 'neutral');
    const knownSweep = sweepSides.filter((side) => side !== 'neutral');

    if (!knownDol.length || !knownSweep.length) {
      return { tone: 'info', label: 'Direction not classified', message: 'Directional check needs a buy-side/sell-side DOL and sweep.' };
    }

    const hasOpposite = knownDol.some((dolSide) => knownSweep.some((sweepSide) => sweepSide !== dolSide));
    const hasSame = knownDol.some((dolSide) => knownSweep.some((sweepSide) => sweepSide === dolSide));

    if (hasOpposite && !hasSame) {
      return { tone: 'ok', label: 'Opposing sweep mapped', message: 'Sweep liquidity is opposite the directional DOL.' };
    }

    if (hasSame && !hasOpposite) {
      return { tone: 'warn', label: 'Check sweep direction', message: 'Sweep appears on the same side as the DOL.' };
    }

    return { tone: 'warn', label: 'Mixed sweep sides', message: 'Some sweep rows oppose the DOL and some do not.' };
  }

  function readiness(fields = f) {
    const dol = countStack('dol', fields);
    const sweep = countStack('sweep', fields);
    const missing = [];

    if (!fields.instrument) missing.push('instrument');
    if (!dol.valid) missing.push('one complete DOL row');
    if (!sweep.valid) missing.push('one complete sweep row');

    return {
      complete: missing.length === 0,
      missing,
      dol,
      sweep,
      direction: directionRead(fields)
    };
  }

  function statusFor(fields = f) {
    return readiness(fields).complete ? 'complete' : 'draft';
  }

  function stackText(prefix, label, fields = f) {
    const out = [];

    for (let i = 1; i <= 3; i += 1) {
      const current = row(prefix, i, fields);
      const parts = [
        current.tf && `TF ${current.tf}`,
        current.level && `Level ${current.level}`,
        current.draw && `${label}: ${current.draw}`,
        current.confidence && `Confidence: ${current.confidence}`,
        current.hitTime && `Hit time: ${current.hitTime}`
      ].filter(Boolean);

      if (parts.length) {
        out.push(`${prefix === 'dol' ? 'DOL' : 'Sweep'} ${i} — ${parts.join(' · ')}`);
      }
    }

    return out.join('\n');
  }

  function summary(fields = f) {
    const status = readiness(fields);
    return [
      line('Date', fields.date),
      line('Instrument', fields.instrument),
      line('Session', fields.session || 'Optional'),
      line('DOL stack', stackText('dol', 'Liquidity draw', fields)),
      line('Potential sweep', stackText('sweep', 'Sweep liquidity', fields)),
      line('Direction check', status.direction.label),
      line('FVG', fields.fvg ? `Confirmed${fields.fvgTf ? ` · ${fields.fvgTf}` : ''}` : 'Not confirmed'),
      line('Focus status', status.complete ? 'Complete' : `Draft — missing ${status.missing.join(', ')}`)
    ].join('');
  }

  function flashHtml() {
    return flash ? `<div class="save-state good" role="status">${escapeHtml(flash)}</div>` : '';
  }

  function renderHome() {
    return `<section class="screen">
      <div class="card">
        <div class="progress">${APP_VERSION}</div>
        <h2>ICT DOL Sweep Tracker</h2>
        <p class="sub">Map one instrument, up to three draws on liquidity, potential opposing sweeps, and FVG formation. Educational planning tool only.</p>
        <div class="hero-actions">
          <button class="btn primary" id="startBtn">Start new analysis</button>
          <button class="btn" id="savedBtn">Saved cards</button>
          <button class="btn" id="notesBtn">Liquidity notes</button>
        </div>
        ${flashHtml()}
      </div>
    </section>`;
  }

  function setupCard(prefix, index, title, drawLabel) {
    return `<div class="panel">
      <div class="progress">${title} ${index} of 3</div>
      <div class="grid">
        <div>${select(`${prefix}${index}Tf`, `${title} timeframe`, timeframes, '— timeframe —')}</div>
        <div>${input(`${prefix}${index}Level`, `${title} liquidity price level`, 'price level or N/A')}</div>
      </div>
      <div>${select(`${prefix}${index}Draw`, drawLabel, drawLabels, '— select liquidity draw —')}</div>
      <div class="grid">
        <div>${select(`${prefix}${index}Confidence`, `${title} confidence`, confidence, '— optional confidence —')}</div>
        <div>${select(`${prefix}${index}HitTime`, 'Expected hit time', times, '— optional hit time —')}</div>
      </div>
    </div>`;
  }

  function renderPlanner() {
    const parts = [];

    if (step === 0) {
      parts.push(`<section class="screen">
        <div class="card">
          <div class="progress">Step 1 of 4</div>
          <h2>Choose the instrument</h2>
          <div class="grid">
            <div>${input('date', 'Date', '', 'date')}</div>
            <div>
              <label class="label" for="instrument">Instrument</label>
              <input class="in" id="instrument" list="inst" value="${escapeHtml(f.instrument)}" placeholder="Select or type instrument">
              <datalist id="inst">${instruments.map((item) => `<option value="${escapeHtml(item)}">`).join('')}</datalist>
            </div>
          </div>
          ${select('session', 'Session', sessions, 'Optional')}
        </div>
      </section>`);
    }

    if (step === 1) {
      const status = countStack('dol');
      parts.push(`<section class="screen">
        <div class="card">
          <div class="progress">Step 2 of 4</div>
          <h2>Define up to three draws on liquidity</h2>
          <p class="sub">A row is complete when timeframe, level, and liquidity draw are filled.</p>
          ${setupCard('dol', 1, 'DOL', 'Draw rationale / liquidity draw')}
          ${setupCard('dol', 2, 'DOL', 'Draw rationale / liquidity draw')}
          ${setupCard('dol', 3, 'DOL', 'Draw rationale / liquidity draw')}
          <div class="focus-output">
            ${line('Completed DOLs', `${status.complete} / 3`)}
            ${line('Status', status.valid ? 'Ready' : 'Draft — complete each started DOL row')}
          </div>
        </div>
      </section>`);
    }

    if (step === 2) {
      const status = countStack('sweep');
      const direction = directionRead();
      parts.push(`<section class="screen">
        <div class="card">
          <div class="progress">Step 3 of 4</div>
          <h2>Potential sweep liquidity</h2>
          <p class="sub">Map liquidity that price may sweep before moving to the DOL.</p>
          ${setupCard('sweep', 1, 'Sweep', 'Potential sweep liquidity')}
          ${setupCard('sweep', 2, 'Sweep', 'Potential sweep liquidity')}
          ${setupCard('sweep', 3, 'Sweep', 'Potential sweep liquidity')}
          <div class="focus-output">
            ${line('Completed sweeps', `${status.complete} / 3`)}
            ${line('Status', status.valid ? 'Ready' : 'Draft — complete each started sweep row')}
            ${line('Direction', direction.message)}
          </div>
          <div class="panel">
            <h3>FVG Formation</h3>
            ${checkbox('fvg', 'FVG formed after sweep', f.fvg)}
            ${select('fvgTf', 'FVG timeframe', fvgTimeframes, '— optional timeframe —')}
          </div>
        </div>
      </section>`);
    }

    if (step === 3) {
      const status = readiness();
      parts.push(`<section class="screen">
        <div class="card">
          <div class="progress">Step 4 of 4</div>
          <h2>Review focus card</h2>
          <div class="focus-output">${summary()}</div>
          <div class="row-actions">
            ${badge(status.complete ? 'Complete' : 'Draft', status.complete ? 'ok' : 'warn')}
            ${badge(status.direction.label, status.direction.tone)}
          </div>
        </div>
      </section>`);
    }

    const nextLabel = step === 3 ? 'Save card' : 'Next';
    parts.push(`<div class="bottom-nav">
      <div class="inner">
        <button class="btn" id="homeBtn">Home</button>
        <button class="btn" id="backBtn">Back</button>
        <button class="btn primary" id="nextBtn">${nextLabel}</button>
      </div>
    </div>`);

    return parts.join('');
  }

  function saveCurrentCard() {
    syncVisibleFields();

    const cards = loadCards();
    const now = new Date().toISOString();
    const fields = normaliseFields(f);
    const card = {
      id: makeId(),
      createdAt: now,
      updatedAt: now,
      finalSavedAt: '',
      isFinal: false,
      status: statusFor(fields),
      fields
    };

    cards.unshift(card);
    if (saveCards(cards, false)) {
      selectedCardId = card.id;
      view = 'review';
      step = 0;
      setFlash(card.status === 'complete' ? 'Card saved as complete.' : 'Card saved as draft.');
      render();
    }
  }

  function analytics(cards) {
    const finalHitMiss = cards.filter((card) => card.isFinal && ['Hit', 'Miss'].includes(card.fields.outcome));
    const hits = finalHitMiss.filter((card) => card.fields.outcome === 'Hit').length;
    const misses = finalHitMiss.filter((card) => card.fields.outcome === 'Miss').length;
    const breakeven = cards.filter((card) => card.isFinal && card.fields.outcome === 'Breakeven').length;
    const needsFinal = cards.filter((card) => !card.isFinal).length;
    const sample = hits + misses;

    return {
      hitRate: sample ? `${Math.round((hits / sample) * 100)}%` : '—',
      sample,
      hits,
      misses,
      breakeven,
      needsFinal
    };
  }

  function renderMetric(value, label) {
    return `<div class="metric"><div class="m">${escapeHtml(value)}</div><div class="l">${escapeHtml(label)}</div></div>`;
  }

  function cardTitle(card) {
    const fields = card.fields;
    return `${fields.instrument || 'No instrument'}${fields.date ? ` · ${fields.date}` : ''}`;
  }

  function renderSaved() {
    const cards = loadCards();
    const stats = analytics(cards);
    const groups = {};

    cards.forEach((card) => {
      const key = card.fields.instrument || 'No instrument';
      if (!groups[key]) groups[key] = [];
      groups[key].push(card);
    });

    const groupHtml = Object.keys(groups).sort().map((key) => {
      const rows = groups[key].map((card) => {
        const direction = directionRead(card.fields);
        return `<button class="saved-row" type="button" data-open-card="${escapeHtml(card.id)}">
          <div class="saved-head">
            <div class="saved-title">${escapeHtml(cardTitle(card))}<small>${escapeHtml(new Date(card.updatedAt).toLocaleString())}</small></div>
            <div>${badge(card.isFinal ? 'Final saved' : card.status, card.isFinal ? 'ok' : card.status === 'complete' ? 'info' : 'warn')}</div>
          </div>
          <div class="focus-output">
            ${line('DOL stack', stackText('dol', 'Liquidity draw', card.fields))}
            ${line('Potential sweep', stackText('sweep', 'Sweep liquidity', card.fields))}
            ${line('Direction', direction.label)}
            ${line('Outcome', card.fields.outcome)}
          </div>
        </button>`;
      }).join('');

      return `<div class="card"><h2>${escapeHtml(key)}</h2>${rows}</div>`;
    }).join('');

    return `<section>
      <div class="btn-row-between">
        <div>
          <div class="progress">Saved cards</div>
          <h2>Grouped by instrument</h2>
        </div>
        <div class="row-actions">
          <button class="btn" id="homeBtn">Home</button>
          <button class="btn primary" id="newBtn">New</button>
        </div>
      </div>

      <div class="metric-grid">
        ${renderMetric(stats.hitRate, 'Final hit rate')}
        ${renderMetric(String(stats.sample), 'Hit/Miss sample')}
        ${renderMetric(String(stats.breakeven), 'Breakeven')}
        ${renderMetric(String(stats.needsFinal), 'Needs final save')}
      </div>

      <div class="row-actions">
        <button class="btn" id="verifyBtn">Verify data</button>
        <button class="btn" id="exportTextBtn">Export text</button>
        <button class="btn" id="exportJsonBtn">Export JSON</button>
        <label class="btn" for="importJson">Import JSON</label>
        <input class="file-input" id="importJson" type="file" accept="application/json,.json">
      </div>

      ${flashHtml()}
      ${cards.length ? groupHtml : '<div class="panel"><p class="hint">No saved cards yet.</p></div>'}
    </section>`;
  }

  function reviewValue(id, card) {
    const node = document.getElementById(id);
    if (!node) return card.fields[id];
    if (node.type === 'checkbox') return node.checked;
    return node.value.trim();
  }

  function readReviewFields(card) {
    const fields = { ...card.fields };
    ['drawRespected', 'sweepConfirmed', 'sweepLedToDol', 'fvgFormed', 'planFollowed'].forEach((key) => {
      fields[key] = Boolean(reviewValue(key, card));
    });
    fields.outcome = outcomes.includes(reviewValue('outcome', card)) ? reviewValue('outcome', card) : 'Open';
    fields.verificationNotes = reviewValue('verificationNotes', card);
    return normaliseFields(fields);
  }

  function renderReview() {
    const card = getCard(selectedCardId);
    if (!card) {
      selectedCardId = '';
      view = 'saved';
      setFlash('Card not found.');
      return renderSaved();
    }

    const fields = card.fields;

    return `<section>
      <div class="btn-row-between">
        <div>
          <div class="progress">Saved card review</div>
          <h2>${escapeHtml(cardTitle(card))}</h2>
        </div>
        <button class="btn" id="backToSavedBtn">Saved cards</button>
      </div>

      <div class="card">
        <div class="saved-head">
          <div>
            ${badge(card.isFinal ? 'Final saved' : card.status, card.isFinal ? 'ok' : card.status === 'complete' ? 'info' : 'warn')}
            ${card.finalSavedAt ? badge(`Final ${new Date(card.finalSavedAt).toLocaleString()}`, 'info') : ''}
          </div>
        </div>
        <div class="focus-output">${summary(fields)}</div>
      </div>

      <div class="card">
        <h3>Verification markers</h3>
        <div class="review-grid">
          ${checkbox('drawRespected', 'Draw respected', fields.drawRespected)}
          ${checkbox('sweepConfirmed', 'LTF sweep confirmed', fields.sweepConfirmed)}
          ${checkbox('sweepLedToDol', 'Sweep led to intended DOL', fields.sweepLedToDol)}
          ${checkbox('fvgFormed', 'FVG formed after sweep', fields.fvgFormed)}
          ${checkbox('planFollowed', 'Plan followed', fields.planFollowed)}
          <div>
            <label class="label" for="outcome">Outcome</label>
            <select class="in" id="outcome">${optionList(outcomes, fields.outcome, '— outcome —')}</select>
          </div>
        </div>
        ${textarea('verificationNotes', 'Verification notes', 'Add review notes', fields.verificationNotes)}
        <div class="save-state" id="saveState">No unsaved changes.</div>
      </div>

      <div class="row-actions">
        <button class="btn" id="loadBtn">Load to planner</button>
        <button class="btn" id="copyBtn">Copy</button>
        <button class="btn" id="saveChangesBtn">Save changes</button>
        <button class="btn good" id="finalSaveBtn">Final save</button>
        <button class="btn danger" id="deleteBtn">Delete</button>
      </div>

      ${flashHtml()}
    </section>`;
  }

  function renderNotes() {
    return `<section class="screen">
      <div class="card">
        <div class="progress">Liquidity notes</div>
        <h2>Simple operating notes</h2>
        <div class="learn-list">
          <div class="learn"><h3>Draw on liquidity</h3><p>Mark the higher-timeframe pool or level that price may seek.</p></div>
          <div class="learn"><h3>Potential sweep</h3><p>Map the opposing liquidity that may be taken before price moves toward the draw.</p></div>
          <div class="learn"><h3>FVG formation</h3><p>Record whether an imbalance formed after the sweep. This is a review marker, not a trade recommendation.</p></div>
        </div>
        <div class="row-actions">
          <button class="btn" id="homeBtn">Home</button>
          <button class="btn primary" id="startBtn">Start new analysis</button>
        </div>
      </div>
    </section>`;
  }

  function cardPlainText(card) {
    const fields = card.fields;
    return [
      `ICT DOL Sweep Card`,
      `Status: ${card.isFinal ? 'Final saved' : card.status}`,
      `Date: ${fields.date || '—'}`,
      `Instrument: ${fields.instrument || '—'}`,
      `Session: ${fields.session || '—'}`,
      `DOL: ${stackText('dol', 'Liquidity draw', fields) || '—'}`,
      `Potential sweep: ${stackText('sweep', 'Sweep liquidity', fields) || '—'}`,
      `FVG: ${fields.fvg ? `Confirmed ${fields.fvgTf || ''}`.trim() : 'Not confirmed'}`,
      `Outcome: ${fields.outcome}`,
      `Notes: ${fields.verificationNotes || '—'}`
    ].join('\n');
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function exportText() {
    const cards = loadCards();
    const content = cards.map(cardPlainText).join('\n\n---\n\n') || 'No saved cards.';
    downloadFile('ict-dol-sweep-cards.txt', content);
    setFlash('Text export created.');
    render();
  }

  function exportJson() {
    const cards = loadCards();
    const payload = {
      schema: EXPORT_SCHEMA,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      analytics: analytics(cards),
      cards
    };

    downloadFile('ict-dol-sweep-export.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
    setFlash('JSON export created.');
    render();
  }

  function importJson(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = safeParse(String(reader.result || ''), null);
      const incoming = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.cards) ? parsed.cards : null;

      if (!incoming) {
        setFlash('Import failed. JSON file does not contain saved cards.');
        render();
        return;
      }

      const existing = loadCards();
      const seen = new Set(existing.map((card) => card.id));
      const imported = incoming.map(normaliseCard).filter((card) => {
        if (seen.has(card.id)) return false;
        seen.add(card.id);
        return true;
      });

      saveCards([...imported, ...existing], false);
      setFlash(`Imported ${imported.length} card${imported.length === 1 ? '' : 's'}.`);
      render();
    };

    reader.onerror = () => {
      setFlash('Import failed. Browser could not read the file.');
      render();
    };

    reader.readAsText(file);
  }

  function verifyData() {
    const cards = loadCards();
    saveCards(cards, false);
    setFlash(`Verified ${cards.length} saved card${cards.length === 1 ? '' : 's'}.`);
    render();
  }

  function copyCard(card) {
    const text = cardPlainText(card);

    const fallbackCopy = () => {
      const node = document.createElement('textarea');
      node.value = text;
      document.body.appendChild(node);
      node.select();
      document.execCommand('copy');
      node.remove();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setFlash('Card copied.');
        render();
      }).catch(() => {
        fallbackCopy();
        setFlash('Card copied.');
        render();
      });
      return;
    }

    fallbackCopy();
    setFlash('Card copied.');
    render();
  }

  function markReviewDirty() {
    const node = document.getElementById('saveState');
    if (!node) return;
    node.textContent = 'Unsaved changes.';
    node.className = 'save-state warn';
  }

  function bindCommonActions() {
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.addEventListener('click', () => {
      syncVisibleFields();
      clearFlash();
      view = 'home';
      render();
    });

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', () => {
      f = defaultFields();
      clearFlash();
      step = 0;
      view = 'planner';
      render();
    });

    const savedBtn = document.getElementById('savedBtn');
    if (savedBtn) savedBtn.addEventListener('click', () => {
      clearFlash();
      view = 'saved';
      render();
    });

    const notesBtn = document.getElementById('notesBtn');
    if (notesBtn) notesBtn.addEventListener('click', () => {
      clearFlash();
      view = 'notes';
      render();
    });
  }

  function bindPlannerActions() {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      syncVisibleFields();
      if (step === 3) saveCurrentCard();
      else {
        step += 1;
        render();
      }
    });

    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', () => {
      syncVisibleFields();
      if (step === 0) {
        view = 'home';
      } else {
        step -= 1;
      }
      render();
    });
  }

  function bindSavedActions() {
    const newBtn = document.getElementById('newBtn');
    if (newBtn) newBtn.addEventListener('click', () => {
      f = defaultFields();
      clearFlash();
      step = 0;
      view = 'planner';
      render();
    });

    document.querySelectorAll('[data-open-card]').forEach((node) => {
      node.addEventListener('click', () => {
        selectedCardId = node.getAttribute('data-open-card') || '';
        clearFlash();
        view = 'review';
        render();
      });
    });

    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) verifyBtn.addEventListener('click', verifyData);

    const exportTextBtn = document.getElementById('exportTextBtn');
    if (exportTextBtn) exportTextBtn.addEventListener('click', exportText);

    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJson);

    const importJsonInput = document.getElementById('importJson');
    if (importJsonInput) importJsonInput.addEventListener('change', (event) => importJson(event.target.files[0]));
  }

  function bindReviewActions() {
    const card = getCard(selectedCardId);
    if (!card) return;

    const backToSavedBtn = document.getElementById('backToSavedBtn');
    if (backToSavedBtn) backToSavedBtn.addEventListener('click', () => {
      clearFlash();
      view = 'saved';
      render();
    });

    document.querySelectorAll('#drawRespected,#sweepConfirmed,#sweepLedToDol,#fvgFormed,#planFollowed,#outcome,#verificationNotes').forEach((node) => {
      node.addEventListener('change', markReviewDirty);
      node.addEventListener('input', markReviewDirty);
    });

    const loadBtn = document.getElementById('loadBtn');
    if (loadBtn) loadBtn.addEventListener('click', () => {
      f = normaliseFields(card.fields);
      clearFlash();
      step = 0;
      view = 'planner';
      render();
    });

    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) copyBtn.addEventListener('click', () => copyCard(card));

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) saveChangesBtn.addEventListener('click', () => {
      updateCard(card.id, (draft) => ({
        ...draft,
        fields: readReviewFields(card),
        isFinal: false,
        finalSavedAt: ''
      }), 'Changes saved. Card is not final-saved.');
      render();
    });

    const finalSaveBtn = document.getElementById('finalSaveBtn');
    if (finalSaveBtn) finalSaveBtn.addEventListener('click', () => {
      const fields = readReviewFields(card);

      if (fields.outcome === 'Open') {
        setFlash('Select Hit, Miss, or Breakeven before Final save.');
        render();
        return;
      }

      updateCard(card.id, (draft) => ({
        ...draft,
        fields,
        isFinal: true,
        finalSavedAt: new Date().toISOString()
      }), 'Final saved.');
      render();
    });

    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.addEventListener('click', () => {
      if (window.confirm('Delete this saved card?')) deleteCard(card.id);
    });
  }

  function bindActions() {
    bindCommonActions();

    if (view === 'planner') bindPlannerActions();
    if (view === 'saved') bindSavedActions();
    if (view === 'review') bindReviewActions();

    attachNumericCleaners();
  }

  function render() {
    if (view === 'home') app.innerHTML = renderHome();
    if (view === 'planner') app.innerHTML = renderPlanner();
    if (view === 'saved') app.innerHTML = renderSaved();
    if (view === 'review') app.innerHTML = renderReview();
    if (view === 'notes') app.innerHTML = renderNotes();

    bindActions();
  }

  function tick() {
    const clock = document.getElementById('nyClock');
    if (!clock) return;

    clock.innerHTML = `${new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour12: false
    })} <span>NY</span>`;
  }

  window.setInterval(tick, 1000);
  tick();
  render();
}());
