(function(){
  'use strict';

  const VERSION = 'v0.7.9';
  const CARD_KEY = 'ict_cards_v078';
  const STATE_KEY = 'ict_bias_current_v1';
  const META_KEY = 'ict_bias_card_meta_v1';
  const APPLY_KEY = 'ict_bias_apply_next_save_v1';
  const NL = String.fromCharCode(10);

  const validationTemplates = {
    Bullish: 'Sell-side liquidity raid below an old low, then rejection/displacement higher toward buy-side liquidity.',
    Bearish: 'Buy-side liquidity raid above an old high, then rejection/displacement lower toward sell-side liquidity.'
  };

  const invalidationTemplates = {
    Bullish: 'Price accepts below the raid low / keeps expanding lower instead of showing a stop run and reversal.',
    Bearish: 'Price accepts above the raid high / keeps expanding higher instead of showing a stop run and reversal.'
  };

  const biasRead = {
    Bullish: 'Bullish read: seek sell-side liquidity below an old low, rejection/displacement higher, then delivery toward buy-side liquidity.',
    Bearish: 'Bearish read: seek buy-side liquidity above an old high, rejection/displacement lower, then delivery toward sell-side liquidity.'
  };

  function parse(v,d){ try { return JSON.parse(v); } catch(e) { return d; } }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function state(){ return parse(sessionStorage.getItem(STATE_KEY) || '{}', {}); }
  function setState(s){ sessionStorage.setItem(STATE_KEY, JSON.stringify(s || {})); }
  function meta(){ return parse(localStorage.getItem(META_KEY) || '{}', {}); }
  function setMeta(m){ localStorage.setItem(META_KEY, JSON.stringify(m || {})); }
  function cards(){ return parse(localStorage.getItem(CARD_KEY) || '[]', []); }
  function hasBias(s){ return !!(s && (s.bias || s.biasValidation || s.biasInvalidation)); }

  function currentReviewId(){
    const explicit = document.body.getAttribute('data-ict-review-id');
    if(explicit) return explicit;
    const title = document.querySelector('.btn-row-between h2');
    const saved = document.querySelector('.focus-output .line:nth-last-child(2) .v');
    const name = title ? title.textContent.trim() : '';
    const savedText = saved ? saved.textContent.trim() : '';
    const all = cards();
    let found = all.find(c => c && c.fields && (c.fields.instrument || 'No instrument') === name && savedText && new Date(c.savedAt).toLocaleString() === savedText);
    if(!found) found = all.find(c => c && c.fields && (c.fields.instrument || 'No instrument') === name);
    return found ? found.id : '';
  }

  function enrichCard(card, extra){
    if(!card || !card.id) return card;
    const allMeta = meta();
    const saved = allMeta[card.id] || {};
    const next = Object.assign({}, saved, extra || {});
    if(hasBias(next)){
      card.fields = card.fields || {};
      card.fields.bias = next.bias || '';
      card.fields.biasValidation = next.biasValidation || '';
      card.fields.biasInvalidation = next.biasInvalidation || '';
      card.markers = Object.assign({}, card.markers || {}, {
        biasValidated: !!next.biasValidated,
        biasInvalidated: !!next.biasInvalidated
      });
      allMeta[card.id] = next;
      setMeta(allMeta);
    }
    return card;
  }

  const nativeSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value){
    if(this === localStorage && key === CARD_KEY){
      let data = parse(value, null);
      if(Array.isArray(data)){
        const apply = sessionStorage.getItem(APPLY_KEY) === '1';
        const s = state();
        data = data.map((card, idx) => enrichCard(card, apply && idx === 0 ? s : null));
        if(apply) sessionStorage.removeItem(APPLY_KEY);
        value = JSON.stringify(data);
      }
    }
    return nativeSetItem.call(this, key, value);
  };

  function line(k,v){
    return `<div class="line ict-bias-line"><div class="k">${esc(k)}</div><div class="v">${v ? esc(v) : '<span class="empty">—</span>'}</div></div>`;
  }

  function biasPanelHtml(){
    const s = state();
    const b = s.bias || '';
    return `<div class="panel" id="ictBiasPanel">
      <div class="progress">Bias thesis</div>
      <h3>Bias · validation · invalidation</h3>
      <p class="sub">Define the HTF predisposition before mapping liquidity. This keeps the sweep tied to a clear bullish or bearish thesis.</p>
      <div class="grid">
        <div>
          <label class="label" for="bias">Bias</label>
          <select class="in" id="bias">
            <option value="">— bullish or bearish —</option>
            <option value="Bullish"${b === 'Bullish' ? ' selected' : ''}>Bullish</option>
            <option value="Bearish"${b === 'Bearish' ? ' selected' : ''}>Bearish</option>
          </select>
        </div>
        <div>
          <label class="label">ICT read</label>
          <div class="focus-output">${line('Framework', biasRead[b] || 'Select a bias to load the ICT read')}</div>
        </div>
      </div>
      <label class="label" for="biasValidation">Validation of bias</label>
      <textarea class="in" id="biasValidation" placeholder="${esc(b ? validationTemplates[b] : 'What price action confirms the bias?')}">${esc(s.biasValidation || '')}</textarea>
      <label class="label" for="biasInvalidation">Invalidation of bias</label>
      <textarea class="in" id="biasInvalidation" placeholder="${esc(b ? invalidationTemplates[b] : 'What price action invalidates the bias?')}">${esc(s.biasInvalidation || '')}</textarea>
    </div>`;
  }

  function readBiasInputs(){
    const b = document.getElementById('bias');
    const v = document.getElementById('biasValidation');
    const i = document.getElementById('biasInvalidation');
    if(!b && !v && !i) return state();
    const old = state();
    const next = {
      bias: b ? b.value : old.bias || '',
      biasValidation: v ? v.value.trim() : old.biasValidation || '',
      biasInvalidation: i ? i.value.trim() : old.biasInvalidation || ''
    };
    if(next.bias && next.bias !== old.bias){
      if(!next.biasValidation || next.biasValidation === validationTemplates[old.bias]) next.biasValidation = validationTemplates[next.bias];
      if(!next.biasInvalidation || next.biasInvalidation === invalidationTemplates[old.bias]) next.biasInvalidation = invalidationTemplates[next.bias];
    }
    setState(next);
    return next;
  }

  function attachBiasHandlers(){
    ['bias','biasValidation','biasInvalidation'].forEach(id => {
      const el = document.getElementById(id);
      if(el && !el.dataset.ictBiasBound){
        el.dataset.ictBiasBound = '1';
        const ev = id === 'bias' ? 'change' : 'input';
        el.addEventListener(ev, () => {
          readBiasInputs();
          if(id === 'bias') renderSoon();
        });
      }
    });
  }

  function renderSoon(){ setTimeout(inject, 0); }

  function injectPlanner(){
    if(window.ICTSweepState) return;
    const h2 = document.querySelector('.screen h2');
    if(!h2 || h2.textContent.indexOf('Choose the instrument') === -1) return;
    if(document.getElementById('ictBiasPanel')) return;
    const card = h2.closest('.card');
    if(card) card.insertAdjacentHTML('beforeend', biasPanelHtml());
  }

  function injectReviewSummary(){
    if(window.ICTSweepState) return;
    const h2 = document.querySelector('.screen h2, .btn-row-between h2');
    const output = document.querySelector('.focus-output');
    if(!h2 || !output || document.getElementById('ictBiasSummary') || document.querySelector('[data-core-bias-summary]')) return;
    const isReview = h2.textContent.indexOf('Review focus card') !== -1 || document.querySelector('#reviewOutcome');
    if(!isReview) return;
    let s = state();
    const id = currentReviewId();
    if(id){
      const m = meta()[id];
      if(hasBias(m)) s = m;
    }
    if(!hasBias(s)) return;
    output.insertAdjacentHTML('afterbegin', `<div id="ictBiasSummary">${line('Bias', s.bias)}${line('Bias read', biasRead[s.bias] || '')}${line('Validation', s.biasValidation)}${line('Invalidation', s.biasInvalidation)}</div>`);
  }

  function injectReviewMarkers(){
    if(window.ICTSweepState) return;
    if(!document.getElementById('reviewOutcome') || document.getElementById('mark_biasValidated')) return;
    const grid = document.querySelector('.review-grid');
    if(!grid) return;
    const id = currentReviewId();
    const m = id ? meta()[id] || {} : {};
    grid.insertAdjacentHTML('afterbegin',
      `<label class="check-row"><input type="checkbox" id="mark_biasValidated"${m.biasValidated ? ' checked' : ''}> <span>Bias validated</span></label>
       <label class="check-row"><input type="checkbox" id="mark_biasInvalidated"${m.biasInvalidated ? ' checked' : ''}> <span>Bias invalidated</span></label>`);
  }

  function injectSavedRows(){
    const allMeta = meta();
    document.querySelectorAll('[data-open-card]').forEach(row => {
      const id = row.getAttribute('data-open-card');
      const m = allMeta[id];
      if(!hasBias(m) || row.querySelector('.ict-bias-preview')) return;
      const cls = m.bias === 'Bullish' ? 'ok' : 'bad';
      const head = row.querySelector('.status-row');
      if(head) head.insertAdjacentHTML('afterbegin', `<span class="pill ${cls} ict-bias-preview">${esc(m.bias)}</span>`);
      const prev = row.querySelector('.saved-preview');
      if(prev) prev.insertAdjacentHTML('afterbegin', `<span class="ict-bias-preview">${esc(m.bias)} bias</span>${NL}`);
    });
  }

  function wireSaveButtons(){
    const next = document.getElementById('nextBtn');
    if(next && !next.dataset.ictBiasSave){
      next.dataset.ictBiasSave = '1';
      next.addEventListener('click', () => {
        if(next.textContent.trim() === 'Save card'){
          readBiasInputs();
          sessionStorage.setItem(APPLY_KEY, '1');
        }
      }, true);
    }

    ['saveChangesBtn','finalSaveBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if(!btn || btn.dataset.ictBiasReviewSave) return;
      btn.dataset.ictBiasReviewSave = '1';
      btn.addEventListener('click', () => {
        const cardId = currentReviewId();
        if(!cardId) return;
        const allMeta = meta();
        const current = allMeta[cardId] || {};
        allMeta[cardId] = Object.assign({}, current, {
          biasValidated: !!(document.getElementById('mark_biasValidated') && document.getElementById('mark_biasValidated').checked),
          biasInvalidated: !!(document.getElementById('mark_biasInvalidated') && document.getElementById('mark_biasInvalidated').checked)
        });
        setMeta(allMeta);
      }, true);
    });

    const load = document.getElementById('loadBtn');
    if(load && !load.dataset.ictBiasLoad){
      load.dataset.ictBiasLoad = '1';
      load.addEventListener('click', () => {
        const id = currentReviewId();
        const m = id ? meta()[id] : null;
        if(hasBias(m)) setState(m);
      }, true);
    }
  }

  function wireExports(){
    const jsonBtn = document.getElementById('exportJsonBtn');
    if(jsonBtn && !jsonBtn.dataset.ictBiasExport){
      jsonBtn.dataset.ictBiasExport = '1';
      jsonBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const enriched = cards().map(card => enrichCard(card));
        const blob = new Blob([JSON.stringify({
          schema: 'ict_dol_sweep_export_v7',
          version: VERSION,
          exportedAt: new Date().toISOString(),
          cards: enriched
        }, null, 2)], {type: 'application/json'});
        download(blob, 'ict-dol-sweep-cards.json');
      }, true);
    }
  }

  function download(blob, name){
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(u);
  }

  function fixVersionLabels(){
    document.querySelectorAll('.progress,.footer').forEach(el => {
      if(el.textContent.indexOf('v0.7.8') !== -1) el.textContent = el.textContent.replace('v0.7.8', VERSION);
    });
  }

  function inject(){
    fixVersionLabels();
  }

  const target = document.getElementById('app');
  if(target){
    new MutationObserver(inject).observe(target, {childList: true, subtree: true});
  }
  document.addEventListener('DOMContentLoaded', inject);
  setInterval(inject, 500);
  inject();
})();
