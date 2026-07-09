const {test, expect} = require('@playwright/test');

async function resetApp(page){
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

async function seedCard(page){
  await page.evaluate(() => {
    const api = window.ICTSweepState;
    const card = api.createBlankDraft({
      id: 'release-card',
      fields: {
        date: '2026-07-08',
        time: '09:30',
        instrument: 'MNQ',
        session: 'New York AM',
        currentPrice: '20000',
        bias: 'Bullish',
        dol1Level: '20250',
        dol1Draw: 'Previous day high (PDH)',
        dol1Tf: 'Daily',
        sweep1Level: '20100',
        sweep1Draw: 'Relative equal lows (REL)',
        sweep1Tf: '15m',
        fvg: true,
        fvgTf: '5m'
      },
      marketContext: {
        Monthly: {phase: 'Consolidation', note: 'Monthly range.', potentialNextPhase: ''},
        Weekly: {phase: 'Expansion', note: 'Weekly delivery.', potentialNextPhase: 'Retracement'},
        Daily: {phase: 'Retracement', note: 'Daily pullback.', potentialNextPhase: ''}
      },
      routeEvidence: [{arrayType: 'BISI', timeframe: '5m', level: '20020', behavior: 'Respect', notes: 'Release QA fixture.'}],
      riskPlan: {direction: 'Long', entryPrice: '20000', targetDolId: 'dol1', targetPrice: '20250', invalidationPrice: '19950'},
      outcome: 'Hit',
      finalSaved: true,
      journal: {tags: ['qa'], lesson: 'Release QA fixture.'},
      risk: {plannedRiskPct: '0.5', plannedR: '2R', maxLoss: '$50'}
    });
    api.saveCards([card]);
    api.go('home');
  });
}

test.describe('release QA evidence', () => {
  for(const width of [390, 430]){
    test(`mobile viewport ${width}px keeps nav and planner actions usable`, async ({page}) => {
      await page.setViewportSize({width, height: 844});
      await resetApp(page);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      const nav = page.locator("nav[aria-label='Primary']");
      await expect(nav).toBeVisible();
      const navBox = await nav.boundingBox();
      expect(navBox.y + navBox.height).toBeLessThanOrEqual(844);
      expect(navBox.y).toBeGreaterThan(700);

      await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
      await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();
      await expect(page.locator('#plannerActions')).toBeVisible();
      await page.locator('#instrument').focus();
      await expect(page.locator('#instrument')).toBeFocused();
    });
  }

  test('desktop viewport uses sidebar navigation and labeled new analysis action', async ({page}) => {
    await page.setViewportSize({width: 1200, height: 844});
    await resetApp(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    const nav = page.locator("nav[aria-label='Primary']");
    const main = page.locator('.app-main');
    await expect(nav).toBeVisible();
    await expect(main).toBeVisible();
    const navBox = await nav.boundingBox();
    const mainBox = await main.boundingBox();
    expect(navBox.x).toBeLessThan(mainBox.x);
    expect(navBox.height).toBeGreaterThan(navBox.width);
    expect(navBox.y + navBox.height).toBeLessThan(700);
    await expect(page.locator('.fab')).toBeHidden();
    await expect(page.locator('#globalNewDesktopBtn')).toBeVisible();
    await expect(page.locator('#globalNewDesktopBtn')).toContainText('New analysis');
  });

  test('all primary and secondary screens render with a saved focus card', async ({page}) => {
    await resetApp(page);
    await seedCard(page);

    const routes = [
      ['home', 'ICT Sweep Tracker'],
      ['planner', 'AI Trade Plan Builder'],
      ['saved', 'Saved Cards'],
      ['profile', 'Profile'],
      ['liquidity-map', 'Setup Library'],
      ['component-gallery', 'Component Gallery']
    ];

    for(const [route, text] of routes){
      await page.evaluate(nextRoute => window.ICTSweepState.go(nextRoute), route);
      await expect(page.getByText(text).first()).toBeVisible();
    }

    await page.evaluate(() => window.ICTSweepState.go('risk'));
    await expect(page.getByText('ICT Sweep Tracker')).toBeVisible();
    await expect(page.getByText('Risk tracker')).toHaveCount(0);

    await page.evaluate(() => window.ICTSweepState.go('journal'));
    await expect(page.getByText('ICT Sweep Tracker')).toBeVisible();
    await expect(page.getByRole('button', {name: /Journal/})).toHaveCount(0);

    await page.evaluate(() => window.ICTSweepState.go('focus', {id: 'release-card'}));
    await expect(page.getByText('Focus card details')).toBeVisible();
    await expect(page.getByText('Price Map Dashboard')).toBeVisible();

    await page.evaluate(() => window.ICTSweepState.go('timeline', {id: 'release-card'}));
    await expect(page.getByText('Execution timeline')).toBeVisible();
  });

  test('filter chips expose selected state for assistive technology', async ({page}) => {
    await resetApp(page);
    await seedCard(page);

    await page.evaluate(() => window.ICTSweepState.go('saved'));
    await expect(page.locator("[data-saved-filter='All']")).toHaveAttribute('aria-pressed', 'true');
    await page.locator("[data-saved-filter='Final Saved']").click();
    await expect(page.locator("[data-saved-filter='Final Saved']")).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator("[data-saved-filter='All']")).toHaveAttribute('aria-pressed', 'false');

    await page.evaluate(() => window.ICTSweepState.go('liquidity-map'));
    await expect(page.locator("[data-liquidity-filter='All']")).toHaveAttribute('aria-pressed', 'true');
    await page.locator("[data-liquidity-filter='DOL']").click();
    await expect(page.locator("[data-liquidity-filter='DOL']")).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator("[data-liquidity-filter='All']")).toHaveAttribute('aria-pressed', 'false');
  });

  test('service worker serves cached app shell while offline', async ({page, context, browserName}) => {
    test.skip(browserName === 'webkit', 'WebKit offline reload is covered by manual Safari/PWA QA because Playwright WebKit can fail with an internal reload error offline.');
    await resetApp(page);
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await page.reload();
    await expect(page.getByText('ICT Sweep Tracker')).toBeVisible();

    await context.setOffline(true);
    try {
      await page.reload({waitUntil: 'domcontentloaded'});
      await expect(page.getByText('ICT Sweep Tracker')).toBeVisible();
      await page.locator("nav[aria-label='Primary'] [data-route='planner']").click();
      await expect(page.getByText('AI Trade Plan Builder')).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
