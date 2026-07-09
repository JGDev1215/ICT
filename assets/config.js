(function(){
  'use strict';

  window.ICT_CONFIG = Object.assign({
    hostedPriceApiBase: 'https://ictict-lake.vercel.app/api/price',
    localPriceApiBase: 'http://127.0.0.1:8765/price',
    priceTimeoutMs: 8000,
    priceRefreshSeconds: 30,
    adminSupabaseEmail: 'admin@ict.local'
  }, window.ICT_CONFIG || {});
})();
