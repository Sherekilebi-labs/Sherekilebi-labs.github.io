import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const projectIds = ['lara', 'active-spoiler', 'sumo-2026', 'cupexs', 'door-security', 'gym-scale'];

test('new branding, removed sections, combined filters, and official GitHub links', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Built by eccentrics/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/tsatmfreni.svg');
  await expect(page.locator('.site-header .brand img')).toHaveAttribute('src', '/tsatmfreni.svg');
  await expect(page.locator('.site-footer .brand img')).toHaveAttribute('src', '/Sherekilebi logo.png');
  await expect(page.locator('.project-grid .project-card')).toHaveCount(6);
  await expect(page.getByText('Three ways to explore.')).toHaveCount(0);
  await expect(page.getByText('Research & build domains')).toHaveCount(0);
  await expect(page.getByText('Actuator A0', { exact: true })).toHaveCount(0);
  await expect(page.getByText('RoBook', { exact: true })).toHaveCount(0);
  await expect(page.getByText('AeroDHS', { exact: true })).toHaveCount(0);
  await expect(page.locator('.hero-stats').first()).toContainText('06');
  await expect(page.locator('.hero h1')).toHaveCSS('font-weight', '700');
  const titleFamily = await page.locator('.hero h1').evaluate(element => getComputedStyle(element).fontFamily);
  expect(titleFamily).toContain('Helvetica');
  expect(titleFamily).not.toMatch(/Eurostile|Michroma/);
  await expect(page.locator('.person-card')).toHaveCount(3);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/Sherekilebi-labs');
  await page.getByRole('button', { name: 'Competition', exact: true }).click();
  await expect(page.locator('.project-grid .project-card')).toHaveCount(2);
  await page.getByLabel('Filter by technology').selectOption('MPU6050');
  await expect(page.getByText('No experiments on this frequency.')).toBeVisible();
  await page.getByRole('button', { name: 'Show all projects' }).click();
  await expect(page.locator('.project-grid .project-card')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('tape auto-roll starts every two seconds, holds on hover, and yields to manual arrows', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: 'Featured projects' });
  await expect(carousel).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 02 // 05', { timeout: 3400 });
  await carousel.hover();
  await expect(carousel).toHaveAttribute('data-mode', 'HOLD');
  await expect(carousel.locator('.tape-track')).toHaveAttribute('data-phase', 'idle');
  const held = await carousel.locator('.tape-counter').textContent();
  await page.waitForTimeout(2200);
  await expect(carousel.locator('.tape-counter')).toHaveText(held!);
  await expect(carousel.getByRole('button', { name: /play|pause/i })).toHaveCount(0);
  await carousel.getByRole('button', { name: 'Previous featured project' }).click();
  await expect(carousel).toHaveAttribute('data-mode', 'MANUAL STEP');
  await expect(carousel.locator('.tape-track')).toHaveAttribute('data-phase', 'idle');
  const manual = await carousel.locator('.tape-counter').textContent();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2200);
  await expect(carousel.locator('.tape-counter')).toHaveText(manual!);
  await expect(carousel.getByRole('link', { name: 'Explore LARA', exact: true })).toHaveAttribute('href', '/projects/lara');
  await carousel.getByRole('link', { name: 'Explore LARA', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/lara$/);
  await expect(page.getByRole('heading', { name: 'LARA', exact: true })).toBeVisible();
});

