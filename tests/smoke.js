const fs = require('fs');
const vm = require('vm');

const read = p => fs.readFileSync(p, 'utf8');
const ok = (condition, message) => {
  if(!condition) throw Error(message);
};

const index = read('index.html');
const appSource = read('assets/app.js');
const biasSource = read('Legacy/assets/bias-extension.js');
const css = read('assets/styles.css');
const manifest = read('manifest.webmanifest');
const serviceWorker = read('service-worker.js');
const priceServer = read('tools/yfinance_price_server.py');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');

ok(index.includes('ICT DOL Sweep Tracker v0.7.9'), 'index version missing');
ok(!index.includes('assets/bias-extension.js'), 'obsolete bias extension should not be loaded');
ok(index.includes('assets/app.js?v=0.7.9-price-map-visible-20260707'), 'cache-safe app reference missing');
ok(index.includes('assets/styles.css?v=0.7.9-price-map-visible-20260707'), 'cache-safe style reference missing');
ok(index.includes("navigator.serviceWorker.register('./service-worker.js')"), 'service worker registration missing');
ok(appSource.includes("const KEY = 'ict_cards_v078'"), 'storage key missing');
ok(appSource.includes('function normaliseCard'), 'normaliseCard helper missing');
ok(appSource.includes('function dolDistance'), 'dolDistance helper missing');
ok(appSource.includes('function priceMapLevels'), 'price map levels helper missing');
ok(appSource.includes('function priceMapHtml'), 'price map html helper missing');
ok(appSource.includes('Auto-detect price'), 'price auto-detect button missing');
ok(appSource.includes('priceHelperUrl'), 'price helper URL boundary missing');
ok(appSource.includes('function getMetrics'), 'getMetrics helper missing');
ok(appSource.includes('function exportCards'), 'exportCards helper missing');
ok(appSource.includes('function importCards'), 'importCards helper missing');
ok(appSource.includes('favorite'), 'favorite field missing');
ok(appSource.includes('journal'), 'journal field missing');
ok(appSource.includes('risk'), 'risk field missing');
ok(appSource.includes('marketContext'), 'market context field missing');
ok(appSource.includes('Bias Determination For Session'), 'session-scoped bias label missing');
ok(appSource.includes('Before 10:30am NY'), 'pre-10:30 NY warning missing');
ok(appSource.includes('Start new analysis'), 'home action missing');
ok(appSource.includes('function renderShell'), 'app shell renderer missing');
ok(appSource.includes('function renderTabBar'), 'tab bar renderer missing');
ok(appSource.includes('AI Trade Plan Builder'), 'planner screen missing');
ok(appSource.includes('Saved focus cards'), 'saved screen missing');
ok(appSource.includes('Focus card details'), 'focus card details screen missing');
ok(appSource.includes('Execution timeline'), 'timeline screen missing');
ok(appSource.includes('Setup Library'), 'liquidity map screen missing');
ok(appSource.includes('Risk tracker'), 'risk tracker screen missing');
ok(appSource.includes('Trade journal'), 'journal screen missing');
ok(appSource.includes('Trader profile'), 'profile screen missing');
ok(appSource.includes('Final save'), 'final save missing');
ok(appSource.includes('Export JSON'), 'json export missing');
ok(biasSource.includes("VERSION = 'v0.7.9'"), 'bias extension version missing');
ok(biasSource.includes('ict_dol_sweep_export_v7'), 'bias export schema missing');
ok(biasSource.includes('function inject(){') && biasSource.includes('fixVersionLabels();'), 'bias extension compatibility hook missing');
ok(css.includes('.bottom-nav'), 'bottom nav css missing');
ok(css.includes('.price-map'), 'price map ladder css missing');
ok(css.includes('.price-map-current'), 'price map current price divider css missing');
ok(css.includes('.price-map-row.dol'), 'price map DOL row css missing');
ok(css.includes('.price-map-row.sweep'), 'price map sweep row css missing');
ok(css.includes('.price-map-empty'), 'price map empty state css missing');
ok(css.includes('.price-map-loading'), 'price map loading state css missing');
ok(css.includes('.price-map-error'), 'price map error state css missing');
ok(css.includes('font-variant-numeric:tabular-nums'), 'price map tabular numeric styling missing');
ok(readme.includes('## Price Map Ladder'), 'README price map section missing');
ok(readme.includes('CURRENT PRICE divider'), 'README current price divider contract missing');
ok(readme.includes('DOL and Sweep rows'), 'README DOL/Sweep row contract missing');
ok(readme.includes('distance in points and percent'), 'README distance display contract missing');
ok(readme.includes('empty state'), 'README empty state contract missing');
ok(readme.includes('yfinance helper'), 'README yfinance source contract missing');
ok(readme.includes('Planner generated preview') && readme.includes('Focus Card Details'), 'README price map integration contract missing');
ok(changelog.includes('Price Map ladder'), 'changelog price map support entry missing');
const manifestJson = JSON.parse(manifest);
ok(manifestJson.name === 'ICT DOL Sweep Tracker', 'manifest name invalid');
ok(manifestJson.theme_color === '#FAFAF8', 'manifest theme color invalid');
ok(serviceWorker.includes('ict-sweep-tracker-v079-price-map-visible-20260707'), 'service worker cache name missing');
ok(serviceWorker.includes('assets/app.js?v=0.7.9-price-map-visible-20260707'), 'service worker app cache missing');
ok(!serviceWorker.includes('assets/bias-extension.js'), 'service worker should not cache obsolete bias extension');
ok(priceServer.includes('import yfinance as yf'), 'yfinance helper missing');

