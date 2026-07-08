const fs = require('fs');
const vm = require('vm');

const read = p => fs.readFileSync(p, 'utf8');
const ok = (condition, message) => {
  if(!condition) throw Error(message);
};
const match = (source, pattern, message) => {
  const found = source.match(pattern);
  ok(found, message);
  return found;
};

const index = read('index.html');
const configSource = read('assets/config.js');
const appSource = read('assets/app.js');
const biasSource = read('Legacy/assets/bias-extension.js');
const css = read('assets/styles.css');
const manifest = read('manifest.webmanifest');
const serviceWorker = read('service-worker.js');
const priceApi = read('api/price.py');
const requirements = read('requirements.txt');
const vercelConfig = read('vercel.json');
const pagesWorkflow = read('.github/workflows/pages.yml');
const e2eWorkflow = read('.github/workflows/e2e.yml');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const bumpVersionScript = read('tools/bump-version.js');
const license = read('LICENSE');
const packageJson = JSON.parse(read('package.json'));
const playwrightConfig = read('playwright.config.js');
const e2eTest = read('tests/e2e/planner.spec.js');

const appVersion = match(appSource, /const VERSION = '([^']+)'/, 'app version constant missing')[1];
const appVersionNumber = appVersion.replace(/^v/, '');
const configAsset = match(index, /<script src="([^"]*assets\/config\.js\?v=[^"]+)"><\/script>/, 'cache-safe config reference missing')[1];
const appAsset = match(index, /<script src="([^"]*assets\/app\.js\?v=[^"]+)"><\/script>/, 'cache-safe app reference missing')[1];
const styleAsset = match(index, /<link rel="stylesheet" href="([^"]*assets\/styles\.css\?v=[^"]+)">/, 'cache-safe style reference missing')[1];
const cacheName = match(serviceWorker, /const CACHE_NAME = '([^']+)'/, 'service worker cache name missing')[1];
const hostedPriceApiBase = match(configSource, /hostedPriceApiBase: '([^']+)'/, 'hosted price API base missing')[1];
const hostedPriceUrl = new URL(hostedPriceApiBase);

