const {test, expect} = require('@playwright/test');

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test('empty planner save draft is blocked', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  await page.locator('#saveDraftBtn').click();

  await expect(page.locator('#plannerValidation')).toContainText('Add at least one planning input before saving a draft.');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
});

test('empty planner generate focus plan is blocked', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  await page.locator('#nextBtn').click();

  await expect(page.locator('#plannerValidation')).toContainText('Instrument is required.');
  await expect(page.locator('#plannerValidation')).toContainText('Session is required.');
  await expect(page.locator('#plannerValidation')).toContainText('Add at least one complete DOL row');
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
});

test('partial meaningful planner draft can save', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#saveDraftBtn').click();

  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(1);
  await page.locator("nav[aria-label='Primary'] [data-route='saved']").click();
  await expect(page.getByText('Saved Cards')).toBeVisible();
  await expect(page.getByText('MNQ').first()).toBeVisible();
});

test('planner creates a focus card and preserves it after reload', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator('#currentPrice').fill('20000');
  await page.locator("[data-bias='Bullish']").click();
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');
  await page.locator('#sweep1Level').fill('20100');
  await page.locator('#sweep1Draw').selectOption('Relative equal lows (REL)');
  await page.locator('#sweep1Tf').selectOption('15m');

  await page.locator('#nextBtn').click();
  await expect(page.getByText('Focus card details')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');
  await expect(page.getByText('Price Map Dashboard')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Focus card details')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');

  await page.locator("nav[aria-label='Primary'] [data-route='saved']").click();
  await expect(page.getByText('Saved Cards')).toBeVisible();
  await expect(page.getByText('MNQ').first()).toBeVisible();
});

test('manual price acknowledgement restores and can generate complete no-sweep plan', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator("[data-bias='Bullish']").click();
  await page.locator('#manualPriceNeededAck').check();
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');

  await page.reload();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();
  await expect(page.locator('#manualPriceNeededAck')).toBeChecked();

  await page.locator('#nextBtn').click();
  await expect(page.getByText('Focus card details')).toBeVisible();
  await expect(page.getByText('Complete draft')).toBeVisible();
});

test('price auto-detect populates current price from a mocked helper response', async ({page}) => {
  await page.evaluate(() => {
    window.ICT_PRICE_API_BASE = `${window.location.origin}/api/price`;
    window.fetch = async () => new Response(JSON.stringify({
        symbol: 'MNQ',
        yfSymbol: 'MNQ=F',
        price: 29750.5,
        source: 'yfinance',
        cached: false,
        timestamp: '2026-07-09T13:35:00Z'
      }), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
      });
  });

  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await page.locator('#instrument').fill(' mnq ');
  await page.locator('#autoPriceBtn').click();

  await expect(page.locator('#instrument')).toHaveValue('MNQ');
  await expect(page.locator('#currentPrice')).toHaveValue('29750.5');
  await expect(page.locator('#priceStatusMessage')).toContainText('Detected from hosted yfinance API');
  await expect(page.locator('#globalStatus')).toContainText('Price auto-detected from hosted yfinance API');

  await page.locator("nav[aria-label='Primary'] [data-route='saved']").click();
  await expect(page.locator('#globalStatus')).toHaveCount(1);
});