new vm.Script(appSource, {filename: 'assets/app.js'});
new vm.Script(biasSource, {filename: 'Legacy/assets/bias-extension.js'});
new vm.Script(serviceWorker, {filename: 'service-worker.js'});

function makeStorage(seed){
  const data = Object.assign({}, seed || {});
  return {
    getItem(key){
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value){
      data[key] = String(value);
    },
    removeItem(key){
      delete data[key];
    },
    clear(){
      Object.keys(data).forEach(key => delete data[key]);
    },
    dump(){
      return Object.assign({}, data);
    }
  };
}

function runApp(seed){
  const appNode = {innerHTML: ''};
  const clockNode = {innerHTML: ''};
  const document = {
    body: {
      appendChild(){},
      setAttribute(name, value){ this[name] = value; },
      removeAttribute(name){ delete this[name]; }
    },
    getElementById(id){
      if(id === 'app') return appNode;
      if(id === 'nyClock') return clockNode;
      return null;
    },
    querySelectorAll(){
      return [];
    },
    createElement(){
      return {
        click(){},
        remove(){},
        select(){},
        set href(value){ this._href = value; },
        set download(value){ this._download = value; },
        set value(value){ this._value = value; },
        get value(){ return this._value || ''; }
      };
    },
    execCommand(){
      return true;
    }
  };
  const storage = makeStorage(seed);
  const context = {
    console,
    Date,
    Math,
    JSON,
    String,
    Array,
    Object,
    Promise,
    Blob: function(){},
    URL: {
      createObjectURL(){ return 'blob:test'; },
      revokeObjectURL(){}
    },
    crypto: {
      randomUUID(){ return 'uuid-' + Math.random().toString(16).slice(2); }
    },
    document,
    localStorage: storage,
    navigator: {clipboard: {writeText(){ return Promise.resolve(); }}},
    setInterval(){},
    setTimeout(fn){ fn(); },
    confirm(){ return true; }
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  new vm.Script(appSource, {filename: 'assets/app.js'}).runInContext(context);
  return {context, storage, appNode};
}

const legacyCard = {
  id: 'legacy-1',
  savedAt: '2026-07-01T08:00:00.000Z',
  updatedAt: '2026-07-01T08:10:00.000Z',
  instrument: 'MNQ',
  session: 'New York AM',
  time: '09:30',
  currentPrice: '20000',
  bias: 'Bullish',
  biasValidation: 'Displacement higher after sell-side sweep.',
  biasInvalidation: 'Acceptance below the sweep low.',
  dol1Level: '20,250.25',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  dol1Taken: true,
  dol1Confidence: 'High',
  dol1HitTime: 'NY AM',
  sweep1Level: 'N/A',
  sweep1Draw: 'Relative equal lows (REL)',
  sweep1Tf: '15m',
  sweep1Taken: true,
  sweep1Confidence: 'Medium',
  sweep1HitTime: 'Pre NY',
  fvg: 'true',
  fvgTf: '5m',
  markers: {biasValidated: true, dolRespected: true},
  outcome: 'Hit',
  finalSaved: true,
  verificationNotes: 'Legacy note'
};

const migrated = runApp({
  ict_cards_v077: JSON.stringify([legacyCard])
});
const migratedApi = migrated.context.ICTSweepState;
const migratedCards = migratedApi.getCards();
ok(migratedCards.length === 1, 'legacy card did not migrate');
ok(migrated.storage.getItem('ict_cards_v078'), 'migration did not write current key');
ok(migratedCards[0].fields.bias === 'Bullish', 'bias was not preserved');
ok(migratedCards[0].fields.biasValidation.includes('Displacement'), 'bias validation was not preserved');
ok(migratedCards[0].fields.biasInvalidation.includes('Acceptance'), 'bias invalidation was not preserved');
ok(migratedCards[0].fields.dol1Level === '20.25025', 'price sanitisation changed');
ok(migratedCards[0].fields.dol1Tf === 'Daily', 'DOL timeframe was not preserved');
ok(migratedCards[0].fields.dol1Taken === true, 'DOL taken flag was not preserved');
ok(migratedCards[0].fields.sweep1Tf === '15m', 'sweep timeframe was not preserved');
ok(migratedCards[0].fields.sweep1Taken === true, 'sweep taken flag was not preserved');
ok(migratedCards[0].fields.time === '09:30', 'time was not preserved');
ok(migratedCards[0].fields.currentPrice === '20000', 'current price was not normalised');
ok(migratedCards[0].markers.biasValidated === true, 'bias marker was not preserved');
ok(migratedCards[0].markers.fvgFormed === true, 'fvg marker default missing');
ok(migratedCards[0].favorite === false, 'favorite default invalid');
ok(Array.isArray(migratedCards[0].journal.screenshotRefs), 'journal screenshotRefs default invalid');
ok(Array.isArray(migratedCards[0].journal.tags), 'journal tags default invalid');
ok(migratedCards[0].risk.plannedRiskPct === '', 'risk default invalid');
ok(migratedCards[0].marketContext.Monthly.phase === '', 'legacy market context default invalid');
ok(migratedCards[0].marketContext['15m'].potentialNextPhase === '', 'legacy lower timeframe context default invalid');

const metricsFixture = runApp();
const api = metricsFixture.context.ICTSweepState;
const hit = api.normaliseCard({id: 'hit', fields: {instrument: 'MNQ'}, outcome: 'Hit', finalSaved: true, favorite: true});
const miss = api.normaliseCard({id: 'miss', fields: {instrument: 'ES'}, outcome: 'Miss', finalSaved: true});
const draftMiss = api.normaliseCard({id: 'draft-miss', fields: {instrument: 'NQ'}, outcome: 'Miss', finalSaved: false});
const breakeven = api.normaliseCard({id: 'be', fields: {instrument: 'CL'}, outcome: 'Breakeven', finalSaved: true});
const readOutcome = api.normaliseCard({id: 'read', fields: {instrument: 'GC'}, outcome: 'Read', finalSaved: true});
api.saveCards([hit, miss, draftMiss, breakeven, readOutcome]);
const metrics = api.getMetrics();
ok(metrics.rate === '50%', 'hit rate should only use final Hit/Miss outcomes');
ok(metrics.sample === 2, 'hit/miss sample should exclude Breakeven, Read and drafts');
ok(metrics.be === 1, 'breakeven count invalid');
ok(metrics.needs === 1, 'needs-final count invalid');
ok(metrics.finalSaved === 4, 'final saved count should include Read');
ok(metrics.favorites === 1, 'favorite metric invalid');

const openFinalAttempt = api.normaliseCard({id: 'open-final-attempt', outcome: 'Open', finalSaved: true});
ok(openFinalAttempt.finalSaved === false, 'Open outcome must not normalise as final-saved');

const contextCard = api.normaliseCard({
  id: 'context-card',
  marketContext: {
    Monthly: {phase: 'Consolidation', note: 'Range-bound HTF.', potentialNextPhase: ''},
    Weekly: {phase: 'Expansion', note: 'Delivery already expanded.', potentialNextPhase: 'Retracement'},
    Daily: {phase: 'Invalid', note: 'Bad phase should clear.', potentialNextPhase: 'Expansion'}
  }
});
ok(contextCard.marketContext.Monthly.phase === 'Consolidation', 'monthly phase did not normalize');
ok(contextCard.marketContext.Monthly.potentialNextPhase === 'Expansion', 'monthly potential next phase did not derive');
ok(contextCard.marketContext.Weekly.potentialNextPhase === 'Retracement', 'explicit potential next phase was not preserved');
ok(contextCard.marketContext.Daily.phase === '', 'invalid market phase should clear');
ok(contextCard.marketContext.Daily.note === 'Bad phase should clear.', 'market context note did not preserve');
ok(contextCard.marketContext['4H'].phase === '', 'missing timeframe context default invalid');
ok(api.selectedMarketTimeframes(api.blankMarketContext()).length === 0, 'blank phase map should not force timeframe rows');
ok(api.selectedMarketTimeframes({Daily: {phase: 'Retracement', note: '', potentialNextPhase: ''}}).join(',') === 'Daily', 'phase map should open only populated timeframe rows');

const priceCard = api.normaliseCard({
  id: 'price-card',
  fields: {
    instrument: 'MNQ',
    currentPrice: '20000',
    dol1Level: '20250',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily',
    dol1Taken: true,
    dol1Confidence: 'High',
    dol1HitTime: 'NY AM',
    sweep1Level: '19850',
    sweep1Draw: 'Asia low',
    sweep1Tf: '15m',
    sweep1Taken: false
  }
});
ok(priceCard.fields.currentPrice === '20000', 'current price normalization failed');
ok(priceCard.fields.dol1Confidence === 'High', 'DOL confidence compatibility field was not preserved');
ok(priceCard.fields.dol1HitTime === 'NY AM', 'DOL hit-time compatibility field was not preserved');
ok(priceCard.fields.dol1Tf === 'Daily', 'DOL timeframe normalization failed');
ok(priceCard.fields.dol1Taken === true, 'DOL taken normalization failed');
const distance = api.dolDistance(priceCard.fields.dol1Level, priceCard.fields.currentPrice);
ok(distance.absolute === '250', 'DOL absolute distance invalid');
ok(distance.percent === '1.25%', 'DOL percent distance invalid');
ok(api.dolDistance('N/A', '20000').label === 'Distance: N/A', 'DOL distance should handle N/A safely');
const priceMapLevels = api.priceMapLevels(priceCard.fields);
ok(priceMapLevels.length === 2, 'price map should include numeric DOL and Sweep levels');
ok(priceMapLevels[0].kind === 'DOL' && priceMapLevels[0].distPts === '+250', 'price map DOL row should sort above current price with signed distance');
ok(priceMapLevels[1].kind === 'Sweep' && priceMapLevels[1].distPct === '-0.75%', 'price map sweep row should include signed percent distance');
const priceMapMarkup = api.priceMapHtml(priceCard.fields);
ok(priceMapMarkup.includes('price-map-current') && priceMapMarkup.includes('CURRENT PRICE'), 'price map current divider missing');
ok(priceMapMarkup.includes('price-map-row dol above'), 'price map DOL row class missing');
ok(priceMapMarkup.includes('price-map-row sweep'), 'price map sweep row class missing');
ok(priceMapMarkup.includes('+250 pts · 1.25%'), 'price map distance label missing');
const takenPatch = api.focusDolTakenFields(priceCard, id => ({checked: id === 'focus_dol2Taken'}));
ok(takenPatch.dol1Taken === false && takenPatch.dol2Taken === true && takenPatch.dol3Taken === false, 'focus DOL taken patch did not reflect checkbox states');
const takenUpdated = api.updateCard('hit', {fields: takenPatch});
ok(takenUpdated.fields.dol2Taken === true, 'focus DOL taken patch did not persist');
ok(takenUpdated.fields.instrument === 'MNQ', 'focus DOL taken patch should not replace existing fields');

const updated = api.updateCard('hit', {
  fields: {bias: 'Bearish', biasValidation: 'Buy-side sweep confirmed.'},
  marketContext: {Daily: {phase: 'Retracement', note: 'Corrective delivery.', potentialNextPhase: ''}},
  markers: {biasInvalidated: true},
  journal: {tags: ['review', 'nyam'], lesson: 'Wait for confirmation.'},
  risk: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '$50'}
});
ok(updated.fields.bias === 'Bearish', 'updateCard did not merge fields');
ok(updated.marketContext.Daily.potentialNextPhase === 'Expansion', 'updateCard did not merge market context');
ok(updated.markers.biasInvalidated === true, 'updateCard did not merge markers');
ok(updated.journal.tags.length === 2, 'updateCard did not preserve journal tags');
ok(updated.risk.maxLoss === '$50', 'updateCard did not preserve risk');
ok(api.toggleFavorite('hit').favorite === false, 'toggleFavorite did not flip favorite');
ok(api.deleteCard('draft-miss') === true, 'deleteCard did not report deletion');
ok(!api.getCards().find(card => card.id === 'draft-miss'), 'deleteCard did not remove card');

