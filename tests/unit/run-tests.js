const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const ok = (condition, message) => {
  if(!condition) throw Error(message);
};

const configSource = read('assets/config.js');
const appSource = read('assets/app.js');

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

function loadApp(options){
  const opts = options || {};
  const appNode = {innerHTML: '', parentNode: {insertBefore(){}}};
  const document = {
    body: {appendChild(){}, setAttribute(){}, removeAttribute(){}},
    documentElement: {setAttribute(){}},
    getElementById(id){
      return id === 'app' ? appNode : null;
    },
    querySelectorAll(){
      return [];
    },
    querySelector(){
      return null;
    },
    createElement(){
      return {setAttribute(){}, click(){}, remove(){}, select(){}};
    },
    execCommand(){
      return true;
    }
  };
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
    URL: {createObjectURL(){ return 'blob:test'; }, revokeObjectURL(){}},
    crypto: {randomUUID(){ return 'unit-' + Math.random().toString(16).slice(2); }},
    document,
    localStorage: makeStorage(opts.seed),
    location: opts.location || {protocol: 'https:', hostname: 'example.com', origin: 'https://example.com', pathname: '/'},
    history: {pushState(){}, replaceState(){}},
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
  return context.ICTSweepState;
}

const api = loadApp();

ok(api.priceNumber('20,123.50') === 20123.5, 'price parser should accept comma thousands');
ok(api.priceNumber('0') === null, 'price parser should reject zero');
ok(api.priceNumber('1e3') === null, 'price parser should reject scientific notation');

const complete = api.comp({
  instrument: 'MNQ',
  session: 'New York AM',
  bias: 'Bullish',
  manualPriceNeededAck: true,
  dol1Level: '20250',
  dol1Draw: 'Previous day high (PDH)',
  dol1Tf: 'Daily'
});
ok(complete.ok === true, 'completion should allow complete DOL with manual-price acknowledgement');
ok(api.comp({instrument: 'MNQ', session: 'New York AM', bias: 'Bullish'}).ok === false, 'completion should reject missing DOL and price');

const distance = api.dolDistance('20250', '20000');
ok(distance.absolute === '250' && distance.percent === '1.25%', 'DOL distance should calculate points and percent');

const riskFields = {currentPrice: '20000', dol1Level: '20250', dol1Draw: 'Previous day high (PDH)', dol1Tf: 'Daily'};
const risk = api.calculateRiskPlan({direction: 'Long', ratio: '2R', entryPrice: '20000'}, riskFields, 'dol1');
ok(risk.status === 'ready' && risk.rr === '2R' && risk.invalidationPrice === '19875', 'risk-to-reward should calculate derived long setup');
const shortRisk = api.calculateRiskPlan({direction: 'Short', ratio: '3R', entryPrice: '20000'}, Object.assign({}, riskFields, {dol1Level: '19850'}), 'dol1');
ok(shortRisk.status === 'ready' && shortRisk.rr === '3R' && shortRisk.invalidationPrice === '20050', 'risk-to-reward should calculate derived short setup');

const card = api.normaliseCard({
  id: 'unit-card',
  fields: {
    instrument: 'MNQ',
    session: 'New York AM',
    bias: 'Bullish',
    currentPrice: '20000',
    dol1Level: '20250',
    dol1Draw: 'Previous day high (PDH)',
    dol1Tf: 'Daily'
  }
});
ok(card.id === 'unit-card' && card.fields.currentPrice === '20000', 'card normalization should preserve core fields');
ok(card.priceSnapshot.source === 'manual', 'manual card normalization should preserve manual price source');

const exported = api.exportCards();
ok(exported.schema === api.SCHEMA && exported.settings, 'export should include schema and settings');
const settingsImport = api.importCards({settings: {defaultInstrument: 'ES', watchlist: ['ES', 'YM']}});
ok(settingsImport.settingsImported === true, 'settings import should be reported');
ok(api.getSettings().defaultInstrument === 'ES', 'settings import should persist default instrument');

const mapHtml = api.priceMapHtml(card.fields, {source: 'hosted-yfinance'});
ok(mapHtml.includes('Source: hosted yfinance API'), 'price map should expose hosted yfinance source');

const localApi = loadApp({location: {protocol: 'http:', hostname: 'localhost', origin: 'http://localhost:8000', pathname: '/'}});
ok(localApi.localPriceFallbackAllowed() === true, 'local price fallback should be allowed on localhost');

console.log('Unit tests passed.');
