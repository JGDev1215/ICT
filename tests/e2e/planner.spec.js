const {test, expect} = require('@playwright/test');

async function unlockApp(page, passcode = '5880'){
  await expect(page.locator('#appPasscodeInput')).toBeVisible();
  await page.locator('#appPasscodeInput').fill(passcode);
  await page.locator('#unlockAppBtn').click();
  await expect(page.locator('#appPasscodeInput')).toHaveCount(0);
}

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await unlockApp(page);
});

test('app starts locked and accepts the default passcode', async ({page}) => {
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await expect(page.getByText('Enter app passcode')).toBeVisible();
  await expect(page.getByText('ICT Sweep Tracker')).toHaveCount(0);
  await page.locator('#appPasscodeInput').fill('5880');
  await page.locator('#unlockAppBtn').click();

  await expect(page.getByText('ICT Sweep Tracker')).toBeVisible();
});

test('wrong app passcode keeps normal app content hidden', async ({page}) => {
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await page.locator('#appPasscodeInput').fill('1234');
  await page.locator('#unlockAppBtn').click();

  await expect(page.getByText('Incorrect passcode.')).toBeVisible();
  await expect(page.getByText('ICT Sweep Tracker')).toHaveCount(0);
});

test('empty planner save draft is blocked', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  await page.locator('#saveDraftBtn').click();

  await expect(page.locator('#plannerValidation')).toContainText('Add at least one planning input before saving a draft.');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
});

test('empty planner generate focus plan is blocked', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  await page.locator('#nextBtn').click();

  await expect(page.locator('#plannerValidation')).toContainText('Instrument is required.');
  await expect(page.locator('#plannerValidation')).toContainText('Session is required.');
  await expect(page.locator('#plannerValidation')).toContainText('Add at least one complete DOL row');
  await expect(page.getByText('Build a plan for review')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
});

test('partial meaningful planner draft can save', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#saveDraftBtn').click();

  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(1);
  await page.locator("nav[aria-label='Primary'] [data-route='saved']").click();
  await expect(page.getByText('Saved Cards')).toBeVisible();
  await expect(page.getByText('MNQ').first()).toBeVisible();
});

test('planner creates a focus card and preserves it after reload', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator('#currentPrice').fill('20000');
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');
  await page.locator('#sweep1Level').fill('20100');
  await page.locator('#sweep1Draw').selectOption('Relative equal lows (REL)');
  await page.locator('#sweep1Tf').selectOption('15m');

  await page.locator('#nextBtn').click();
  await expect(page.getByText('Plan Review')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');
  await expect(page.getByText('Price Map Dashboard')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Plan Review')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');

  await page.locator("nav[aria-label='Primary'] [data-route='saved']").click();
  await expect(page.getByText('Saved Cards')).toBeVisible();
  await expect(page.getByText('MNQ').first()).toBeVisible();
});

test('manual price acknowledgement restores and can generate complete no-sweep plan', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator('#manualPriceNeededAck').check();
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');

  await page.reload();
  await expect(page.getByText('Build a plan for review')).toBeVisible();
  await expect(page.locator('#manualPriceNeededAck')).toBeChecked();

  await page.locator('#nextBtn').click();
  await expect(page.getByText('Plan Review')).toBeVisible();
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

  await expect(page.getByText('This device data was cleared. Enter the app passcode to continue.')).toBeVisible();
  await expect(page.locator('#appPasscodeInput')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards().length)).toBe(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_cards_v078'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_sync_queue_v1'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_tombstones_v1'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ict_supabase_account_sync_v1'))).toBeNull();
});

test('profile backup sign-in uses a 4 digit PIN field', async ({page}) => {
  await page.evaluate(() => {
    window.supabase = {
      createClient: () => ({
        auth: {
          getSession: async () => ({data: {session: null}, error: null}),
          onAuthStateChange: () => ({data: {subscription: {unsubscribe: () => {}}}}),
          signInWithPassword: async args => {
            window.__pinLoginArgs = args;
            return {data: {session: {user: {id: 'pin-user'}}}, error: null};
          }
        },
        from: () => ({
          select: () => ({eq: () => Promise.resolve({data: [], error: null})}),
          upsert: () => Promise.resolve({error: null}),
          delete: () => ({eq: () => Promise.resolve({error: null})})
        })
      })
    };
    window.ICTSweepState.go('profile');
  });

  await expect(page.locator('#adminPin')).toBeVisible();
  await expect(page.locator('#adminPin')).toHaveAttribute('maxlength', '4');
  await expect(page.locator('#adminPin')).toHaveAttribute('inputmode', 'numeric');
  await expect(page.locator('#adminUsername')).toHaveCount(0);
  await expect(page.locator('#adminPassword')).toHaveCount(0);

  await page.locator('#adminPin').fill('12ab');
  await page.locator('#adminLoginBtn').click();
  await expect(page.locator('#globalStatus')).toContainText('Enter the 4-digit PIN.');
  await expect.poll(() => page.evaluate(() => window.__pinLoginArgs || null)).toBeNull();
});