const exported = api.exportCards();
ok(exported.schema === 'ict_dol_sweep_export_v7', 'export schema invalid');
ok(exported.analytics.sample === 2, 'export analytics invalid');
ok(exported.cards.find(card => card.id === 'hit').journal.lesson === 'Wait for confirmation.', 'export lost journal');
ok(exported.cards.find(card => card.id === 'hit').risk.maxLoss === '$50', 'export lost risk');
ok(exported.cards.find(card => card.id === 'hit').marketContext.Daily.phase === 'Retracement', 'export lost market context');

api.saveCards([]);
const imported = api.importCards(JSON.stringify(exported));
ok(imported.imported === exported.cards.length, 'import count invalid');
const roundTrip = api.getCards().find(card => card.id === 'hit');
ok(roundTrip.fields.bias === 'Bearish', 'import lost bias');
ok(roundTrip.journal.lesson === 'Wait for confirmation.', 'import lost journal lesson');
ok(roundTrip.risk.plannedR === '2R', 'import lost planned R');
ok(roundTrip.marketContext.Daily.potentialNextPhase === 'Expansion', 'import lost market context');
ok(roundTrip.favorite === false, 'import lost favorite state');

const beforeInvalidImportCount = api.getCards().length;
const invalidImport = api.importCards({notCards: true});
ok(invalidImport.imported === 0, 'invalid import payload should not import cards');
ok(api.getCards().length === beforeInvalidImportCount, 'invalid import should not alter saved cards');