test('one physical track stays gapless and wraps one frame in either direction', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: 'Featured projects' });
  await carousel.hover();
  const track = carousel.locator('.tape-track');
  async function inspectStep(button: string, direction: number) {
    await carousel.getByRole('button', { name: button }).click();
    await expect(track).toHaveAttribute('data-phase', 'rolling');
    await expect.poll(() => track.evaluate(element => element.getAnimations().length)).toBeGreaterThan(0);
    const geometry = await track.evaluate(element => {
      const animation = element.getAnimations()[0];
      animation.pause();
      const duration = Number(animation.effect!.getTiming().duration);
      animation.currentTime = 0;
      const start = element.getBoundingClientRect().left;
      animation.currentTime = duration / 2;
      const middle = element.getBoundingClientRect().left;
      const frames = [...element.children].map(frame => {
        const box = frame.getBoundingClientRect();
        return { left: box.left, right: box.right, opacity: getComputedStyle(frame).opacity, imageOpacity: getComputedStyle(frame.querySelector('img')!).opacity };
      });
      const width = element.getBoundingClientRect().width;
      animation.currentTime = duration;
      const end = element.getBoundingClientRect().left;
      animation.finish();
      return { start, middle, end, width, frames, duration, easing: getComputedStyle(element).transitionTimingFunction };
    });
    expect(geometry.duration).toBe(600);
    expect(geometry.easing).toBe('cubic-bezier(0.22, 1, 0.36, 1)');
    expect(Math.abs(geometry.end - geometry.start + direction * geometry.width)).toBeLessThan(1);
    expect(Math.abs(geometry.middle - geometry.start)).toBeGreaterThan(0);
    expect(Math.abs(geometry.middle - geometry.start)).toBeLessThan(geometry.width);
    for (let i = 0; i < geometry.frames.length; i++) {
      expect(geometry.frames[i].opacity).toBe('1');
      expect(geometry.frames[i].imageOpacity).toBe('1');
      if (i) expect(Math.abs(geometry.frames[i].left - geometry.frames[i - 1].right)).toBeLessThan(0.1);
    }
    await expect(track).toHaveAttribute('data-phase', 'idle');
    expect(await track.evaluate(element => element.getAnimations().length)).toBe(0);
  }
  await inspectStep('Previous featured project', -1);
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 05 // 05');
  await inspectStep('Next featured project', 1);
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 01 // 05');
  await inspectStep('Next featured project', 1);
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 02 // 05');
});

test('keyboard and swipes take manual control, including input during a roll', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: 'Featured projects' });
  await carousel.focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel).toHaveAttribute('data-mode', 'MANUAL STEP');
  await page.keyboard.press('ArrowLeft');
  await expect(carousel.locator('.tape-track')).toHaveAttribute('data-phase', 'idle');
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 01 // 05');
  const window = carousel.locator('.tape-window');
  await window.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 250, clientY: 150 });
  await window.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 100, clientY: 155 });
  await window.dispatchEvent('click');
  await expect(page).toHaveURL(/\/$/);
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 02 // 05');
  await expect(carousel.locator('.tape-track')).toHaveAttribute('data-phase', 'idle');
  await window.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 100, clientY: 150 });
  await window.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 250, clientY: 155 });
  await expect(carousel.locator('.tape-counter')).toHaveText('FRAME 01 // 05');
});