test('local price fallback runs after hosted unsupported response in local context', async ({page}) => {
  await page.evaluate(() => {
    window.__priceUrls = [];
    window.ICT_PRICE_API_BASE = `${window.location.origin}/api/price`;
    window.fetch = async url => {
      window.__priceUrls.push(String(url));
      if(String(url).includes('127.0.0.1:8765')){
        return new Response(JSON.stringify({
          symbol: 'CUSTOM',
          yfSymbol: 'CUSTOM=F',
          price: 123.45,
          source: 'local-yfinance',
          cached: false,
          timestamp: '2026-07-09T13:35:00Z'
        }), {
          status: 200,
          headers: {'Content-Type': 'application/json'}
        });
      }
      return new Response(JSON.stringify({error: 'unsupported symbol', symbol: 'CUSTOM'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'}
      });
    };
  });

  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await page.locator('#instrument').fill('CUSTOM');
  await page.locator('#autoPriceBtn').click();

  await expect(page.locator('#currentPrice')).toHaveValue('123.45');
  await expect(page.locator('#priceStatusMessage')).toContainText('Detected from local yfinance helper');
  await expect.poll(() => page.evaluate(() => window.__priceUrls.some(url => url.includes('127.0.0.1:8765')))).toBe(true);
});

test('price auto-detect failure keeps manual price available', async ({page}) => {
  await page.evaluate(() => {
    window.ICT_PRICE_API_BASE = `${window.location.origin}/api/price`;
    window.fetch = async () => new Response(JSON.stringify({error: 'unsupported symbol', symbol: 'NOTREAL'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'}
    });
  });

  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await page.locator('#instrument').fill('NOTREAL');
  await page.locator('#currentPrice').fill('12345');
  await page.locator('#autoPriceBtn').click();

  await expect(page.locator('#currentPrice')).toHaveValue('12345');
  await expect(page.locator('#priceStatusMessage')).toContainText('Unsupported symbol');
  await expect(page.locator('#globalStatus')).toContainText('Unsupported symbol');
  await page.locator('#currentPrice').fill('12346');
  await expect(page.locator('#currentPrice')).toHaveValue('12346');
});

test('clear this device data is local-only and clears sync metadata', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({id: 'clear-e2e', fields: {instrument: 'MNQ'}});
    api.saveCards([card]);
    localStorage.setItem('ict_supabase_sync_queue_v1', JSON.stringify({cards: {queued: card}, deletes: {old: true}, settings: {theme: 'dark'}}));
    localStorage.setItem('ict_supabase_tombstones_v1', JSON.stringify({old: '2026-07-09T00:00:00.000Z'}));
    localStorage.setItem('ict_supabase_account_sync_v1', JSON.stringify({user: {localUpload: 'approved'}}));
    api.go('profile');
  });

  await expect(page.getByText('Clear this device data')).toBeVisible();
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Cloud backup is not deleted');
    await dialog.accept();
  });
  await page.locator('#clearDataBtn').click();

  await expect(page.locator('.save-state.warn')).toContainText('This device data was cleared');
  await expect(page.locator('.save-state.warn')).toHaveAttribute('role', 'status');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_cards_v078'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_sync_queue_v1'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_tombstones_v1'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_account_sync_v1'))).toBeNull();
});

test('json import through file input imports cards, settings, and schema warnings', async ({page}) => {
  await page.evaluate(() => window.ICTSweepState.go('profile'));
  await expect(page.getByRole('heading', {name: 'Profile'})).toBeVisible();

  const payload = {
    schema: 'ict_dol_sweep_export_v6',
    settings: {
      defaultInstrument: 'ES',
      defaultSession: 'London',
      theme: 'dark',
      watchlist: ['ES', 'YM'],
      riskDefaults: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '100'}
    },
    cards: [{
      id: 'import-ui-card',
      savedAt: '2026-07-09T12:00:00.000Z',
      updatedAt: '2026-07-09T12:00:00.000Z',
      fields: {
        instrument: 'ES',
        session: 'London',
        bias: 'Bearish',
        currentPrice: '5500',
        dol1Level: '5450',
        dol1Draw: 'Previous day low (PDL)',
        dol1Tf: 'Daily'
      }
    }]
  };

  await page.locator('#importFile').setInputFiles({
    name: 'ict-import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(payload))
  });

  await expect(page.locator('.save-state.warn')).toContainText('Imported file uses schema');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().some(card => card.id === 'import-ui-card'))).toBe(true);
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getSettings().defaultInstrument)).toBe('ES');

  await page.evaluate(() => window.ICTSweepState.go('saved'));
  await expect(page.getByText('ES').first()).toBeVisible();
});