const duplicateImport = api.importCards({
  cards: [
    Object.assign({}, roundTrip, {fields: Object.assign({}, roundTrip.fields, {session: 'London'})}),
    api.normaliseCard({id: 'unique-import', fields: {instrument: 'YM'}, outcome: 'Open'})
  ]
});
ok(duplicateImport.imported === 2, 'duplicate import should report incoming card count');
ok(api.getCards().filter(card => card.id === 'hit').length === 1, 'import should deduplicate by id');
ok(api.getCards().find(card => card.id === 'hit').fields.session === 'London', 'duplicate import should keep newest incoming card data');
ok(api.getCards().find(card => card.id === 'unique-import'), 'import should keep unique incoming cards');

const blankDraft = api.createBlankDraft();
ok(blankDraft.outcome === 'Open', 'blank draft outcome invalid');
ok(blankDraft.finalSaved === false, 'blank draft finalSaved invalid');
ok(blankDraft.fields.instrument === '', 'blank draft fields invalid');
ok(Array.isArray(blankDraft.journal.tags), 'blank draft journal invalid');
ok(blankDraft.marketContext.Monthly.phase === '', 'blank draft market context invalid');

const routes = runApp();
const routeApi = routes.context.ICTSweepState;
ok(routes.appNode.innerHTML.includes('ICT Sweep Tracker'), 'home route did not render');
ok(routes.appNode.innerHTML.includes('tab-bar'), 'bottom tab bar did not render');
ok(routes.appNode.innerHTML.includes('Start new analysis'), 'home route action did not render');