test('project routes load directly and source links match the uploaded repositories', async ({ page }) => {
  const links: Record<string, string> = { 'active-spoiler': 'Active-Spoiler', 'door-security': 'Door-Security-System', cupexs: 'CupExS-drag-racer', 'gym-scale': 'GYM-scale' };
  for (const id of projectIds) {
    const response = await page.goto(`/projects/${id}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('.project-page h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sherekilebi Labs on GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/Sherekilebi-labs');
    if (links[id]) await expect(page.getByRole('link', { name: 'Open GitHub repository' })).toHaveAttribute('href', `https://github.com/Sherekilebi-labs/${links[id]}`);
  }
  await page.goto('/projects/door-security');
  await expect(page.locator('.engineering-notes')).toContainText('38 kHz');
  await page.goto('/projects/active-spoiler');
  await expect(page.locator('.engineering-notes')).toContainText('does not implement gyro fusion');
  await page.goto('/projects/sumo-2026');
  await expect(page.locator('.engineering-notes')).toContainText('two active-low edge inputs');
  await expect(page.getByRole('link', { name: 'Earlier RoboSumo 2024 firmware' })).toHaveAttribute('href', 'https://github.com/ChoteX/RoboSumo-2024');
});

test('dispatches pin announcements, filter categories, expand Markdown, and cross-link projects', async ({ page }) => {
  await page.goto('/news');
  await expect(page.getByRole('heading', { name: 'Lab Dispatches // Flight Log' })).toBeVisible();
  await expect(page.locator('.dispatch-timeline .dispatch-card')).toHaveCount(10);
  await expect(page.locator('.dispatch-timeline .dispatch-card').first()).toHaveAttribute('id', '2026-10-13-drawer-for-every-idea');
  await page.getByRole('button', { name: 'Shenanigans', exact: true }).click();
  await expect(page.locator('.dispatch-timeline .dispatch-card')).toHaveCount(2);
  await expect(page.locator('.micro-label')).toHaveCount(2);
  await page.getByRole('link', { name: 'Linked project: Door Security System' }).click();
  await expect(page).toHaveURL(/\/projects\/door-security$/);
  await page.goto('/news#2026-10-24-dyno-on-the-bench');
  const post = page.locator('[id="2026-10-24-dyno-on-the-bench"]');
  await post.getByText('Read the field notes').click();
  await expect(post.locator('.dispatch-reader')).toHaveAttribute('open', '');
  await expect(post.locator('pre code')).toContainText('MT6701_SDA_PIN');
  await expect(post.locator('.hljs-keyword').first()).toBeVisible();
  await expect(post.getByRole('link', { name: 'Linked project: CupExS Drag Racer' })).toHaveAttribute('href', '/projects/cupexs');
});

test('homepage preview contains three most recent dispatches and the correct deep links', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Latest Lab Dispatches' });
  await expect(section.locator('.dispatch-card')).toHaveCount(3);
  const links = await section.locator('.dispatch-read-link').evaluateAll(items => items.map(item => item.getAttribute('href')));
  expect(links).toEqual(['/news#2026-10-24-dyno-on-the-bench','/news#2026-10-24-unscheduled-inspector','/news#2026-10-18-spoiler-wiring']);
  await section.getByRole('link', { name: 'The complete flight log' }).click();
  await expect(page).toHaveURL(/\/news$/);
});