ok(appVersion.startsWith('v0.8.'), 'app version should be v0.8.x');
ok(index.includes(`<title>ICT DOL Sweep Tracker ${appVersion}</title>`), 'index title version missing');
ok(index.includes(`ICT DOL Sweep Tracker ${appVersion} · Educational planning tool only. Not financial advice.`), 'index footer version missing');
ok(!index.includes('assets/bias-extension.js'), 'obsolete bias extension should not be loaded');
ok(configAsset.includes(`v=${appVersionNumber}`), 'config asset cache key should include app version');
ok(appAsset.includes(`v=${appVersionNumber}`), 'app asset cache key should include app version');
ok(styleAsset.includes(`v=${appVersionNumber}`), 'style asset cache key should include app version');
ok(index.indexOf(configAsset) < index.indexOf(appAsset), 'runtime config should load before app bundle');
ok(serviceWorker.includes(`'./${configAsset}'`), 'service worker config cache does not match index');
ok(serviceWorker.includes(`'./${appAsset}'`), 'service worker app cache does not match index');
ok(serviceWorker.includes(`'./${styleAsset}'`), 'service worker style cache does not match index');
ok(cacheName.includes(appVersionNumber.replaceAll('.', '')), 'service worker cache name should include app version');
ok(index.includes('rel="manifest" href="manifest.webmanifest"'), 'manifest link missing from index');
ok(index.includes('href="favicon.svg"'), 'favicon link missing');
ok(index.includes("navigator.serviceWorker.register('./service-worker.js')"), 'service worker registration missing');
ok(appSource.includes("const KEY = 'ict_cards_v078'"), 'storage key missing');
ok(appSource.includes('function normaliseCard'), 'normaliseCard helper missing');
ok(appSource.includes('function dolDistance'), 'dolDistance helper missing');
ok(appSource.includes('function priceMapLevels'), 'price map levels helper missing');
ok(appSource.includes('function priceMapHtml'), 'price map html helper missing');
ok(appSource.includes('function nyTimestamp'), 'NY timestamp helper missing');
ok(appSource.includes('function nyDateInput'), 'NY date helper missing');
ok(appSource.includes('function nyTimeInput'), 'NY time helper missing');
ok(appSource.includes('function activeDol'), 'active DOL helper missing');
ok(appSource.includes('function calculateRiskPlan'), 'risk-to-reward helper missing');
ok(appSource.includes('function routeEvidenceHtml'), 'route evidence UI missing');
ok(appSource.includes('PRICE_DELAY_DISCLAIMER'), 'price delay disclaimer missing');
ok(appSource.includes('Auto-detect price'), 'price auto-detect button missing');
ok(appSource.includes('root.ICT_CONFIG'), 'app should read runtime config');
ok(configSource.includes('localPriceApiBase'), 'local price API config missing');
ok(configSource.includes('priceTimeoutMs') && configSource.includes('priceRefreshSeconds'), 'price runtime tuning config missing');
ok(hostedPriceUrl.pathname === '/api/price', 'default hosted price API URL invalid');
ok(appSource.includes("root.location.origin") && appSource.includes("/api/price"), 'same-origin Vercel price API fallback missing');
ok(appSource.includes('priceHelperUrl'), 'price helper URL boundary missing');
ok(appSource.includes('localPriceHelperUrl'), 'local price helper fallback missing');
ok(appSource.includes('function cleanUrl'), 'URL sanitizer missing');
ok(appSource.includes('priceHistoryEvent === false'), 'metadata-only update price-history guard missing');
ok(appSource.includes('fetchJsonWithTimeout'), 'price API timeout helper missing');
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
ok(appSource.includes('ROUTES.includes(routeName)'), 'hash router should ignore non-route anchors');
ok(appSource.includes('component-gallery'), 'component gallery route missing');
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
ok(/const VERSION = 'v0\.[0-9.]+'/.test(biasSource), 'bias extension version missing');
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
ok(css.includes('.price-map-live.pending'), 'price map pending state css missing');
ok(css.includes('font-variant-numeric:tabular-nums'), 'price map tabular numeric styling missing');
ok(css.includes('.audit-strip'), 'audit strip css missing');
ok(css.includes('.snapshot-card'), 'snapshot card css missing');
ok(css.includes('.override-panel'), 'override panel css missing');
ok(css.includes('.price-history-compact'), 'compact price history css missing');
ok(css.includes('.draft-state'), 'visible draft-state styling missing');
ok(css.includes('.skip-link'), 'skip link styling missing');
ok(css.includes('.price-validation'), 'price validation styling missing');
ok(readme.includes('## Price Map Ladder'), 'README price map section missing');
ok(readme.includes('CURRENT PRICE divider'), 'README current price divider contract missing');
ok(readme.includes('DOL and Sweep rows'), 'README DOL/Sweep row contract missing');
ok(readme.includes('distance in points and percent'), 'README distance display contract missing');
ok(readme.includes('empty state'), 'README empty state contract missing');
ok(readme.includes('## Hosted Price API'), 'README hosted price API section missing');
ok(readme.includes('Vercel Python Function'), 'README Vercel API contract missing');
ok(readme.includes('window.ICT_PRICE_API_BASE'), 'README price API override missing');
ok(readme.includes('Planner generated preview') && readme.includes('Focus Card Details'), 'README price map integration contract missing');
ok(changelog.includes('Price Map ladder'), 'changelog price map support entry missing');
ok(license.includes('MIT License') && license.includes('WITHOUT WARRANTY'), 'MIT license file missing expected terms');
const manifestJson = JSON.parse(manifest);
ok(manifestJson.name === 'ICT DOL Sweep Tracker', 'manifest name invalid');
ok(manifestJson.theme_color === '#FAFAF8', 'manifest theme color invalid');
ok(manifestJson.scope === './', 'manifest scope missing');
ok(Array.isArray(manifestJson.icons), 'manifest icons missing');
ok(manifestJson.icons.some(icon => icon.src === 'icon-192.svg' && icon.sizes === '192x192' && icon.purpose.includes('maskable')), 'manifest 192 maskable icon missing');
ok(manifestJson.icons.some(icon => icon.src === 'icon-512.svg' && icon.sizes === '512x512' && icon.purpose.includes('maskable')), 'manifest 512 maskable icon missing');
ok(serviceWorker.includes('./favicon.svg'), 'service worker favicon cache missing');
ok(serviceWorker.includes('./icon-192.svg') && serviceWorker.includes('./icon-512.svg'), 'service worker app icons cache missing');
ok(serviceWorker.includes("url.pathname.startsWith('/api/')"), 'service worker should bypass API requests');
ok(serviceWorker.includes("event.request.mode === 'navigate'"), 'service worker should network-first navigations');
ok(serviceWorker.includes('Response.error()'), 'service worker should fail missing asset requests instead of returning HTML');
ok(!/cached => cached \|\| fetch\(event\.request\)[\s\S]*?caches\.match\('\.\/index\.html'\)/.test(serviceWorker), 'service worker should not use index fallback for non-navigation assets');
ok(!serviceWorker.includes('assets/bias-extension.js'), 'service worker should not cache obsolete bias extension');
ok(priceApi.includes('class handler(BaseHTTPRequestHandler)'), 'Vercel Python handler missing');
ok(priceApi.includes('STATIC_FILES'), 'Vercel static-file serving missing');
ok(priceApi.includes('"/favicon.svg"') && priceApi.includes('"/icon-192.svg"') && priceApi.includes('"/icon-512.svg"'), 'Vercel static-file icon serving missing');
ok(priceApi.includes('def send_static'), 'Vercel static handler missing');
ok(priceApi.includes('ALLOWED_ORIGINS'), 'price API CORS allow-list missing');
ok(priceApi.includes(`"${hostedPriceUrl.origin}"`), 'price API Vercel origin missing');
ok(readme.includes('https://ict-2mrz.vercel.app'), 'README CORS allow-list should include legacy Vercel deployment');
ok(priceApi.includes('CACHE_TTL_SECONDS = 30'), 'price API cache TTL missing');
ok(priceApi.includes('"MNQ": "MNQ=F"') && priceApi.includes('"M2K": "M2K=F"'), 'price API futures aliases missing');
ok(priceApi.includes('"EURUSD": "EURUSD=X"') && priceApi.includes('"GBPUSD": "GBPUSD=X"'), 'price API FX aliases missing');
ok(priceApi.includes('import yfinance as yf'), 'price API yfinance import missing');
ok(priceApi.includes('"source": "yfinance"'), 'price API source response missing');
ok(priceApi.includes('"price provider unavailable"'), 'price API should use a generic provider error');
ok(!priceApi.includes('str(exc)'), 'price API should not expose raw provider exceptions');
ok(requirements.includes('yfinance=='), 'requirements should pin yfinance');
const parsedVercelConfig = JSON.parse(vercelConfig);
ok(parsedVercelConfig.framework === null, 'vercel framework should be disabled');
ok(parsedVercelConfig.outputDirectory === '_site', 'vercel output directory invalid');
ok(parsedVercelConfig.buildCommand.includes('cp index.html') && parsedVercelConfig.buildCommand.includes('favicon.svg') && parsedVercelConfig.buildCommand.includes('icon-192.svg') && parsedVercelConfig.buildCommand.includes('icon-512.svg') && parsedVercelConfig.buildCommand.includes('assets/config.js') && parsedVercelConfig.buildCommand.includes('_site/assets'), 'vercel static build command invalid');
ok(pagesWorkflow.includes('icon-192.svg') && pagesWorkflow.includes('icon-512.svg'), 'GitHub Pages workflow should copy app icons');
ok(bumpVersionScript.includes('config') && bumpVersionScript.includes('service-worker.js') && bumpVersionScript.includes('README.md'), 'version bump script should update cache and docs targets');
ok(packageJson.scripts.test === 'node tests/smoke.js', 'npm test should run smoke suite');
ok(packageJson.scripts['test:e2e'] === 'playwright test', 'npm test:e2e should run Playwright');
ok(playwrightConfig.includes('mobile-chrome') && playwrightConfig.includes('python3 -m http.server 4173'), 'Playwright config should cover mobile and static server');
ok(e2eTest.includes('planner creates a focus card') && e2eTest.includes('planner skip link') && e2eTest.includes('home session chips'), 'E2E tests should cover planner, skip link and Home filters');
ok(e2eWorkflow.includes('npm ci') && e2eWorkflow.includes('playwright install --with-deps chromium'), 'E2E workflow should install dependencies and Chromium');