routeApi.go('planner');
ok(routes.appNode.innerHTML.includes('AI Trade Plan Builder'), 'planner route did not render');
ok(routes.appNode.innerHTML.includes('Generate Focus Plan'), 'planner CTA did not render');
ok(routes.appNode.innerHTML.includes('Bias Determination For Session'), 'planner session bias label missing');
ok(routes.appNode.innerHTML.includes('Before 10:30am NY'), 'planner pre-10:30 warning missing');
ok(routes.appNode.innerHTML.includes('Market Context'), 'planner market context section missing');
ok(routes.appNode.innerHTML.includes('priceMapPreview'), 'planner standalone price map preview missing');
ok(routes.appNode.innerHTML.includes('Liquidity ladder'), 'planner price map heading missing');
ok(routes.appNode.innerHTML.includes('price-map-empty'), 'planner price map empty state missing');
ok(routes.appNode.innerHTML.includes('marketContextAddTf'), 'planner market context timeframe dropdown missing');
ok(routes.appNode.innerHTML.includes('Choose only the timeframe you want to record'), 'planner optional timeframe guidance missing');
ok(!routes.appNode.innerHTML.includes('ctx_monthly_phase'), 'planner should not force monthly context field by default');
ok(!routes.appNode.innerHTML.includes('ctx_m15_next'), 'planner should not force 15m context field by default');
ok(routes.appNode.innerHTML.includes('currentPrice'), 'planner current price field missing');
ok(routes.appNode.innerHTML.includes('Current price / tool-entry price'), 'planner current price label missing');
ok(routes.appNode.innerHTML.includes('Auto-detect price'), 'planner auto price button missing');
ok(routes.appNode.innerHTML.includes('optional local yfinance helper'), 'planner yfinance helper note missing');
ok(!routes.appNode.innerHTML.includes('DOL confidence'), 'planner DOL confidence should not be emphasized');
ok(routes.appNode.innerHTML.includes('dol1Tf'), 'planner DOL timeframe field missing');
ok(!routes.appNode.innerHTML.includes("id='dol1Taken'"), 'planner should not render DOL taken checkbox');
ok(routes.appNode.innerHTML.includes('DOL taken is confirmed from Focus Card Details'), 'planner DOL taken review hint missing');
ok(routes.appNode.innerHTML.includes('sweep1Tf'), 'planner sweep timeframe field missing');
ok(routes.appNode.innerHTML.includes('Sweep taken'), 'planner sweep taken checkbox missing');
ok(!routes.appNode.innerHTML.includes('Validation of bias'), 'planner should not render validation of bias label');
ok(!routes.appNode.innerHTML.includes('Invalidation of bias'), 'planner should not render invalidation of bias label');
ok(routes.appNode.innerHTML.includes('dol1Level'), 'planner DOL field missing');
ok(routes.appNode.innerHTML.includes('sweep1Level'), 'planner sweep field missing');