test('invalid json import through file input shows warning without changing cards', async ({page}) => {
  await page.evaluate(() => window.ICTSweepState.go('saved'));
  await expect(page.getByText('Saved Cards')).toBeVisible();

  await page.locator('#importFile').setInputFiles({
    name: 'invalid-import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({notCards: true}))
  });

  await expect(page.locator('.save-state.warn')).toContainText('No valid cards or settings found');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
});

test('bad notices render as alerts', async ({page}) => {
  await page.evaluate(() => {
    window.ICTSweepState.setNotice('Forced failure notice.', 'bad');
    window.ICTSweepState.go('home');
  });

  await expect(page.locator('.save-state.bad')).toContainText('Forced failure notice.');
  await expect(page.locator('.save-state.bad')).toHaveAttribute('role', 'alert');
  await expect(page.locator('#globalStatus')).toContainText('Forced failure notice.');
});

test('planner skip link reaches sticky actions without changing route', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();

  const skip = page.locator('.skip-link');
  await skip.focus();
  await expect(skip).toBeFocused();
  await skip.press('Enter');

  await expect(page.locator('#plannerActions')).toBeFocused();
  await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();
});

test('home session chips filter the visible focus card', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const nyCard = api.createBlankDraft({
      id: 'ny-card',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily'
      },
      finalSaved: true,
      outcome: 'Hit'
    });
    const londonCard = api.createBlankDraft({
      id: 'london-card',
      fields: {
        instrument: 'ES',
        session: 'London',
        currentPrice: '5500',
        dol1Level: '5450',
        dol1Draw: 'Previous day low (PDL)',
        dol1Tf: 'Daily'
      },
      finalSaved: true,
      outcome: 'Miss'
    });
    api.saveCards([nyCard, londonCard]);
    api.go('home');
  });

  await page.locator("[data-session-chip='London']").click();
  await expect(page.getByText('Showing London cards and metrics.')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('ES');

  await page.locator("[data-session-chip='New York AM']").click();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');
});

test('focus card derives potential R:R from current price and selected DOL', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({
      id: 'rr-card',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        bias: 'Bullish',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily'
      }
    });
    api.saveCards([card]);
    api.go('focus', {id: 'rr-card'});
  });

  await expect(page.getByText('Focus card details')).toBeVisible();
  await page.locator('#riskDirection').selectOption('Long');
  await page.locator('#riskTargetDol').selectOption('dol1');
  await page.locator('#riskRatio').selectOption('2R');
  await page.locator('#saveChangesBtn').click();

  await expect(page.getByText('19875')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'rr-card').riskPlan.invalidationPrice)).toBe('19875');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'rr-card').riskPlan.riskPoints)).toBe('125');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'rr-card').riskPlan.rewardPoints)).toBe('250');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'rr-card').riskPlan.rr)).toBe('2R');
});

test('price map and DOL stack share DOL taken state', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({
      id: 'mirror-card',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        bias: 'Bullish',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily'
      }
    });
    api.saveCards([card]);
    api.go('focus', {id: 'mirror-card'});
  });

  await expect(page.locator('#priceMap_dol1Taken')).toBeVisible();
  await expect(page.locator('#focus_dol1Taken')).toBeVisible();
  await page.locator('#priceMap_dol1Taken').check();
  await expect(page.locator('#focus_dol1Taken')).toBeChecked();
  await page.locator('#saveChangesBtn').click();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'mirror-card').fields.dol1Taken)).toBe(true);

  await page.reload();
  await expect(page.locator('#priceMap_dol1Taken')).toBeChecked();
  await expect(page.locator('#focus_dol1Taken')).toBeChecked();
  await page.locator('#focus_dol1Taken').uncheck();
  await expect(page.locator('#priceMap_dol1Taken')).not.toBeChecked();
  await page.locator('#saveChangesBtn').click();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().find(card => card.id === 'mirror-card').fields.dol1Taken)).toBe(false);
});
