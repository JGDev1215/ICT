const {test, expect} = require('@playwright/test');

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
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