new vm.Script(configSource, {filename: 'assets/config.js'});
new vm.Script(appSource, {filename: 'assets/app.js'});
new vm.Script(biasSource, {filename: 'Legacy/assets/bias-extension.js'});
new vm.Script(serviceWorker, {filename: 'service-worker.js'});
new vm.Script(bumpVersionScript, {filename: 'tools/bump-version.js'});

function makeStorage(seed, options){
  const data = Object.assign({}, seed || {});
  let failWrites = !!(options && options.failWrites);
  return {
    getItem(key){
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value){
      if(failWrites) throw Error('quota exceeded');
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
    },
    setFailWrites(value){
      failWrites = !!value;
    }
  };
}

function runApp(seed, options){
  const runOptions = options || {};
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
  const storage = makeStorage(seed, runOptions);
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
    location: runOptions.location,
    history: runOptions.history,
    navigator: {clipboard: {writeText(){ return Promise.resolve(); }}},
    setInterval(){},
    setTimeout(fn){ fn(); },
    confirm(){ return true; }
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  new vm.Script(configSource, {filename: 'assets/config.js'}).runInContext(context);
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
ok(migratedCards[0].fields.dol1Level === '20250.25', 'price sanitisation changed');
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
ok(migratedCards[0].createdAtNy.includes('NY'), 'legacy card should receive NY created timestamp');
ok(migratedCards[0].updatedAtNy.includes('NY'), 'legacy card should receive NY updated timestamp');
ok(migratedCards[0].priceSnapshot.price === '20000', 'legacy card price snapshot invalid');
ok(migratedCards[0].priceHistory.length >= 1, 'legacy card price history missing');
ok(migratedCards[0].activeDolId === 'dol1', 'legacy card active DOL should default to first DOL');

const metricsFixture = runApp();
const api = metricsFixture.context.ICTSweepState;
ok(api.cleanUrl(hostedPriceApiBase + '/') === hostedPriceApiBase + '/', 'cleanUrl should preserve URLs');
metricsFixture.context.location = {hostname: hostedPriceUrl.hostname, origin: hostedPriceUrl.origin};
ok(api.priceApiBase() === hostedPriceUrl.origin + '/api/price', 'same-origin Vercel price API URL invalid');
ok(api.priceHelperUrl('MNQ') === hostedPriceUrl.origin + '/api/price?symbol=MNQ', 'price helper URL should not be numerically sanitized');
metricsFixture.context.ICT_PRICE_API_BASE = 'https://example.vercel.app/api/price/';
ok(api.priceApiBase() === 'https://example.vercel.app/api/price', 'configured price API URL should be preserved');
delete metricsFixture.context.ICT_PRICE_API_BASE;
ok(api.priceHelperUrls('MNQ').includes(api.localPriceHelperUrl('MNQ')), 'price helper URLs should include local fallback without network access');
ok(api.priceHelperUrl('MNQ U4').endsWith('?symbol=MNQ%20U4'), 'price helper URL should encode symbols');
ok(api.priceNumber('20123.50') === 20123.5, 'plain decimal price should parse');
ok(api.priceNumber('20,123.50') === 20123.5, 'comma thousands price should parse without changing meaning');
ok(api.priceNumber('N/A') === null, 'N/A price should not parse as numeric');
ok(api.priceNumber('-1') === null, 'negative market price should be rejected');
ok(api.priceNumber('0') === null, 'zero market price should be rejected');
ok(api.priceNumber('1e3') === null, 'scientific notation price should be rejected');
ok(api.priceNumber('1.2.3') === null, 'multiple-decimal price should be rejected');
ok(api.priceNumber('20,123,50') === null, 'ambiguous comma price should be rejected');
const priceValidation = api.priceValidationMessages({
  currentPrice: '0',
  dol1Level: '0',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  sweep1Level: '-10',
  sweep1Draw: 'Asia low',
  sweep1Tf: '15m'
});
ok(priceValidation.some(message => message.includes('Current price')), 'price validation should flag zero current price');
ok(priceValidation.some(message => message.includes('DOL 1')), 'price validation should identify zero objective levels');
const optionalSweepCompletion = api.comp({
  instrument: 'MNQ',
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  sweep1Level: '20100',
  sweep1Draw: 'Relative equal lows (REL)',
  sweep1Tf: '15m',
  sweep1Taken: false
});
ok(optionalSweepCompletion.ok === true, 'sweep confidence and hit time should not block completion');
const partialSweepCompletion = api.comp({
  instrument: 'MNQ',
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  sweep1Level: '20100',
  sweep1Draw: 'Relative equal lows (REL)'
});
ok(partialSweepCompletion.ok === false && partialSweepCompletion.sweep.part === 1, 'partial sweep records should keep card in draft status');

const settingsFixture = runApp();
const settingsApi = settingsFixture.context.ICTSweepState;
const savedSettings = settingsApi.saveSettings({
  defaultInstrument: 'NQ',
  defaultSession: 'New York AM',
  theme: 'dark',
  watchlist: 'MNQ, ES, GC',
  riskDefaults: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '150'}
});
ok(savedSettings.defaultInstrument === 'NQ', 'default instrument setting did not save');
ok(savedSettings.defaultSession === 'New York AM', 'default session setting did not save');
ok(savedSettings.theme === 'dark', 'theme setting did not save');
ok(savedSettings.watchlist.join(',') === 'MNQ,ES,GC', 'watchlist setting did not normalise');
ok(savedSettings.riskDefaults.plannedRiskPct === '0.5', 'risk default percent did not save');
const reloadedSettingsFixture = runApp(settingsFixture.storage.dump());
const reloadedSettingsApi = reloadedSettingsFixture.context.ICTSweepState;
const reloadedSettings = reloadedSettingsApi.getSettings();
ok(reloadedSettings.defaultInstrument === 'NQ', 'default instrument setting did not persist');
ok(reloadedSettings.defaultSession === 'New York AM', 'default session setting did not persist');
ok(reloadedSettings.theme === 'dark', 'theme setting did not persist');
ok(reloadedSettings.watchlist.length === 3 && reloadedSettings.watchlist[2] === 'GC', 'watchlist setting did not persist');
ok(reloadedSettings.riskDefaults.plannedRiskPct === '0.5' && reloadedSettings.riskDefaults.plannedR === '2R' && reloadedSettings.riskDefaults.maxLoss === '150', 'risk defaults did not persist');
reloadedSettingsApi.go('profile');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultInstrument' value='NQ'"), 'profile did not render saved default instrument');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultRiskPct' value='0.5'"), 'profile did not render saved risk percent');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultPlannedR' value='2R'"), 'profile did not render saved planned R');
reloadedSettingsApi.go('risk');
ok(reloadedSettingsFixture.appNode.innerHTML.includes('Planned risk') && reloadedSettingsFixture.appNode.innerHTML.includes('<h2>0.5</h2>'), 'risk route did not reflect saved risk default');
reloadedSettingsApi.go('planner', {new: true});
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='instrument'") && reloadedSettingsFixture.appNode.innerHTML.includes("value='NQ'"), 'new planner draft did not inherit default instrument');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("<option value='New York AM' selected>New York AM</option>"), 'new planner draft did not inherit default session');
ok(reloadedSettingsApi.draftState().message.includes('Autosaved locally'), 'planner should expose autosaved draft state');
ok(!!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'planner draft autosave was not stored');
reloadedSettingsApi.clearPlannerDraft();
ok(!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'clearPlannerDraft should remove stored planner draft');
ok(reloadedSettingsApi.draftState().message === 'Draft discarded.', 'clearPlannerDraft should expose discarded state');
reloadedSettingsApi.go('planner', {new: true});
ok(!!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'new planner draft should autosave defaults before discard');
reloadedSettingsApi.discardPlannerDraft();
reloadedSettingsApi.go('home');
ok(!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'discarded planner draft should not be recreated by default profile values');
const riskDefaultDraft = reloadedSettingsApi.createBlankDraft({
  fields: {
    instrument: 'NQ',
    session: 'New York AM',
    currentPrice: '20000',
    dol1Level: '20200',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily'
  }
});
ok(riskDefaultDraft.risk.plannedRiskPct === '0.5', 'new focus cards should inherit default risk percent');
ok(riskDefaultDraft.risk.plannedR === '2R', 'new focus cards should inherit default planned R');
ok(riskDefaultDraft.risk.maxLoss === '150', 'new focus cards should inherit default max loss');
const explicitRiskCard = reloadedSettingsApi.normaliseCard({
  id: 'explicit-risk',
  fields: {instrument: 'NQ'},
  risk: {plannedRiskPct: '1', plannedR: '3R', maxLoss: '300'}
});
ok(explicitRiskCard.risk.plannedRiskPct === '1' && explicitRiskCard.risk.plannedR === '3R' && explicitRiskCard.risk.maxLoss === '300', 'card-specific risk values should override defaults');
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
ok(priceCard.activeDolId === 'dol1', 'active DOL default invalid');
ok(priceCard.priceSnapshot.price === '20000', 'price snapshot should use current price');
ok(priceCard.priceSnapshot.delayDisclaimer.includes('delayed by 5 minutes'), 'price snapshot disclaimer missing');
ok(priceCard.priceHistory[0].event === 'created', 'created price history event missing');
ok(api.activeDol(priceCard.fields, priceCard.activeDolId).direction === 'upward delivery required', 'active DOL direction invalid');
const longRisk = api.calculateRiskPlan({direction: 'Long', entryPrice: '20000', targetPrice: '20250', invalidationPrice: '19950'}, priceCard.fields, 'dol1');
ok(longRisk.status === 'ready' && longRisk.rr === '5R', 'long R:R calculation invalid');
const shortRisk = api.calculateRiskPlan({direction: 'Short', entryPrice: '20000', targetPrice: '19850', invalidationPrice: '20050'}, priceCard.fields, 'dol1');
ok(shortRisk.status === 'ready' && shortRisk.rr === '3R', 'short R:R calculation invalid');
const invalidRisk = api.calculateRiskPlan({direction: 'Long', entryPrice: '20000', targetPrice: '19850', invalidationPrice: '19950'}, priceCard.fields, 'dol1');
ok(invalidRisk.status === 'invalid', 'invalid R:R should be blocked');
const routeEvidence = api.normRouteEvidence([{arrayType: 'BISI', timeframe: '5m', level: '20010-20020', behavior: 'Respect', notes: 'CE held.'}]);
ok(routeEvidence.length === 1 && routeEvidence[0].createdAtNy.includes('NY'), 'route evidence normalization invalid');
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
const takenPatch = api.focusReviewFields(priceCard, id => ({checked: id === 'focus_dol2Taken'}));
ok(takenPatch.dol1Taken === false && takenPatch.dol2Taken === true && takenPatch.dol3Taken === false, 'focus DOL taken patch did not reflect checkbox states');
const takenUpdated = api.updateCard('hit', {fields: takenPatch});
ok(takenUpdated.fields.dol2Taken === true, 'focus DOL taken patch did not persist');
ok(takenUpdated.fields.instrument === 'MNQ', 'focus DOL taken patch should not replace existing fields');

