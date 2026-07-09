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
  await page.locator('#currentPrice').fill('12346');
  await expect(page.locator('#currentPrice')).toHaveValue('12346');
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
  await expect(page.getByText('Showing Home cards and metrics for London.')).toBeVisible();
  await expect(page.locator('.card-hero h2')).toHaveText('ES');

  await page.locator("[data-session-chip='New York AM']").click();
  await expect(page.locator('.card-hero h2')).toHaveText('MNQ');
});
