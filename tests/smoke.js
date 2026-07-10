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
const releaseQaTest = read('tests/e2e/release-qa.spec.js');

const appVersion = match(appSource, /const VERSION = '([^']+)'/, 'app version constant missing')[1];
const appVersionNumber = appVersion.replace(/^v/, '');
const configAsset = match(index, /<script src="([^"]*assets\/config\.js\?v=[^"]+)"><\/script>/, 'cache-safe config reference missing')[1];
const appAsset = match(index, /<script src="([^"]*assets\/app\.js\?v=[^"]+)"><\/script>/, 'cache-safe app reference missing')[1];
const styleAsset = match(index, /<link rel="stylesheet" href="([^"]*assets\/styles\.css\?v=[^"]+)">/, 'cache-safe style reference missing')[1];
const cacheName = match(serviceWorker, /const CACHE_NAME = '([^']+)'/, 'service worker cache name missing')[1];
const hostedPriceApiBase = match(configSource, /hostedPriceApiBase: '([^']+)'/, 'hosted price API base missing')[1];
const hostedPriceUrl = new URL(hostedPriceApiBase);
const runtimeAssets = Array.from(index.matchAll(/(?:src|href)="([^"]*(?:assets\/[^"]+|manifest\.webmanifest|favicon\.svg|icon-\d+\.svg)[^"]*)"/g)).map(found => found[1]);

ok(appVersion === 'v0.8.11', 'app version should be v0.8.11');
ok(configAsset.includes('v=0.8.11-access-price-planner-20260710'), 'config asset cache key should match v0.8.11 access price planner');
ok(appAsset.includes('v=0.8.11-access-price-planner-20260710'), 'app asset cache key should match v0.8.11 access price planner');
ok(styleAsset.includes('v=0.8.11-access-price-planner-20260710'), 'style asset cache key should match v0.8.11 access price planner');
ok(cacheName === 'ict-sweep-tracker-v0811-access-price-planner-20260710', 'service worker cache name should match v0.8.11 access price planner');
ok(index.includes(`<title>ICT DOL Sweep Tracker ${appVersion}</title>`), 'index title version missing');
ok(index.includes(`ICT DOL Sweep Tracker ${appVersion} · Educational tool. Not financial advice.`), 'index footer version missing');
ok(!index.includes('assets/bias-extension.js'), 'obsolete bias extension should not be loaded');
ok(configAsset.includes(`v=${appVersionNumber}`), 'config asset cache key should include app version');
ok(appAsset.includes(`v=${appVersionNumber}`), 'app asset cache key should include app version');
ok(styleAsset.includes(`v=${appVersionNumber}`), 'style asset cache key should include app version');
ok(index.indexOf(configAsset) < index.indexOf(appAsset), 'runtime config should load before app bundle');
ok(serviceWorker.includes(`'./${configAsset}'`), 'service worker config cache does not match index');
ok(serviceWorker.includes(`'./${appAsset}'`), 'service worker app cache does not match index');
ok(serviceWorker.includes(`'./${styleAsset}'`), 'service worker style cache does not match index');
runtimeAssets.forEach(asset => {
  ok(serviceWorker.includes(`'./${asset}'`) || asset === 'manifest.webmanifest' || asset === 'favicon.svg', 'service worker cache should include runtime asset reference: ' + asset);
});
ok(cacheName.includes(appVersionNumber.replaceAll('.', '')), 'service worker cache name should include app version');
ok(index.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js@2'), 'Supabase JS CDN missing');
ok(index.includes("window.ICT_SUPABASE_URL = 'https://cdcqklvvswzipmmvpzaj.supabase.co'"), 'Supabase project URL config missing');
ok(index.includes('window.ICT_SUPABASE_ANON_KEY') && index.includes('sb_publishable_'), 'Supabase publishable key config missing');
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
ok(appSource.includes('function calculateRiskPlan'), 'legacy risk plan normalizer missing');
ok(!appSource.includes('function routeEvidenceHtml'), 'route evidence UI should not render');
ok(appSource.includes('PRICE_DELAY_DISCLAIMER'), 'price delay disclaimer missing');
ok(appSource.includes('Auto-detect price'), 'price auto-detect button missing');
ok(appSource.includes('function plannerValidationState'), 'planner validation helper missing');
ok(appSource.includes("id='manualPriceNeededAck'"), 'manual price-needed acknowledgement missing');
ok(appSource.includes('function normalizePriceSymbol'), 'price symbol normalization helper missing');
ok(appSource.includes('validatePricePayload'), 'price payload validation missing');
ok(appSource.includes('root.ICT_CONFIG'), 'app should read runtime config');
ok(configSource.includes('localPriceApiBase'), 'local price API config missing');
ok(configSource.includes('priceTimeoutMs') && configSource.includes('priceRefreshSeconds'), 'price runtime tuning config missing');
ok(hostedPriceUrl.pathname === '/api/price', 'default hosted price API URL invalid');
ok(appSource.includes("root.location.origin") && appSource.includes("/api/price"), 'same-origin Vercel price API fallback missing');
ok(appSource.includes('priceHelperUrl'), 'price helper URL boundary missing');
ok(appSource.includes('localPriceHelperUrl'), 'local price helper fallback missing');
ok(appSource.includes('function localPriceFallbackAllowed'), 'local price fallback host guard missing');
ok(appSource.includes('function cleanUrl'), 'URL sanitizer missing');
ok(appSource.includes('priceHistoryEvent === false'), 'metadata-only update price-history guard missing');
ok(appSource.includes('fetchJsonWithTimeout'), 'price API timeout helper missing');
ok(appSource.includes('function getMetrics'), 'getMetrics helper missing');
ok(appSource.includes('function exportCards'), 'exportCards helper missing');
ok(appSource.includes('function importCards'), 'importCards helper missing');
ok(appSource.includes('reader.onerror'), 'import file read errors should surface a notice');
ok(appSource.includes('function importSchemaWarning'), 'import schema warning helper missing');
ok(appSource.includes('DEFAULT_SUPABASE_URL'), 'default Supabase URL missing');
ok(appSource.includes('function getSupabaseClient'), 'Supabase client helper missing');
ok(appSource.includes('function syncFromSupabase'), 'Supabase sync helper missing');
ok(appSource.includes('function flushSupabaseQueue'), 'Supabase queue flush helper missing');
ok(appSource.includes('function supabaseSignup'), 'Supabase signup helper missing');
ok(appSource.includes('auth.signUp'), 'Supabase signup API call missing');
ok(appSource.includes("const DEFAULT_ADMIN_SUPABASE_EMAIL = 'admin@ict.local'"), 'admin backing email missing');
ok(appSource.includes('function adminSupabaseEmail'), 'admin backing email helper missing');
ok(appSource.includes("id='adminLoginBtn'") && appSource.includes('Sign in'), 'admin sign-in UI missing');
ok(appSource.includes("id='adminPin'") && appSource.includes('4-digit PIN'), 'single-user PIN login UI missing');
ok(appSource.includes("^\\d{4}$") && appSource.includes('Enter the 4-digit PIN.'), 'PIN login validation missing');
ok(!appSource.includes("id='adminUsername'"), 'admin username field should not render');
ok(!appSource.includes("id='adminPassword'"), 'admin password field should not render');
ok(!appSource.includes("id='supabaseSignupBtn'"), 'signup button should not render in Profile UI');
ok(appSource.includes('syncFromSupabase({force: true})'), 'Supabase auth actions should force sync after busy login state');
ok(appSource.includes('auth.getUser'), 'Supabase restored sessions should revalidate the current user');
ok(appSource.includes('SYNC_ACCOUNT_DECISIONS_KEY'), 'Supabase first-sync decision storage missing');
ok(appSource.includes("id='approveFirstSyncBtn'") && appSource.includes('Back up local cards'), 'first-sync backup approval UI missing');
ok(appSource.includes("id='skipFirstSyncBtn'") && appSource.includes('Keep on this device'), 'first-sync keep-local UI missing');
ok(appSource.includes('SUPABASE_CARDS_TABLE') && appSource.includes('focus_cards'), 'Supabase focus_cards table binding missing');
ok(appSource.includes('favorite'), 'favorite field missing');
ok(appSource.includes('journal'), 'journal field missing');
ok(appSource.includes('risk'), 'risk field missing');
ok(appSource.includes('marketContext'), 'market context field missing');
ok(!appSource.includes('Bias Determination For Session'), 'active session bias label should be removed');
ok(!appSource.includes('Before 10:30am NY'), 'active pre-10:30 NY warning should be removed');
ok(appSource.includes('Start new analysis'), 'home action missing');
ok(appSource.includes('function setNotice') && appSource.includes('function announce') && appSource.includes('globalStatus'), 'notice severity and persistent live-region helpers missing');
ok(appSource.includes('function renderShell'), 'app shell renderer missing');
ok(appSource.includes('function renderTabBar'), 'tab bar renderer missing');
ok(appSource.includes('ROUTES.includes(routeName)'), 'hash router should ignore non-route anchors');
ok(appSource.includes('component-gallery'), 'component gallery route missing');
ok(appSource.includes('Build a plan for review'), 'planner screen missing');
ok(appSource.includes('Saved focus cards'), 'saved screen missing');
ok(appSource.includes('Plan Review'), 'plan review screen missing');
ok(appSource.includes('DEFAULT_APP_PASSCODE') && appSource.includes("'5880'"), 'default app passcode missing');
ok(appSource.includes('function changeAppPasscode'), 'app passcode change helper missing');
ok(appSource.includes('focusPriceMode') && appSource.includes('Live auto-update'), 'focus price mode selector missing');
ok(appSource.includes('Execution timeline'), 'timeline screen missing');
ok(appSource.includes('Setup Library'), 'liquidity map screen missing');
ok(!appSource.includes('Risk tracker'), 'risk tracker screen should be removed');
ok(!appSource.includes('Trade journal'), 'journal route should not render');
ok(!appSource.includes("['journal', 'stylus_note', 'Journal']"), 'journal nav should not render');
ok(appSource.includes('Trader profile'), 'profile screen missing');
ok(appSource.includes('Final save'), 'final save missing');
ok(appSource.includes('function isFinalLocked'), 'final-saved lock helper missing');
ok(appSource.includes('Final-saved cards are locked'), 'final-saved lock message missing');
ok(!appSource.includes('Watchlist'), 'active Watchlist UI should be removed');
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
ok(css.includes('.desktop-new-plan'), 'desktop new analysis styling missing');
ok(css.includes('.audit-strip'), 'audit strip css missing');
ok(css.includes('.snapshot-card'), 'snapshot card css missing');
ok(css.includes('.override-panel'), 'override panel css missing');
ok(css.includes('.price-history-compact'), 'compact price history css missing');
ok(css.includes('.draft-state'), 'visible draft-state styling missing');
ok(css.includes('.skip-link'), 'skip link styling missing');
ok(css.includes('.sr-only'), 'screen-reader-only utility missing');
ok(css.includes('.price-validation'), 'price validation styling missing');
ok(css.includes('.price-status'), 'price status styling missing');
ok(readme.includes('## Price Map Ladder'), 'README price map section missing');
ok(readme.includes('CURRENT PRICE divider'), 'README current price divider contract missing');
ok(readme.includes('DOL and Sweep rows'), 'README DOL/Sweep row contract missing');
ok(readme.includes('distance in points and percent'), 'README distance display contract missing');
ok(readme.includes('empty state'), 'README empty state contract missing');
ok(readme.includes('## Hosted Price API'), 'README hosted price API section missing');
ok(readme.includes('## Supabase Focus Card Sync'), 'README Supabase sync section missing');
ok(readme.includes('Vercel Python Function'), 'README Vercel API contract missing');
ok(readme.includes('window.ICT_PRICE_API_BASE'), 'README price API override missing');
ok(readme.includes('Planner Plan preview') && readme.includes('Plan Review'), 'README price map integration contract missing');
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
ok(packageJson.scripts.test === 'npm run test:smoke && npm run test:unit && npm run test:api', 'npm test should run smoke, unit, and API boundary suites');
ok(packageJson.scripts['test:smoke'] === 'node tests/smoke.js', 'npm test:smoke should run smoke suite');
ok(packageJson.scripts['test:unit'] === 'node tests/unit/run-tests.js', 'npm test:unit should run unit suite');
ok(packageJson.scripts['test:api'] === 'python3 tests/api/test_price.py', 'npm test:api should run price API boundary suite');
ok(packageJson.scripts['test:e2e'] === 'playwright test', 'npm test:e2e should run Playwright');
ok(playwrightConfig.includes('mobile-chrome') && playwrightConfig.includes('mobile-safari') && playwrightConfig.includes('python3 -m http.server 4173'), 'Playwright config should cover mobile Chrome, mobile Safari and static server');
ok(e2eTest.includes('planner creates a focus card') && e2eTest.includes('planner skip link') && e2eTest.includes('home session chips'), 'E2E tests should cover planner, skip link and Home filters');
ok(releaseQaTest.includes('[390, 430]') && releaseQaTest.includes('service worker serves cached app shell') && releaseQaTest.includes('filter chips expose selected state'), 'release QA E2E tests should cover mobile, offline and accessibility evidence');
ok(e2eWorkflow.includes('npm ci') && e2eWorkflow.includes('playwright install --with-deps chromium webkit'), 'E2E workflow should install dependencies, Chromium and WebKit');

new vm.Script(configSource, {filename: 'assets/config.js'});
new vm.Script(appSource, {filename: 'assets/app.js'});
// Legacy bias extension is historical and not loaded by index.html; keep parsing it to catch accidental syntax rot in retained migration context.
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
  const session = makeStorage(runOptions.sessionSeed || {}, {});
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
    sessionStorage: session,
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
  if(!runOptions.locked && context.ICTSweepState){
    context.ICTSweepState.unlockApp(context.ICTSweepState.getSettings().appPasscode || '5880');
    context.ICTSweepState.go('home', {replace: true});
  }
  return {context, storage, session, appNode};
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
const emptyPlannerValidation = migratedApi.plannerValidationState(migratedApi.blank(), migratedApi.blankMarketContext(), '');
ok(emptyPlannerValidation.hasMeaningfulPlannerInput === false, 'empty planner should not count as meaningful input');
ok(emptyPlannerValidation.canSaveDraft === false, 'empty planner draft save should be blocked');
ok(emptyPlannerValidation.canGenerateFocusPlan === false, 'empty planner generation should be blocked');
const partialPlannerFields = migratedApi.blank();
partialPlannerFields.instrument = 'MNQ';
const partialPlannerValidation = migratedApi.plannerValidationState(partialPlannerFields, migratedApi.blankMarketContext(), '');
ok(partialPlannerValidation.hasMeaningfulPlannerInput === true, 'partial planner should count as meaningful input');
ok(partialPlannerValidation.canSaveDraft === true, 'partial meaningful planner draft should save');
ok(partialPlannerValidation.canGenerateFocusPlan === false, 'partial planner should not generate a focus plan');
const completePlannerFields = migratedApi.blank();
Object.assign(completePlannerFields, {
  instrument: 'MNQ',
  session: 'New York AM',
  currentPrice: '20000',
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily'
});
const completePlannerValidation = migratedApi.plannerValidationState(completePlannerFields, migratedApi.blankMarketContext(), '');
ok(completePlannerValidation.canGenerateFocusPlan === true, 'minimum complete planner should generate a focus plan');
completePlannerFields.sweep1Level = '20100';
const partialSweepValidation = migratedApi.plannerValidationState(completePlannerFields, migratedApi.blankMarketContext(), '');
ok(partialSweepValidation.canGenerateFocusPlan === false, 'partial sweep row should block generation');
ok(partialSweepValidation.generateErrors.some(message => message.includes('partial Sweep rows')), 'partial sweep validation message missing');
ok(migratedApi.normalizePriceSymbol(' mnq ') === 'MNQ', 'price symbols should be trimmed and uppercased');
ok(migratedApi.validPriceSymbol('MNQ') === true, 'common futures symbol should be accepted');
ok(migratedApi.validPriceSymbol('BAD SYMBOL !') === false, 'obvious non-symbol strings should be rejected');
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
ok(api.supabaseConfig().url === 'https://cdcqklvvswzipmmvpzaj.supabase.co', 'default Supabase project URL invalid');
ok(api.adminSupabaseEmail() === 'admin@ict.local', 'default admin backing email invalid');
ok(!api.priceHelperUrls('MNQ').includes(api.localPriceHelperUrl('MNQ')), 'production HTTPS price helper URLs should skip local fallback');
metricsFixture.context.location = {hostname: 'localhost', origin: 'http://localhost:8000', protocol: 'http:'};
ok(api.priceHelperUrls('MNQ').includes(api.localPriceHelperUrl('MNQ')), 'localhost price helper URLs should include local fallback');
metricsFixture.context.location = {hostname: hostedPriceUrl.hostname, origin: hostedPriceUrl.origin, protocol: 'https:'};
ok(api.priceHelperUrl(' mnq ').endsWith('?symbol=MNQ'), 'price helper URL should normalize symbols before lookup');
ok(api.noticeClass('bad') === 'bad' && api.noticeRole('bad') === 'alert', 'bad notices should render as alerts');
ok(api.noticeClass('warn') === 'warn' && api.noticeRole('warn') === 'status', 'warn notices should render as status messages');
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
  session: 'New York AM',
  currentPrice: '20000',
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  sweep1Level: '20100',
  sweep1Draw: 'Relative equal lows (REL)',
  sweep1Tf: '15m',
  sweep1Taken: false
});
ok(optionalSweepCompletion.ok === true, 'sweep confidence and hit time should not block completion');
const noSweepCompletion = api.comp({
  instrument: 'MNQ',
  session: 'New York AM',
  manualPriceNeededAck: true,
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily'
});
ok(noSweepCompletion.ok === true, 'complete DOL with manual price acknowledgement should be complete without requiring a sweep');
const partialSweepCompletion = api.comp({
  instrument: 'MNQ',
  session: 'New York AM',
  currentPrice: '20000',
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily',
  sweep1Level: '20100',
  sweep1Draw: 'Relative equal lows (REL)'
});
ok(partialSweepCompletion.ok === false && partialSweepCompletion.sweep.part === 1, 'partial sweep records should keep card in draft status');
ok(api.comp({instrument: 'MNQ', session: 'New York AM', dol1Level: '20250', dol1Draw: 'Previous day high (PDH)', dol1Tf: 'Daily'}).ok === false, 'missing current price or manual price acknowledgement should keep card in draft status');