test('profile can change the device-local app passcode', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='profile']").click();
  await expect(page.getByRole('heading', {name: 'Profile'})).toBeVisible();

  await page.locator('#currentAppPasscode').fill('5880');
  await page.locator('#newAppPasscode').fill('2468');
  await page.locator('#confirmAppPasscode').fill('2468');
  await page.locator('#changeAppPasscodeBtn').click();
  await expect(page.locator('#globalStatus')).toContainText('App passcode updated.');

  await page.locator('#lockAppBtn').click();
  await expect(page.getByText('Enter app passcode')).toBeVisible();
  await page.locator('#appPasscodeInput').fill('5880');
  await page.locator('#unlockAppBtn').click();
  await expect(page.getByText('Incorrect passcode.')).toBeVisible();
  await page.locator('#appPasscodeInput').fill('2468');
  await page.locator('#unlockAppBtn').click();
  await expect(page.getByRole('heading', {name: 'Profile'})).toBeVisible();
});

test('focus card manual price override saves a new snapshot', async ({page}) => {
  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator('#currentPrice').fill('20000');
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');
  await page.locator('#nextBtn').click();
  await expect(page.getByText('Plan Review')).toBeVisible();

  await expect(page.locator('#focusPriceMode')).toHaveValue('manual');
  await page.locator('#focusCurrentPrice').fill('20111');
  await page.locator('#saveChangesBtn').click();

  await expect(page.locator('.snapshot-value')).toContainText('20111');
  await expect.poll(() => page.evaluate(() => {
    const card = window.ICTSweepState.getCards()[0];
    return card.priceSnapshot.price;
  })).toBe('20111');
});

test('focus card live price mode previews mocked price and stores it on save', async ({page}) => {
  await page.evaluate(() => {
    window.ICT_PRICE_API_BASE = `${window.location.origin}/api/price`;
    window.fetch = async () => new Response(JSON.stringify({
      symbol: 'MNQ',
      yfSymbol: 'MNQ=F',
      price: 20555.25,
      source: 'yfinance',
      cached: false,
      timestamp: '2026-07-10T12:00:00Z'
    }), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });
  });

  await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
  await page.locator('#instrument').fill('MNQ');
  await page.locator('#session').selectOption('New York AM');
  await page.locator('#currentPrice').fill('20000');
  await page.locator('#dol1Level').fill('20250');
  await page.locator('#dol1Draw').selectOption('Previous day high (PDH)');
  await page.locator('#dol1Tf').selectOption('Daily');
  await page.locator('#nextBtn').click();
  await expect(page.getByText('Plan Review')).toBeVisible();

  await page.locator('#focusPriceMode').selectOption('live');
  await expect(page.getByText('Live price preview')).toBeVisible();
  await expect(page.locator('.snapshot-value')).toContainText('20555.25');
  await expect.poll(() => page.evaluate(() => window.ICTSweepState.getCards()[0].priceSnapshot.price)).toBe('20000');

  await page.locator('#saveChangesBtn').click();
  await expect.poll(() => page.evaluate(() => {
    const card = window.ICTSweepState.getCards()[0];
    return `${card.priceMode}:${card.priceSnapshot.price}:${card.priceSnapshot.source}`;
  })).toBe('live:20555.25:hosted-yfinance');
});