test('missing project media falls back and reduced motion disables autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/media/web/door-security-icon.webp', route => route.abort());
  await page.goto('/projects/door-security');
  await expect(page.getByText('Illustrative schematic · image unavailable')).toBeVisible();
  await expect(page.locator('.project-media svg')).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Featured projects' })).toHaveAttribute('data-mode', 'STILL MODE');
  await expect(page.getByRole('button', { name: /play|pause/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Next featured project' }).click();
  await expect(page.locator('.tape-counter')).toHaveText('FRAME 02 // 05');
  await expect(page.locator('.tape-track')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior','auto');
  const duration = await page.locator('.news-dot').evaluate(element => parseFloat(getComputedStyle(element).animationDuration));
  expect(duration).toBeLessThanOrEqual(0.01);
});

test('desktop and mobile layouts fit, navigation works, and previews are captured', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const deck = await page.locator('.project-carousel').boundingBox();
  const hero = await page.locator('.hero-grid').boundingBox();
  const divider = await page.locator('.hero-bottom').boundingBox();
  expect(Math.abs(deck!.y - hero!.y)).toBeLessThan(1);
  expect(Math.abs(deck!.y + deck!.height - divider!.y)).toBeLessThan(1);
  expect(Math.abs(deck!.x + deck!.width - hero!.x - hero!.width)).toBeLessThan(1);
  await page.screenshot({ path: 'test-results/desktop-hero.png' });
  await page.screenshot({ path: 'test-results/desktop-full.png', fullPage: true });
  for (const route of ['/', '/news', '/projects/door-security', '/projects/cupexs']) {
    await page.goto(route);
    if (route.startsWith('/projects/')) await expect(page.locator('.project-page h1')).toBeVisible();
    else if (route === '/news') await expect(page.locator('.news-header h1')).toBeVisible();
    else await expect(page.locator('.hero h1')).toBeVisible();
    for (const width of [1440,1024,768,740,600,480,390,320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'test-results/mobile-hero.png' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Dispatches' }).click();
  await expect(page).toHaveURL(/\/news$/);
  await expect(page.locator('.news-header h1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded','false');
  await page.screenshot({ path: 'test-results/mobile-news.png' });
  await page.goto('/projects/door-security');
  await expect(page.locator('.project-page h1')).toBeVisible();
  await expect.poll(() => page.locator('.project-media img').first().evaluate(image => (image as HTMLImageElement).complete)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-project.png' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/news');
  await expect(page.locator('.news-header h1')).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-news.png' });
  await page.goto('/projects/active-spoiler');
  await expect(page.locator('.project-page h1')).toBeVisible();
  await expect.poll(() => page.locator('.project-media img').first().evaluate(image => (image as HTMLImageElement).complete)).toBe(true);
  await page.screenshot({ path: 'test-results/desktop-project.png' });
});

test('home, dispatch feed, expanded Markdown, and project reader pass accessibility checks', async ({ page }) => {
  for (const route of ['/', '/news', '/projects/door-security']) {
    await page.goto(route);
    if (route.startsWith('/projects/')) await expect(page.locator('.project-page h1')).toBeVisible();
    else if (route === '/news') await expect(page.locator('.news-header h1')).toBeVisible();
    else await expect(page.locator('.hero h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (route === '/news') await page.locator('[id="2026-10-24-dyno-on-the-bench"] summary').click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, details: n.failureSummary })) }))).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(mobile.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, details: n.failureSummary })) }))).toEqual([]);
});


test('photos remain fully visible inline without raw-image links', async ({ page }) => {
  for (const route of ['/projects/lara', '/projects/active-spoiler', '/projects/cupexs', '/news']) {
    await page.goto(route);
    await expect(page.locator(route === '/news' ? '.news-header h1' : '.project-page h1')).toBeVisible();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const images = page.locator(route === '/news' ? '.dispatch-media img' : '.project-gallery img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let index = 0; index < count; index++) {
        const image = images.nth(index);
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
        const geometry = await image.evaluate(element => {
          const image = element as HTMLImageElement;
          const style = getComputedStyle(image);
          const rect = image.getBoundingClientRect();
          return { fit: style.objectFit, linked: !!image.closest('a'), width: rect.width, height: rect.height, frameWidth: image.parentElement!.getBoundingClientRect().width, declaredWidth: Number(image.getAttribute('width')), declaredHeight: Number(image.getAttribute('height')), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight };
        });
        expect(geometry.fit).toBe('contain');
        expect(geometry.linked).toBe(false);
        expect(geometry.width).toBeLessThanOrEqual(geometry.frameWidth + 1);
        expect(geometry.declaredWidth).toBe(geometry.naturalWidth);
        expect(geometry.declaredHeight).toBe(geometry.naturalHeight);
        expect(geometry.height).toBeGreaterThan(50);
      }
      await expect(page.locator('a[href*="/media/"]')).toHaveCount(0);
      if (route === '/projects/active-spoiler' && width === 1440) await page.locator('.project-gallery').screenshot({ path: 'test-results/full-frame-gallery.png' });
    }
  }
  await page.goto('/');
  const preview = page.locator('.dispatch-preview .dispatch-media img');
  await expect(preview).toHaveCount(3);
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (let index = 0; index < 3; index++) {
    await expect(preview.nth(index)).toHaveCSS('object-fit', 'contain');
    await preview.nth(index).scrollIntoViewIfNeeded();
    await expect.poll(() => preview.nth(index).evaluate(image => (image as HTMLImageElement).complete)).toBe(true);
  }
  await page.locator('.latest-dispatch-grid').screenshot({ path: 'test-results/full-frame-dispatches.png' });
  await page.goto('/projects/aerodhs');
  await expect(page.getByRole('heading', { name: 'Project not found.' })).toBeVisible();
});