const routeCard = routeApi.createBlankDraft({
  id: 'route-card',
  savedAt: '2026-07-07T09:00:00.000Z',
  fields: {
    date: '2026-07-07',
    time: '09:30',
    instrument: 'MNQ',
    session: 'New York AM',
    currentPrice: '20000',
    bias: 'Bullish',
    biasValidation: 'Displacement after sell-side sweep.',
    biasInvalidation: 'Acceptance below low.',
    dol1Level: '20250',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily',
    dol1Taken: true,
    dol1Confidence: 'High',
    dol1HitTime: 'NY AM',
    sweep1Level: '20100',
    sweep1Draw: 'Relative equal lows (REL)',
    sweep1Tf: '15m',
    sweep1Taken: true,
    sweep1Confidence: 'Medium',
    sweep1HitTime: 'Pre NY',
    fvg: true,
    fvgTf: '5m'
  },
  marketContext: {
    Monthly: {phase: 'Consolidation', note: 'Monthly range.', potentialNextPhase: ''},
    Weekly: {phase: 'Expansion', note: 'Weekly delivery.', potentialNextPhase: 'Retracement'},
    Daily: {phase: 'Retracement', note: 'Daily pullback.', potentialNextPhase: ''},
    '4H': {phase: 'Reversal', note: '4H shift observed.', potentialNextPhase: ''},
    '1H': {phase: 'Consolidation', note: '1H balance.', potentialNextPhase: ''},
    '15m': {phase: 'Expansion', note: '15m displacement.', potentialNextPhase: ''}
  },
  markers: {biasValidated: true, dolRespected: true, sweepConfirmed: true},
  outcome: 'Hit',
  finalSaved: true,
  favorite: true,
  notes: 'Route fixture note',
  journal: {tags: ['patient'], lesson: 'Wait for confirmation.'},
  risk: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '$50'}
});
routeApi.saveCards([routeCard]);