const settingsFixture = runApp();
const settingsApi = settingsFixture.context.ICTSweepState;
const lockedFixture = runApp(null, {locked: true});
const lockedApi = lockedFixture.context.ICTSweepState;
ok(lockedFixture.appNode.innerHTML.includes('Enter app passcode'), 'app should start locked');
ok(!lockedFixture.appNode.innerHTML.includes('ICT Sweep Tracker'), 'locked app should not render normal app content');
ok(lockedApi.unlockApp('1234') === false, 'wrong app passcode should not unlock');
ok(lockedApi.isAppUnlocked() === false, 'wrong app passcode should keep app locked');
ok(lockedApi.unlockApp('5880') === true, 'default app passcode should unlock');
ok(lockedApi.isAppUnlocked() === true, 'default app passcode should set unlocked state');
const changedPasscode = lockedApi.changeAppPasscode('5880', '4321', '4321');
ok(changedPasscode.ok === true, 'app passcode should change with current passcode');
lockedApi.lockApp();
ok(lockedApi.unlockApp('5880') === false, 'old app passcode should stop working after change');
ok(lockedApi.unlockApp('4321') === true, 'new app passcode should unlock');
const savedSettings = settingsApi.saveSettings({
  defaultInstrument: 'NQ',
  defaultSession: 'New York AM',
  appPasscode: '2468',
  theme: 'dark',
  riskDefaults: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '150'}
});
ok(savedSettings.defaultInstrument === 'NQ', 'default instrument setting did not save');
ok(savedSettings.defaultSession === 'New York AM', 'default session setting did not save');
ok(savedSettings.appPasscode === '2468', 'local app passcode setting did not save');
ok(savedSettings.theme === 'dark', 'theme setting did not save');
ok(!Object.prototype.hasOwnProperty.call(savedSettings, 'watchlist'), 'watchlist should not be an active setting');
ok(savedSettings.riskDefaults.plannedRiskPct === '0.5', 'risk default percent did not save');
ok(!Object.prototype.hasOwnProperty.call(settingsApi.publicSettings(savedSettings), 'appPasscode'), 'public settings should exclude app passcode');
ok(!Object.prototype.hasOwnProperty.call(settingsApi.exportCards().settings, 'appPasscode'), 'exported settings should exclude app passcode');
const reloadedSettingsFixture = runApp(settingsFixture.storage.dump());
const reloadedSettingsApi = reloadedSettingsFixture.context.ICTSweepState;
const reloadedSettings = reloadedSettingsApi.getSettings();
ok(reloadedSettings.defaultInstrument === 'NQ', 'default instrument setting did not persist');
ok(reloadedSettings.defaultSession === 'New York AM', 'default session setting did not persist');
ok(reloadedSettings.theme === 'dark', 'theme setting did not persist');
ok(!Object.prototype.hasOwnProperty.call(reloadedSettings, 'watchlist'), 'watchlist setting should not persist');
ok(reloadedSettings.riskDefaults.plannedRiskPct === '0.5' && reloadedSettings.riskDefaults.plannedR === '2R' && reloadedSettings.riskDefaults.maxLoss === '150', 'risk defaults did not persist');
reloadedSettingsApi.go('profile');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultInstrument' value='NQ'"), 'profile did not render saved default instrument');
ok(!reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultRiskPct'"), 'profile should not render saved risk percent');
ok(!reloadedSettingsFixture.appNode.innerHTML.includes("id='defaultPlannedR'"), 'profile should not render saved planned R');
reloadedSettingsApi.go('risk');
ok(reloadedSettingsFixture.appNode.innerHTML.includes('ICT Sweep Tracker'), 'legacy risk route should redirect home');
ok(!reloadedSettingsFixture.appNode.innerHTML.includes('Risk tracker'), 'legacy risk route should not render risk UI');
reloadedSettingsApi.go('planner', {new: true});
ok(reloadedSettingsFixture.appNode.innerHTML.includes("id='instrument'") && reloadedSettingsFixture.appNode.innerHTML.includes("value='NQ'"), 'new planner draft did not inherit default instrument');
ok(reloadedSettingsFixture.appNode.innerHTML.includes("<option value='New York AM' selected>New York AM</option>"), 'new planner draft did not inherit default session');
ok(reloadedSettingsApi.draftState().message === 'No active planner draft.', 'default-only planner should not expose an autosaved draft');
ok(!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'default-only planner draft should not be stored');
reloadedSettingsApi.clearPlannerDraft();
ok(!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'clearPlannerDraft should remove stored planner draft');
ok(reloadedSettingsApi.draftState().message === 'Draft discarded.', 'clearPlannerDraft should expose discarded state');
reloadedSettingsApi.go('planner', {new: true});
ok(!reloadedSettingsFixture.storage.getItem(reloadedSettingsApi.DRAFT_KEY), 'new planner draft should not autosave defaults before discard');
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
ok(Object.keys(api.getSyncQueue().cards).length === 5, 'saveCards should queue local cards for Supabase sync');
const mergeOlder = api.mergeCards(
  [api.normaliseCard({id: 'merge-card', updatedAt: '2026-07-09T10:00:00.000Z', fields: {instrument: 'NQ'}})],
  [api.normaliseCard({id: 'merge-card', updatedAt: '2026-07-08T10:00:00.000Z', fields: {instrument: 'ES'}})]
);
ok(mergeOlder[0].fields.instrument === 'NQ', 'mergeCards should keep newer local card over older remote card');
const mergeLocked = api.mergeCards(
  [api.normaliseCard({id: 'merge-locked', updatedAt: '2026-07-09T10:00:00.000Z', fields: {instrument: 'NQ'}, outcome: 'Hit', finalSaved: true})],
  [api.normaliseCard({id: 'merge-locked', updatedAt: '2099-07-09T10:00:00.000Z', fields: {instrument: 'ES'}, outcome: 'Hit', finalSaved: true})]
);
ok(mergeLocked[0].fields.instrument === 'NQ', 'mergeCards should not overwrite a local locked final card');
const metrics = api.getMetrics();
ok(metrics.rate === '50%', 'hit rate should only use final Hit/Miss outcomes');
ok(metrics.sample === 2, 'hit/miss sample should exclude Breakeven, Read and drafts');
ok(metrics.be === 1, 'breakeven count invalid');
ok(metrics.needs === 1, 'needs-final count invalid');
ok(metrics.finalSaved === 4, 'final saved count should include Read');
ok(metrics.favorites === 1, 'favorite metric invalid');

const openFinalAttempt = api.normaliseCard({id: 'open-final-attempt', outcome: 'Open', finalSaved: true});
ok(openFinalAttempt.finalSaved === false, 'Open outcome must not normalise as final-saved');
const editableReview = api.normaliseCard({
  id: 'editable-review',
  fields: {
    instrument: 'MNQ',
    currentPrice: '20000',
    dol1Level: '20250',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily',
    sweep1Level: '19850',
    sweep1Draw: 'Asia low',
    sweep1Tf: '15m'
  },
  outcome: 'Open',
  finalSaved: false,
  favorite: true
});
api.saveCards([editableReview].concat(api.getCards()));

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
ok(priceCard.priceSnapshot.delayDisclaimer.includes('Manual override'), 'price snapshot disclaimer missing');
ok(priceCard.priceHistory[0].event === 'created', 'created price history event missing');
ok(api.activeDol(priceCard.fields, priceCard.activeDolId).direction === 'upward delivery required', 'active DOL direction invalid');
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
ok(!priceMapMarkup.includes('priceMap_dol1Taken'), 'planner/default price map should not render editable DOL taken control');
ok(api.priceMapHtml(priceCard.fields, {editable: true}).includes('priceMap_dol1Taken'), 'editable price map DOL taken control missing');
ok(priceMapMarkup.includes('price-map-row dol above'), 'price map DOL row class missing');
ok(priceMapMarkup.includes('price-map-row sweep'), 'price map sweep row class missing');
ok(priceMapMarkup.includes('+250 pts · 1.25%'), 'price map distance label missing');
ok(priceMapMarkup.includes('Source: manual entry') && priceMapMarkup.includes('price-map-live manual'), 'manual price map source should be labeled separately from live data');
ok(api.priceMapHtml(priceCard.fields, {source: 'hosted-yfinance'}).includes('Source: hosted yfinance API'), 'hosted price map source label missing');
const takenPatch = api.focusReviewFields(priceCard, id => ({checked: id === 'priceMap_dol2Taken'}));
ok(takenPatch.dol1Taken === false && takenPatch.dol2Taken === true && takenPatch.dol3Taken === false, 'focus DOL taken patch did not reflect checkbox states');
const takenUpdated = api.updateCard('editable-review', {fields: takenPatch});
ok(takenUpdated.fields.dol2Taken === true, 'focus DOL taken patch did not persist');
ok(takenUpdated.fields.instrument === 'MNQ', 'focus DOL taken patch should not replace existing fields');

const legacyRisk = api.calculateRiskPlan({
  direction: 'Long',
  ratio: '2R',
  entryPrice: '20000',
  targetDolId: 'dol1',
  targetPrice: '20250',
  invalidationPrice: '19875',
  riskPoints: '125',
  rewardPoints: '250',
  rr: '2R',
  status: 'ready',
  message: 'Legacy risk reviewed.'
}, priceCard.fields, 'dol1');
ok(legacyRisk.status === 'ready' && legacyRisk.rr === '2R' && legacyRisk.riskPoints === '125' && legacyRisk.invalidationPrice === '19875', 'legacy risk plan was not preserved');
const incompleteLegacyRisk = api.calculateRiskPlan({direction: 'Long', ratio: '2R', entryPrice: '20000'}, priceCard.fields, 'dol1');
ok(incompleteLegacyRisk.status === 'incomplete' && incompleteLegacyRisk.rr === '2R' && incompleteLegacyRisk.riskPoints === '', 'legacy risk plan should not derive active R:R fields');

const updated = api.updateCard('editable-review', {
  fields: {bias: 'Bearish', biasValidation: 'Buy-side sweep confirmed.', currentPrice: '20000', dol1Level: '20250', dol1Draw: 'Previous day high (PDH)', dol1Tf: 'Daily'},
  activeDolId: 'dol1',
  routeEvidence,
  riskPlan: legacyRisk,
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
ok(updated.riskPlan.status === 'ready' && updated.riskPlan.rr === '2R', 'updateCard did not preserve legacy risk plan');
ok(updated.priceHistory.length >= 2, 'updateCard should append price history');
const historyBeforeFavorite = updated.priceHistory.length;
ok(api.toggleFavorite('editable-review').favorite === false, 'toggleFavorite did not flip favorite');
ok(api.getCards().find(card => card.id === 'editable-review').priceHistory.length === historyBeforeFavorite, 'toggleFavorite should not append price history');
ok(api.isFinalLocked(api.getCards().find(card => card.id === 'hit')) === true, 'final-saved card should be locked');
ok(api.updateCard('hit', {fields: {instrument: 'LOCKED'}}) === null, 'locked final card update should be blocked');
ok(api.getCards().find(card => card.id === 'hit').fields.instrument === 'MNQ', 'locked final card should not mutate fields');
ok(api.toggleFavorite('hit') === null, 'locked final card favorite toggle should be blocked');
ok(api.deleteCard('hit') === false, 'locked final card delete should be blocked');
api.saveCards(api.getCards().filter(card => card.id !== 'hit'));
ok(api.getCards().find(card => card.id === 'hit'), 'bulk save should preserve locked final card');
ok(api.deleteCard('draft-miss') === true, 'deleteCard did not report deletion');
ok(!api.getCards().find(card => card.id === 'draft-miss'), 'deleteCard did not remove card');

const clearFixture = runApp({
  ict_cards_v078: JSON.stringify([api.normaliseCard({id: 'clear-card', fields: {instrument: 'MNQ'}})]),
  ict_settings_v1: JSON.stringify({defaultInstrument: 'ES'}),
  ict_planner_draft_v1: JSON.stringify({fields: {instrument: 'NQ'}}),
  ict_bias_card_meta_v1: JSON.stringify({some: 'meta'}),
  ict_supabase_sync_queue_v1: JSON.stringify({cards: {queued: {}}, deletes: {old: true}, settings: {defaultInstrument: 'YM'}}),
  ict_supabase_tombstones_v1: JSON.stringify({old: '2026-07-09T00:00:00.000Z'}),
  ict_supabase_account_sync_v1: JSON.stringify({user: {localUpload: 'approved'}}),
  ict_cards_v077: JSON.stringify([{id: 'legacy-clear'}])
});
const clearApi = clearFixture.context.ICTSweepState;
ok(clearApi.getCards().length === 1, 'clear fixture should start with one card');
clearApi.clearDeviceData();
const clearDump = clearFixture.storage.dump();
ok(clearApi.getCards().length === 0, 'clearDeviceData should clear in-memory cards');
ok(clearDump.ict_cards_v078 == null, 'clearDeviceData should remove current card storage');
ok(clearDump.ict_settings_v1 == null && clearDump.ict_planner_draft_v1 == null && clearDump.ict_bias_card_meta_v1 == null, 'clearDeviceData should remove local app metadata');
ok(clearDump.ict_supabase_sync_queue_v1 == null && clearDump.ict_supabase_tombstones_v1 == null && clearDump.ict_supabase_account_sync_v1 == null, 'clearDeviceData should remove local sync metadata');
ok(clearDump.ict_cards_v077 == null, 'clearDeviceData should remove legacy card keys');

const exported = api.exportCards();
ok(exported.schema === 'ict_dol_sweep_export_v7', 'export schema invalid');
ok(exported.analytics.sample === 2, 'export analytics invalid');
ok(!Object.prototype.hasOwnProperty.call(exported.settings, 'watchlist'), 'exported settings should not include watchlist');
ok(!Object.prototype.hasOwnProperty.call(exported.settings, 'appPasscode'), 'exported settings should not include app passcode');
ok(exported.cards.find(card => card.id === 'editable-review').journal.lesson === 'Wait for confirmation.', 'export lost journal');
ok(exported.cards.find(card => card.id === 'editable-review').risk.maxLoss === '$50', 'export lost risk');
ok(exported.cards.find(card => card.id === 'editable-review').marketContext.Daily.phase === 'Retracement', 'export lost market context');
ok(exported.cards.find(card => card.id === 'editable-review').routeEvidence[0].arrayType === 'BISI', 'export lost route evidence');
ok(exported.cards.find(card => card.id === 'editable-review').riskPlan.rr === '2R', 'export lost risk plan');

api.clearDeviceData();
const imported = api.importCards(JSON.stringify(exported));
ok(imported.imported === exported.cards.length, 'import count invalid');
const roundTrip = api.getCards().find(card => card.id === 'editable-review');
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

const schemaWarningImport = api.importCards({
  schema: 'ict_dol_sweep_export_v6',
  cards: [api.normaliseCard({id: 'schema-warning-import', fields: {instrument: 'CL'}})]
});
ok(schemaWarningImport.imported === 1, 'schema mismatch should still import valid cards');
ok(schemaWarningImport.warning && schemaWarningImport.warning.includes('expected "ict_dol_sweep_export_v7"'), 'schema mismatch should return a warning');
ok(api.getCards().find(card => card.id === 'schema-warning-import'), 'schema mismatch import should preserve valid card');

const settingsOnlyImport = api.importCards({
  settings: {
    defaultInstrument: 'ES',
    defaultSession: 'London',
    appPasscode: '9999',
    theme: 'dark',
    riskDefaults: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '100'}
  }
});
ok(settingsOnlyImport.imported === 0 && settingsOnlyImport.settingsImported === true, 'settings-only import should report imported settings without cards');
const importedSettings = api.getSettings();
ok(importedSettings.defaultInstrument === 'ES' && importedSettings.defaultSession === 'London', 'importCards should import exported settings');
ok(importedSettings.appPasscode === '5880', 'importCards should ignore imported app passcode');
ok(!Object.prototype.hasOwnProperty.call(importedSettings, 'watchlist'), 'importCards should ignore legacy watchlist settings');

const duplicateImport = api.importCards({
  cards: [
    Object.assign({}, roundTrip, {fields: Object.assign({}, roundTrip.fields, {session: 'London'})}),
    api.normaliseCard({id: 'unique-import', fields: {instrument: 'YM'}, outcome: 'Open'})
  ]
});
ok(duplicateImport.imported === 2, 'duplicate import should report incoming card count');
ok(api.getCards().filter(card => card.id === 'editable-review').length === 1, 'import should deduplicate by id');
ok(api.getCards().find(card => card.id === 'editable-review').fields.session === 'London', 'duplicate import should keep newest incoming card data');
ok(api.getCards().find(card => card.id === 'unique-import'), 'import should keep unique incoming cards');
const newestEditable = api.getCards().find(card => card.id === 'editable-review');
api.importCards({cards: [Object.assign({}, newestEditable, {updatedAt: '2000-01-01T00:00:00.000Z', fields: Object.assign({}, newestEditable.fields, {session: 'Older import'})})]});
ok(api.getCards().find(card => card.id === 'editable-review').fields.session === 'London', 'older duplicate import should not overwrite newer local card');
const lockedHit = api.getCards().find(card => card.id === 'hit');
const lockedImport = api.importCards({cards: [Object.assign({}, lockedHit, {updatedAt: '2099-01-01T00:00:00.000Z', fields: Object.assign({}, lockedHit.fields, {instrument: 'LOCKED_IMPORT'})})]});
ok(lockedImport.imported === 0 && lockedImport.warning.includes('locked final-saved'), 'locked final import overwrite should be skipped with warning');
ok(api.getCards().find(card => card.id === 'hit').fields.instrument === 'MNQ', 'locked final import should not overwrite fields');

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
ok(failingDraftApi.draftState().message === 'No active planner draft.', 'default-only planner should not attempt autosave failure writes');

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
ok(routes.appNode.innerHTML.includes('Build a plan for review'), 'planner route did not render');
ok(routes.appNode.innerHTML.includes("class='skip-link' href='#plannerActions'"), 'planner skip link missing');
ok(routes.appNode.innerHTML.includes('Review Plan'), 'planner CTA did not render');
ok(routes.appNode.innerHTML.includes("id='plannerActions'"), 'planner sticky action target missing');
ok(routes.appNode.innerHTML.includes('Draft state'), 'planner visible draft state missing');
ok(routes.appNode.innerHTML.includes("id='discardDraftBtn'"), 'planner discard draft action missing');
ok(!routes.appNode.innerHTML.includes('Bias Determination For Session'), 'planner should not render session bias section');
ok(!routes.appNode.innerHTML.includes('Before 10:30am NY'), 'planner should not render pre-10:30 warning');
ok(!routes.appNode.innerHTML.includes('Market Context'), 'planner should not render active market context section');
ok(routes.appNode.innerHTML.includes('priceMapPreview'), 'planner standalone price map preview missing');
ok(routes.appNode.innerHTML.includes('Liquidity ladder'), 'planner price map heading missing');
ok(routes.appNode.innerHTML.includes('price-map-empty'), 'planner price map empty state missing');
ok(!routes.appNode.innerHTML.includes('marketContextAddTf'), 'planner should not render market context timeframe dropdown');
ok(!routes.appNode.innerHTML.includes('Choose only the timeframe you want to record'), 'planner should not render market context guidance');
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
ok(!routes.appNode.innerHTML.includes('FVG Formation'), 'planner should not render active FVG section');
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
const lockedCard = routeApi.normaliseCard({
  id: 'locked-card',
  savedAt: '2026-07-07T11:00:00.000Z',
  updatedAt: '2026-07-07T11:05:00.000Z',
  fields: {
    instrument: 'YM',
    session: 'New York PM',
    currentPrice: '40000',
    dol1Level: '40100',
    dol1Draw: 'Session high',
    dol1Tf: '15m',
    dol1Taken: true
  },
  outcome: 'Hit',
  finalSaved: true,
  notes: 'Locked final note'
});
routeApi.saveCards([routeCard, londonCard, lockedCard]);

routeApi.go('home');
ok(routes.appNode.innerHTML.includes("data-session-chip='All'"), 'home All session filter missing');
ok(routes.appNode.innerHTML.includes("data-session-chip='London'"), 'home London session filter missing');
routeApi.setHomeSession('London');
ok(routes.appNode.innerHTML.includes('Showing London cards and metrics.'), 'home session filter hint missing');
ok(routes.appNode.innerHTML.includes('<h2>ES</h2>'), 'home London filter should show London hero card');
ok(!routes.appNode.innerHTML.includes('<h2>MNQ</h2>'), 'home London filter should hide New York hero card');
routeApi.setHomeSession('New York AM');
ok(routes.appNode.innerHTML.includes('<h2>MNQ</h2>'), 'home New York AM filter should show NY hero card');
routeApi.setHomeSession('Invalid session');
ok(routes.appNode.innerHTML.includes("data-session-chip='All' aria-pressed='true'"), 'invalid home session should reset to All');

routeApi.go('saved');
ok(routes.appNode.innerHTML.includes('Saved Cards'), 'saved route did not render');
ok(routes.appNode.innerHTML.includes('MNQ'), 'saved route did not show card');
ok(routes.appNode.innerHTML.includes("data-saved-filter='All' aria-pressed='true'"), 'saved filter active state ARIA missing');
ok(routes.appNode.innerHTML.includes('star'), 'saved favorite affordance missing');
ok(routes.appNode.innerHTML.includes('Export JSON'), 'saved export action missing');

routeApi.go('focus', {id: 'route-card'});
ok(routes.appNode.innerHTML.includes('Plan Review'), 'focus route did not render');
ok(routes.appNode.innerHTML.includes('Price Map Dashboard'), 'focus price map dashboard missing');
ok(!routes.appNode.innerHTML.includes('Focus DOL'), 'focus should not render active DOL panel');
ok(!routes.appNode.innerHTML.includes('Active draw on liquidity'), 'focus should not render active DOL selector');
ok(!routes.appNode.innerHTML.includes('Potential risk-to-reward'), 'focus should not render risk-to-reward panel');
ok(!routes.appNode.innerHTML.includes('Potential R:R'), 'focus should not render potential R:R label');
ok(!routes.appNode.innerHTML.includes('Route to DOL / PD array evidence'), 'focus should not render route evidence panel');
ok(!routes.appNode.innerHTML.includes('BISI CE respected toward DOL.'), 'focus should not render legacy route evidence note');
ok(routes.appNode.innerHTML.includes('audit-strip'), 'audit strip missing');
ok(routes.appNode.innerHTML.includes('Last saved'), 'last saved audit label missing');
ok(routes.appNode.innerHTML.includes('Latest saved price'), 'latest saved price card missing');
ok(routes.appNode.innerHTML.includes('snapshot-card'), 'snapshot card markup missing');
ok(routes.appNode.innerHTML.includes('focusPriceMode'), 'focus price mode selector missing');
ok(routes.appNode.innerHTML.includes('Manual override'), 'focus manual price mode missing');
ok(routes.appNode.innerHTML.includes('Live auto-update'), 'focus live price mode missing');
ok(routes.appNode.innerHTML.includes('Override price before saving'), 'override price panel missing');
ok(routes.appNode.innerHTML.includes('Recent price captures'), 'compact price history missing');
ok(routes.appNode.innerHTML.includes('Last saved'), 'last saved timestamp missing');
ok(routes.appNode.innerHTML.includes('Price may be delayed'), 'price delay disclaimer missing');
ok(routes.appNode.innerHTML.includes('focusCurrentPrice'), 'manual price override field missing');
ok(routes.appNode.innerHTML.includes('Latest saved price') && routes.appNode.innerHTML.includes('20000'), 'focus saved price snapshot missing');
ok(routes.appNode.innerHTML.includes('Distance: 250 (1.25%)'), 'focus DOL distance missing');
ok(routes.appNode.innerHTML.includes('Timeframe: Daily'), 'focus DOL timeframe missing');
ok(routes.appNode.innerHTML.includes('focus_dol1Taken'), 'focus DOL taken checkbox missing');
ok(routes.appNode.innerHTML.includes('priceMap_dol1Taken'), 'price map DOL taken checkbox missing');
ok(routes.appNode.innerHTML.includes('DOL taken'), 'focus DOL taken label missing');
ok(routes.appNode.innerHTML.includes('Price source: manual'), 'focus saved price source note missing');
ok(routes.appNode.innerHTML.includes('Source: manual entry'), 'focus price map should use saved manual source');
ok(!routes.appNode.innerHTML.includes('Market Context'), 'focus should not render market context section');
ok(!routes.appNode.innerHTML.includes('Monthly range.'), 'focus should not render legacy market context note');
ok(!routes.appNode.innerHTML.includes('Potential next phase: Expansion'), 'focus should not render legacy potential next phase');
ok(!routes.appNode.innerHTML.includes('Session bias only'), 'focus should not render session bias warning');
ok(!routes.appNode.innerHTML.includes('Displacement after sell-side sweep.'), 'focus should not render legacy validation data');
ok(!routes.appNode.innerHTML.includes('Acceptance below low.'), 'focus should not render legacy invalidation data');
ok(!routes.appNode.innerHTML.includes('Bias validated'), 'focus should not render bias validated marker');
ok(!routes.appNode.innerHTML.includes('Bias invalidated'), 'focus should not render bias invalidated marker');
ok(routes.appNode.innerHTML.includes('Final save'), 'focus final save action missing');
ok(!routes.appNode.innerHTML.includes('journalLesson'), 'focus journal lesson field should not render');
ok(!routes.appNode.innerHTML.includes('Behaviour tags'), 'focus journal tag field should not render');
ok(!routes.appNode.innerHTML.includes('riskPct'), 'focus should not render risk percent field');
ok(!routes.appNode.innerHTML.includes('riskRatio'), 'focus should not render risk ratio field');
ok(!routes.appNode.innerHTML.includes('Invalidation / stop'), 'focus should not render risk invalidation output');
ok(!routes.appNode.innerHTML.includes('routeArrayType'), 'focus should not render route evidence input');

routeApi.go('focus', {id: 'locked-card'});
ok(routes.appNode.innerHTML.includes('Final card locked'), 'locked final card notice missing');
ok(routes.appNode.innerHTML.includes('Locked'), 'locked final card pill missing');
ok(!routes.appNode.innerHTML.includes("id='saveChangesBtn'"), 'locked final card should not render save changes');
ok(!routes.appNode.innerHTML.includes("id='finalSaveBtn'"), 'locked final card should not render final save');
ok(!routes.appNode.innerHTML.includes("id='loadBtn'"), 'locked final card should not render load to planner');
ok(!routes.appNode.innerHTML.includes("id='deleteBtn'"), 'locked final card should not render delete');
ok(!routes.appNode.innerHTML.includes('priceMap_dol1Taken'), 'locked final card should not render editable price-map DOL checkbox');
ok(routes.appNode.innerHTML.includes("id='focus_dol1Taken' checked disabled"), 'locked final card DOL checkbox should be disabled');
ok(routes.appNode.innerHTML.includes("id='reviewOutcome' disabled"), 'locked final card outcome should be disabled');
ok(routes.appNode.innerHTML.includes("id='reviewNotes' placeholder='Add review notes' disabled"), 'locked final card notes should be disabled');

routeApi.go('timeline', {id: 'route-card'});
ok(routes.appNode.innerHTML.includes('Execution timeline'), 'timeline route did not render');
ok(!routes.appNode.innerHTML.includes('Session bias'), 'timeline should not render session bias step');
ok(!routes.appNode.innerHTML.includes('Market context'), 'timeline should not render market context step');
routeApi.go('timeline', {id: 'locked-card'});
ok(routes.appNode.innerHTML.includes('Timeline notes are read-only after Final save.'), 'locked final timeline should be read-only');
ok(!routes.appNode.innerHTML.includes("id='timelineNote'"), 'locked final timeline should not render note editor');

routeApi.go('liquidity-map');
ok(routes.appNode.innerHTML.includes('Setup Library'), 'liquidity map route did not render');
ok(routes.appNode.innerHTML.includes("data-liquidity-filter='All' aria-pressed='true'"), 'liquidity filter active state ARIA missing');
ok(routes.appNode.innerHTML.includes('Add to plan'), 'liquidity add-to-plan action missing');

routeApi.go('risk');
ok(routes.appNode.innerHTML.includes('ICT Sweep Tracker'), 'legacy risk route should redirect home');
ok(!routes.appNode.innerHTML.includes('Risk tracker'), 'legacy risk route should not render risk UI');

routeApi.go('journal');
ok(routes.appNode.innerHTML.includes('ICT Sweep Tracker'), 'legacy journal route should redirect home');
ok(!routes.appNode.innerHTML.includes('Trade journal'), 'legacy journal route should not render journal UI');

routeApi.go('profile');
ok(routes.appNode.innerHTML.includes('Profile'), 'profile route did not render');
ok(routes.appNode.innerHTML.includes('Account & Backup'), 'profile account backup panel missing');
ok(routes.appNode.innerHTML.includes('Cloud backup is unavailable in this build'), 'profile local fallback missing when backup client is unavailable');
ok(!routes.appNode.innerHTML.includes('Supabase Focus Cards'), 'profile should not expose Supabase panel title');
ok(!routes.appNode.innerHTML.includes('Project</div>'), 'profile should not expose Supabase project URL line');
ok(!routes.appNode.innerHTML.includes('Create account'), 'profile should not expose account creation');
ok(routes.appNode.innerHTML.includes("id='exportJsonBtn'>Export data"), 'profile primary JSON export action missing');
ok(routes.appNode.innerHTML.includes("id='feedbackLink'") && routes.appNode.innerHTML.includes('https://github.com/JGDev1215/ICT/issues/new'), 'profile beta feedback link missing');
ok(routes.appNode.innerHTML.includes("data-route='component-gallery'"), 'profile component gallery link missing');
ok(routes.appNode.innerHTML.includes('Clear this device data'), 'profile clear action missing');

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
ok(routeTextExport.includes('Legacy market context:'), 'text export should retain legacy market context');
ok(routeTextExport.includes('Legacy route evidence:'), 'text export should retain legacy route evidence');

console.log('Smoke test passed.');