test('final-saved cards do not allow price mode changes', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({
      id: 'locked-price-card',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily'
      },
      outcome: 'Hit',
      finalSaved: true
    });
    api.saveCards([Object.assign({}, card, {finalSaved: true, outcome: 'Hit'})]);
    api.go('focus', {id: 'locked-price-card'});
  });

  await expect(page.getByText('Plan Review')).toBeVisible();
  await expect(page.getByText('Final card locked')).toBeVisible();
  await expect(page.locator('#focusPriceMode')).toHaveCount(0);
  await expect(page.getByText('Price overrides are disabled.')).toBeVisible();
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
  await expect(page.getByText('Build a plan for review')).toBeVisible();

  const skip = page.locator('.skip-link');
  await skip.focus();
  await expect(skip).toBeFocused();
  await skip.press('Enter');

  await expect(page.locator('#plannerActions')).toBeFocused();
  await expect(page.getByText('Build a plan for review')).toBeVisible();
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

test('legacy bias and risk data stay hidden in active focus UI but export', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({
      id: 'legacy-hidden-card',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        bias: 'Bullish',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily'
      },
      marketContext: {
        Daily: {phase: 'Expansion', note: 'Legacy market note.', potentialNextPhase: 'Retracement'}
      },
      routeEvidence: [{arrayType: 'BISI', timeframe: '5m', level: '20020', behavior: 'Respect', notes: 'Legacy route note.'}],
      riskPlan: {direction: 'Long', ratio: '2R', entryPrice: '20000', targetDolId: 'dol1', invalidationPrice: '19875', riskPoints: '125', rewardPoints: '250', rr: '2R', status: 'ready'}
    });
    api.saveCards([card]);
    api.go('focus', {id: 'legacy-hidden-card'});
  });

  await expect(page.getByText('Plan Review')).toBeVisible();
  await expect(page.getByText('Price Map Dashboard')).toBeVisible();
  await expect(page.getByText('Bias Determination For Session')).toHaveCount(0);
  await expect(page.getByText('Market Context')).toHaveCount(0);
  await expect(page.getByText('Route to DOL / PD array evidence')).toHaveCount(0);
  await expect(page.getByText('Potential risk-to-reward')).toHaveCount(0);
  await expect(page.locator('#riskDirection')).toHaveCount(0);
  await expect(page.locator('#riskRatio')).toHaveCount(0);
  await expect(page.locator('#routeArrayType')).toHaveCount(0);

  const exported = await page.evaluate(() => window.ICTSweepState.exportCards().cards.find(card => card.id === 'legacy-hidden-card'));
  expect(exported.fields.bias).toBe('Bullish');
  expect(exported.marketContext.Daily.note).toBe('Legacy market note.');
  expect(exported.routeEvidence[0].notes).toBe('Legacy route note.');
  expect(exported.riskPlan.invalidationPrice).toBe('19875');
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

test('final-saved cards are locked from further edits', async ({page}) => {
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.normaliseCard({
      id: 'locked-e2e-card',
      savedAt: '2026-07-09T14:00:00.000Z',
      updatedAt: '2026-07-09T14:00:00.000Z',
      fields: {
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily',
        dol1Taken: true
      },
      outcome: 'Hit',
      finalSaved: true,
      notes: 'Locked note'
    });
    api.saveCards([card]);
    api.go('focus', {id: 'locked-e2e-card'});
  });

  await expect(page.getByText('Final card locked')).toBeVisible();
  await expect(page.locator('#saveChangesBtn')).toHaveCount(0);
  await expect(page.locator('#finalSaveBtn')).toHaveCount(0);
  await expect(page.locator('#deleteBtn')).toHaveCount(0);
  await expect(page.locator('#loadBtn')).toHaveCount(0);
  await expect(page.locator('#reviewOutcome')).toBeDisabled();
  await expect(page.locator('#reviewNotes')).toBeDisabled();
  await expect(page.locator('#focus_dol1Taken')).toBeDisabled();
  await expect(page.locator('#priceMap_dol1Taken')).toHaveCount(0);

  const blocked = await page.evaluate(() => {
    const api = window.ICTSweepState;
    const update = api.updateCard('locked-e2e-card', {fields: {instrument: 'LOCKED'}});
    const favorite = api.toggleFavorite('locked-e2e-card');
    const deleted = api.deleteCard('locked-e2e-card');
    const card = api.getCards().find(item => item.id === 'locked-e2e-card');
    return {update, favorite, deleted, instrument: card.fields.instrument, error: api.lastStorageError()};
  });
  expect(blocked.update).toBeNull();
  expect(blocked.favorite).toBeNull();
  expect(blocked.deleted).toBe(false);
  expect(blocked.instrument).toBe('MNQ');
  expect(blocked.error).toContain('Final-saved cards are locked');
});