const updated = api.updateCard('hit', {
  fields: {bias: 'Bearish', biasValidation: 'Buy-side sweep confirmed.'},
  activeDolId: 'dol1',
  routeEvidence,
  riskPlan: {direction: 'Long', entryPrice: '20000', targetPrice: '20250', invalidationPrice: '19950'},
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
ok(updated.routeEvidence.length === 1 && updated.routeEvidence[0].arrayType === 'BISI', 'updateCard did not preserve route evidence');
ok(updated.riskPlan.status === 'ready' && updated.riskPlan.rr === '5R', 'updateCard did not calculate risk plan');
ok(updated.priceHistory.length >= 2, 'updateCard should append price history');
const historyBeforeFavorite = updated.priceHistory.length;
ok(api.toggleFavorite('hit').favorite === false, 'toggleFavorite did not flip favorite');
ok(api.getCards().find(card => card.id === 'hit').priceHistory.length === historyBeforeFavorite, 'toggleFavorite should not append price history');
ok(api.deleteCard('draft-miss') === true, 'deleteCard did not report deletion');
ok(!api.getCards().find(card => card.id === 'draft-miss'), 'deleteCard did not remove card');

const exported = api.exportCards();
ok(exported.schema === 'ict_dol_sweep_export_v7', 'export schema invalid');
ok(exported.analytics.sample === 2, 'export analytics invalid');
ok(exported.cards.find(card => card.id === 'hit').journal.lesson === 'Wait for confirmation.', 'export lost journal');
ok(exported.cards.find(card => card.id === 'hit').risk.maxLoss === '$50', 'export lost risk');
ok(exported.cards.find(card => card.id === 'hit').marketContext.Daily.phase === 'Retracement', 'export lost market context');
ok(exported.cards.find(card => card.id === 'hit').routeEvidence[0].arrayType === 'BISI', 'export lost route evidence');
ok(exported.cards.find(card => card.id === 'hit').riskPlan.rr === '5R', 'export lost risk plan');

api.saveCards([]);
const imported = api.importCards(JSON.stringify(exported));
ok(imported.imported === exported.cards.length, 'import count invalid');
const roundTrip = api.getCards().find(card => card.id === 'hit');
ok(roundTrip.fields.bias === 'Bearish', 'import lost bias');
ok(roundTrip.journal.lesson === 'Wait for confirmation.', 'import lost journal lesson');
ok(roundTrip.risk.plannedR === '2R', 'import lost planned R');
ok(roundTrip.marketContext.Daily.potentialNextPhase === 'Expansion', 'import lost market context');
ok(roundTrip.routeEvidence[0].behavior === 'Respect', 'import lost route evidence');
ok(roundTrip.riskPlan.status === 'ready', 'import lost risk plan');
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
const newestHit = api.getCards().find(card => card.id === 'hit');
api.importCards({cards: [Object.assign({}, newestHit, {updatedAt: '2000-01-01T00:00:00.000Z', fields: Object.assign({}, newestHit.fields, {session: 'Older import'})})]});
ok(api.getCards().find(card => card.id === 'hit').fields.session === 'London', 'older duplicate import should not overwrite newer local card');

const quotaFixture = runApp();
const quotaApi = quotaFixture.context.ICTSweepState;
const quotaCard = quotaApi.normaliseCard({id: 'quota-card', fields: {instrument: 'MNQ', bias: 'Bullish'}});
quotaApi.saveCards([quotaCard]);
quotaFixture.storage.setFailWrites(true);
const failedUpdate = quotaApi.updateCard('quota-card', {fields: {bias: 'Bearish'}});
ok(failedUpdate === null, 'updateCard should report failed durable writes');
ok(quotaApi.getCards()[0].fields.bias === 'Bullish', 'failed update should not mutate card memory');
ok(quotaApi.lastStorageError().includes('Storage limit'), 'storage failure should expose a user-facing error');
ok(quotaApi.deleteCard('quota-card') === false, 'deleteCard should report failed durable writes');
ok(quotaApi.getCards().length === 1, 'failed delete should not mutate card memory');
const failedImport = quotaApi.importCards({cards: [quotaApi.normaliseCard({id: 'quota-import', fields: {instrument: 'ES'}})]});
ok(failedImport.imported === 0 && failedImport.error, 'importCards should report failed durable writes');
quotaApi.saveSettings({defaultInstrument: 'ES'});
ok(quotaApi.lastSettingsError().includes('Settings could not be saved'), 'settings write failure should be surfaced');
const failingDraftSeed = {};
failingDraftSeed[quotaApi.SETTINGS_KEY] = JSON.stringify({defaultInstrument: 'MNQ'});
const failingDraftFixture = runApp(failingDraftSeed, {failWrites: true});
const failingDraftApi = failingDraftFixture.context.ICTSweepState;
failingDraftApi.go('planner', {new: true});
ok(failingDraftApi.draftState().message.includes('Unsaved changes'), 'planner autosave failure should be user-visible');

const blankDraft = api.createBlankDraft();
ok(blankDraft.outcome === 'Open', 'blank draft outcome invalid');
ok(blankDraft.finalSaved === false, 'blank draft finalSaved invalid');
ok(blankDraft.fields.instrument === '', 'blank draft fields invalid');
ok(Array.isArray(blankDraft.journal.tags), 'blank draft journal invalid');
ok(blankDraft.marketContext.Monthly.phase === '', 'blank draft market context invalid');
ok(blankDraft.createdAtNy.includes('NY') && blankDraft.updatedAtNy.includes('NY'), 'blank draft NY timestamps invalid');
ok(Array.isArray(blankDraft.priceHistory), 'blank draft price history invalid');

const routes = runApp();
const routeApi = routes.context.ICTSweepState;
ok(routes.appNode.innerHTML.includes('ICT Sweep Tracker'), 'home route did not render');
ok(routes.appNode.innerHTML.includes('tab-bar'), 'bottom tab bar did not render');
ok(routes.appNode.innerHTML.includes('Start new analysis'), 'home route action did not render');

const malformedHash = runApp(null, {location: {hash: '#%E0%A4%A', hostname: 'localhost', origin: 'http://localhost'}});
ok(malformedHash.appNode.innerHTML.includes('ICT Sweep Tracker'), 'malformed hash should fall back to a rendered home route');

routeApi.go('planner');
ok(routes.appNode.innerHTML.includes('AI Trade Plan Builder'), 'planner route did not render');
ok(routes.appNode.innerHTML.includes("class='skip-link' href='#plannerActions'"), 'planner skip link missing');
ok(routes.appNode.innerHTML.includes('Generate Focus Plan'), 'planner CTA did not render');
ok(routes.appNode.innerHTML.includes("id='plannerActions'"), 'planner sticky action target missing');
ok(routes.appNode.innerHTML.includes('Draft state'), 'planner visible draft state missing');
ok(routes.appNode.innerHTML.includes("id='discardDraftBtn'"), 'planner discard draft action missing');
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
ok(routes.appNode.innerHTML.includes('configured yfinance price API'), 'planner configured price API note missing');
ok(routes.appNode.innerHTML.includes('127.0.0.1:8765'), 'planner local price fallback note missing');
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

const restoreSeed = {};
restoreSeed[routeApi.DRAFT_KEY] = JSON.stringify({
  version: appVersion,
  savedAt: '2026-07-08T10:00:00.000Z',
  fields: {
    instrument: 'MNQ',
    dol1Level: '20250',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily',
    sweep1Level: '20100',
    sweep1Draw: 'Relative equal lows (REL)',
    sweep1Tf: '15m'
  }
});
const restoredDraftFixture = runApp(restoreSeed);
const restoredDraftApi = restoredDraftFixture.context.ICTSweepState;
restoredDraftApi.go('planner');
ok(restoredDraftApi.draftState().message.includes('Restored autosaved draft'), 'planner should expose restored draft state');
ok(restoredDraftFixture.appNode.innerHTML.includes('Restored autosaved draft'), 'planner should render restored draft state');

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
  activeDolId: 'dol1',
  routeEvidence: [{arrayType: 'BISI', timeframe: '5m', level: '20020', behavior: 'Respect', notes: 'BISI CE respected toward DOL.'}],
  riskPlan: {direction: 'Long', entryPrice: '20000', targetDolId: 'dol1', targetPrice: '20250', invalidationPrice: '19950'},
  outcome: 'Hit',
  finalSaved: true,
  favorite: true,
  notes: 'Route fixture note',
  journal: {tags: ['patient'], lesson: 'Wait for confirmation.'},
  risk: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '$50'}
});
const londonCard = routeApi.createBlankDraft({
  id: 'london-card',
  savedAt: '2026-07-07T07:30:00.000Z',
  fields: {
    date: '2026-07-07',
    time: '07:30',
    instrument: 'ES',
    session: 'London',
    currentPrice: '5500',
    bias: 'Bearish',
    dol1Level: '5450',
    dol1Draw: 'Previous day low (PDL)',
    dol1Tf: 'Daily',
    sweep1Level: '5520',
    sweep1Draw: 'Asia high',
    sweep1Tf: '15m'
  },
  outcome: 'Miss',
  finalSaved: true
});
routeApi.saveCards([routeCard, londonCard]);