routeApi.go('saved');
ok(routes.appNode.innerHTML.includes('Saved Cards'), 'saved route did not render');
ok(routes.appNode.innerHTML.includes('MNQ'), 'saved route did not show card');
ok(routes.appNode.innerHTML.includes('star'), 'saved favorite affordance missing');
ok(routes.appNode.innerHTML.includes('Export JSON'), 'saved export action missing');

routeApi.go('focus', {id: 'route-card'});
ok(routes.appNode.innerHTML.includes('Focus card details'), 'focus route did not render');
ok(routes.appNode.innerHTML.includes('Price snapshot'), 'focus price snapshot missing');
ok(routes.appNode.innerHTML.includes('Current price'), 'focus current price missing');
ok(routes.appNode.innerHTML.includes('Distance: 250 (1.25%)'), 'focus DOL distance missing');
ok(routes.appNode.innerHTML.includes('Timeframe: Daily'), 'focus DOL timeframe missing');
ok(routes.appNode.innerHTML.includes('focus_dol1Taken'), 'focus DOL taken checkbox missing');
ok(routes.appNode.innerHTML.includes('DOL taken'), 'focus DOL taken label missing');
ok(routes.appNode.innerHTML.includes('optional local yfinance helper'), 'focus price source note missing');
ok(routes.appNode.innerHTML.includes('Market Context'), 'focus market context section missing');
ok(routes.appNode.innerHTML.includes('Monthly range.'), 'focus market context note missing');
ok(routes.appNode.innerHTML.includes('Potential next phase: Expansion'), 'focus potential next phase missing');
ok(routes.appNode.innerHTML.includes('Bias Determination For Session only'), 'focus session bias warning missing');
ok(!routes.appNode.innerHTML.includes('Displacement after sell-side sweep.'), 'focus should not render legacy validation data');
ok(!routes.appNode.innerHTML.includes('Acceptance below low.'), 'focus should not render legacy invalidation data');
ok(!routes.appNode.innerHTML.includes('Bias validated'), 'focus should not render bias validated marker');
ok(!routes.appNode.innerHTML.includes('Bias invalidated'), 'focus should not render bias invalidated marker');
ok(routes.appNode.innerHTML.includes('Final save'), 'focus final save action missing');
ok(routes.appNode.innerHTML.includes('journalLesson'), 'focus journal field missing');
ok(routes.appNode.innerHTML.includes('riskPct'), 'focus risk field missing');

routeApi.go('timeline', {id: 'route-card'});
ok(routes.appNode.innerHTML.includes('Execution timeline'), 'timeline route did not render');
ok(routes.appNode.innerHTML.includes('Session bias'), 'timeline session bias step missing');
ok(routes.appNode.innerHTML.includes('Market context'), 'timeline market context step missing');

routeApi.go('liquidity-map');
ok(routes.appNode.innerHTML.includes('Setup Library'), 'liquidity map route did not render');
ok(routes.appNode.innerHTML.includes('Add to plan'), 'liquidity add-to-plan action missing');

routeApi.go('risk');
ok(routes.appNode.innerHTML.includes('Risk tracker'), 'risk route did not render');
ok(routes.appNode.innerHTML.includes('Plan followed'), 'risk review row missing');

routeApi.go('journal');
ok(routes.appNode.innerHTML.includes('Journal'), 'journal route did not render');
ok(routes.appNode.innerHTML.includes('Wait for confirmation.'), 'journal lesson missing');

routeApi.go('profile');
ok(routes.appNode.innerHTML.includes('Profile'), 'profile route did not render');
ok(routes.appNode.innerHTML.includes('Clear all local data'), 'profile clear action missing');

routeApi.toggleFavorite('route-card');
ok(routeApi.getCards()[0].favorite === false, 'route favorite flow failed');

console.log('Smoke test passed.');
