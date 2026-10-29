import { test, expect } from '@playwright/test';

const projects = ['cupexs', 'lara', 'active-spoiler', 'sumo-2026'];

test('CAD viewers load, respond to keyboard and zoom, and reset', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const project of projects) {
    await page.goto(`/projects/${project}`);
    const viewer = page.locator('.cad-viewer');
    await expect(viewer).toHaveAttribute('data-state', 'ready', { timeout: 30000 });
    const canvas = viewer.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(viewer.getByRole('button', { name: 'Explore in 3D' })).toBeVisible();
    await expect(canvas).toHaveAttribute('aria-label', /arrow keys/);
    await canvas.scrollIntoViewIfNeeded();
    const initial = await canvas.screenshot();
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    expect((await canvas.screenshot()).equals(initial)).toBe(false);
    await viewer.getByRole('button', { name: 'Reset view' }).click();
    expect((await canvas.screenshot()).equals(initial)).toBe(true);
    await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click();
    expect((await canvas.screenshot()).equals(initial)).toBe(false);
    await viewer.getByRole('button', { name: 'Reset view' }).click();
    await viewer.screenshot({ path: `test-results/cad-${project}-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await viewer.screenshot({ path: `test-results/cad-${project}-mobile.png` });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  expect(errors).toEqual([]);
});

test('six card zones rotate horizontally, reset on leave, and preserve links', async ({ page }) => {
  const modelsRequested: string[] = [];
  page.on('request', request => {
    if (/\.glb|cad-viewer.*\.js/.test(request.url())) modelsRequested.push(request.url());
  });
  await page.goto('/');
  for (const project of projects) {
    const card = page.locator('.project-card').filter({ has: page.locator(`a[href="/projects/${project}"]`) });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute('data-turntable-ready', 'true');
    const bounds = (await card.boundingBox())!;
    for (let frame = 0; frame < 6; frame++) {
      const x = bounds.x + bounds.width * (frame + 0.5) / 6;
      await page.mouse.move(x, bounds.y + 90);
      await expect(card).toHaveAttribute('data-frame', String(frame));
      await expect(card.locator('.project-media img')).toHaveAttribute('src', new RegExp(`${String(frame * 60).padStart(3, '0')}\\.webp$`));
      await page.mouse.move(x, bounds.y + 160);
      await expect(card).toHaveAttribute('data-frame', String(frame));
    }
    await card.screenshot({ path: `test-results/turntable-${project}.png` });
    await page.mouse.move(0, 0);
    await expect(card).toHaveAttribute('data-frame', '0');
  }
  expect(modelsRequested).toEqual([]);
  await page.getByRole('link', { name: 'Explore CupExS Drag Racer', exact: true }).last().click();
  await expect(page).toHaveURL(/\/projects\/cupexs$/);
});

test('reduced motion and touch devices keep static cards without extra frames', async ({ browser }) => {
  for (const settings of [{ reducedMotion: 'reduce' as const }, { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } }]) {
    const context = await browser.newContext(settings);
    const page = await context.newPage();
    const extraFrames: string[] = [];
    page.on('request', request => {
      if (/turntables\/[^/]+\/(060|120|180|240|300)\.webp/.test(request.url())) extraFrames.push(request.url());
    });
    await page.goto('http://127.0.0.1:4173/');
    const card = page.locator('.project-card').filter({ hasText: 'CupExS Drag Racer' });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('.project-media img')).toBeVisible();
    await expect(card).toHaveAttribute('data-turntable-ready', 'false');
    await card.dispatchEvent('pointermove', { pointerType: settings.hasTouch ? 'touch' : 'mouse', clientX: 350, clientY: 200 });
    await expect(card).toHaveAttribute('data-frame', '0');
    expect(extraFrames).toEqual([]);
    await context.close();
  }
});

test('failed model and renderer leave a usable project poster', async ({ page }) => {
  await page.route('**/media/models/cupexs.glb', route => route.abort());
  await page.goto('/projects/cupexs');
  await expect(page.getByRole('status')).toHaveText('3D view unavailable. Showing the project image.');
  await expect(page.locator('.project-media img')).toBeVisible();
  await expect(page.locator('.cad-viewer')).toHaveCount(0);
  await page.unroute('**/media/models/cupexs.glb');
  await page.goto('/projects/cupexs');
  await expect(page.locator('.cad-viewer')).toHaveAttribute('data-state', 'ready', { timeout: 30000 });
  await page.locator('.cad-viewer canvas').dispatchEvent('webglcontextlost');
  await expect(page.getByRole('status')).toHaveText('3D view unavailable. Showing the project image.');
  await expect(page.locator('.project-media img')).toBeVisible();
});

test('an incomplete turntable retains the static cover', async ({ page }) => {
  await page.route('**/turntables/cupexs/120.webp', route => route.abort());
  await page.goto('/');
  const card = page.locator('.project-card').filter({ hasText: 'CupExS Drag Racer' });
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.locator('.project-media img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await card.hover();
  await expect(card).toHaveAttribute('data-turntable-ready', 'false');
  await expect(card.locator('.project-media img')).toHaveAttribute('src', /000\.webp$/);
});