routeApi.go('home');
ok(routes.appNode.innerHTML.includes("data-session-chip='All'"), 'home All session filter missing');
ok(routes.appNode.innerHTML.includes("data-session-chip='London'"), 'home London session filter missing');
routeApi.setHomeSession('London');
ok(routes.appNode.innerHTML.includes('Showing Home cards and metrics for London.'), 'home session filter hint missing');
ok(routes.appNode.innerHTML.includes('<h2>ES</h2>'), 'home London filter should show London hero card');
ok(!routes.appNode.innerHTML.includes('<h2>MNQ</h2>'), 'home London filter should hide New York hero card');
routeApi.setHomeSession('New York AM');
ok(routes.appNode.innerHTML.includes('<h2>MNQ</h2>'), 'home New York AM filter should show NY hero card');
routeApi.setHomeSession('Invalid session');
ok(routes.appNode.innerHTML.includes("data-session-chip='All' aria-pressed='true'"), 'invalid home session should reset to All');

routeApi.go('saved');
ok(routes.appNode.innerHTML.includes('Saved Cards'), 'saved route did not render');
ok(routes.appNode.innerHTML.includes('MNQ'), 'saved route did not show card');
ok(routes.appNode.innerHTML.includes('star'), 'saved favorite affordance missing');
ok(routes.appNode.innerHTML.includes('Export JSON'), 'saved export action missing');

routeApi.go('focus', {id: 'route-card'});
ok(routes.appNode.innerHTML.includes('Focus card details'), 'focus route did not render');
ok(routes.appNode.innerHTML.includes('Price Map Dashboard'), 'focus price map dashboard missing');
ok(routes.appNode.innerHTML.indexOf('Price Map Dashboard') < routes.appNode.innerHTML.indexOf('Market Context'), 'price map dashboard should render before market context');
ok(routes.appNode.innerHTML.includes('Focus DOL'), 'focus active DOL panel missing');
ok(routes.appNode.innerHTML.includes('Active draw on liquidity'), 'active DOL selector missing');
ok(routes.appNode.innerHTML.includes('Potential risk-to-reward'), 'focus risk-to-reward panel missing');
ok(routes.appNode.innerHTML.includes('Potential R:R'), 'potential R:R label missing');
ok(routes.appNode.innerHTML.includes('5R'), 'calculated R:R missing from focus panel');
ok(routes.appNode.innerHTML.includes('Route to DOL / PD array evidence'), 'route evidence panel missing');
ok(routes.appNode.innerHTML.includes('BISI CE respected toward DOL.'), 'route evidence note missing');
ok(routes.appNode.innerHTML.includes('audit-strip'), 'audit strip missing');
ok(routes.appNode.innerHTML.includes('Last saved'), 'last saved audit label missing');
ok(routes.appNode.innerHTML.includes('Latest saved price'), 'latest saved price card missing');
ok(routes.appNode.innerHTML.includes('snapshot-card'), 'snapshot card markup missing');
ok(routes.appNode.innerHTML.includes('Override price before saving'), 'override price panel missing');
ok(routes.appNode.innerHTML.includes('Recent price captures'), 'compact price history missing');
ok(routes.appNode.innerHTML.includes('Last saved'), 'last saved timestamp missing');
ok(routes.appNode.innerHTML.includes('Price data may be delayed by 5 minutes'), 'price delay disclaimer missing');
ok(routes.appNode.innerHTML.includes('focusCurrentPrice'), 'manual price override field missing');
ok(routes.appNode.innerHTML.includes('Latest saved price') && routes.appNode.innerHTML.includes('20000'), 'focus saved price snapshot missing');
ok(routes.appNode.innerHTML.includes('Distance: 250 (1.25%)'), 'focus DOL distance missing');
ok(routes.appNode.innerHTML.includes('Timeframe: Daily'), 'focus DOL timeframe missing');
ok(routes.appNode.innerHTML.includes('focus_dol1Taken'), 'focus DOL taken checkbox missing');
ok(routes.appNode.innerHTML.includes('DOL taken'), 'focus DOL taken label missing');
ok(routes.appNode.innerHTML.includes('Vercel yfinance API'), 'focus hosted price source note missing');
ok(routes.appNode.innerHTML.includes('local helper fallback'), 'focus local price fallback note missing');
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
ok(routes.appNode.innerHTML.includes('riskInvalidation'), 'risk invalidation field missing');
ok(routes.appNode.innerHTML.includes('routeArrayType'), 'route evidence input missing');

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
ok(routes.appNode.innerHTML.includes('Saved cards live only in this browser'), 'profile backup reminder missing');
ok(routes.appNode.innerHTML.includes("id='exportJsonBtn'>Export data"), 'profile primary JSON export action missing');
ok(routes.appNode.innerHTML.includes("id='feedbackLink'") && routes.appNode.innerHTML.includes('https://github.com/JGDev1215/ICT/issues/new'), 'profile beta feedback link missing');
ok(routes.appNode.innerHTML.includes("data-route='component-gallery'"), 'profile component gallery link missing');
ok(routes.appNode.innerHTML.includes('Clear all local data'), 'profile clear action missing');

routeApi.go('component-gallery');
ok(routes.appNode.innerHTML.includes('Component Gallery'), 'component gallery route did not render');
ok(routes.appNode.innerHTML.includes('Buttons'), 'component gallery button examples missing');
ok(routes.appNode.innerHTML.includes('Chips and pills'), 'component gallery chip examples missing');
ok(routes.appNode.innerHTML.includes('Form controls'), 'component gallery form examples missing');
ok(routes.appNode.innerHTML.includes('Timeline nodes'), 'component gallery timeline examples missing');
ok(routes.appNode.innerHTML.includes('price-map-loading') && routes.appNode.innerHTML.includes('price-map-error'), 'component gallery price-map states missing');

routeApi.toggleFavorite('route-card');
ok(routeApi.getCards()[0].favorite === false, 'route favorite flow failed');
const routeTextExport = routeApi.text(routeCard);
ok(routeTextExport.includes('Legacy bias validation: Displacement after sell-side sweep.'), 'text export should retain legacy bias validation');
ok(routeTextExport.includes('Legacy bias invalidation: Acceptance below low.'), 'text export should retain legacy bias invalidation');

console.log('Smoke test passed.');
