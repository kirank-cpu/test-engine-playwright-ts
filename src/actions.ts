/**
 * Action Implementations using Playwright
 */

import { Page, Browser } from 'playwright';
import { TestStep } from './types';
import { resolveSelector, resolveValue, substituteVariables, sleep, matchesUrlPattern, getSelectorDescription } from './utils';

export class ActionExecutor {
  private variables: Record<string, any> = {};
  private page: Page | null = null;
  private lastScreenshot: string | null = null;

  constructor(page: Page, variables: Record<string, any>) {
    this.page = page;
    this.variables = variables;
  }

  async execute(step: TestStep): Promise<any> {
    const action = step.action;
    
    switch (action) {
      // Navigation Actions
      case 'navigate': return this.navigate(step);
      case 'reload': return this.reload(step);
      case 'goBack': return this.goBack(step);
      case 'goForward': return this.goForward(step);

      // Interaction Actions
      case 'click': return this.click(step);
      case 'doubleClick': return this.doubleClick(step);
      case 'rightClick': return this.rightClick(step);
      case 'fill': return this.fill(step);
      case 'type': return this.type(step);
      case 'select': return this.select(step);
      case 'check': return this.check(step);
      case 'uncheck': return this.uncheck(step);
      case 'submit': return this.submit(step);
      case 'press': return this.press(step);
      case 'hover': return this.hover(step);
      case 'dragAndDrop': return this.dragAndDrop(step);
      case 'scrollIntoView': return this.scrollIntoView(step);

      // Wait Actions
      case 'waitFor': return this.waitFor(step);
      case 'waitForNavigation': return this.waitForNavigation(step);
      case 'waitForUrl': return this.waitForUrl(step);
      case 'waitForSelector': return this.waitForSelector(step);
      case 'wait': return this.wait(step);
      case 'waitForVisible': return this.waitForVisible(step);
      case 'waitForHidden': return this.waitForHidden(step);

      // Utility Actions
      case 'screenshot': return this.screenshot(step);
      case 'sleep': return this.sleep(step);
      case 'execute': return this.execute_(step);
      case 'setVariable': return this.setVariable(step);
      case 'log': return this.log(step);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  // ===== NAVIGATION ACTIONS =====

  private async navigate(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const url = substituteVariables(step.url, this.variables);
    if (!url) throw new Error('URL is required for navigate action');
    console.log(`[NAVIGATE] ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  private async reload(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    console.log(`[RELOAD] Reloading page`);
    await this.page.reload();
  }

  private async goBack(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    console.log(`[GO_BACK]`);
    await this.page.goBack();
  }

  private async goForward(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    console.log(`[GO_FORWARD]`);
    await this.page.goForward();
  }

  // ===== INTERACTION ACTIONS =====

  private async click(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[CLICK] ${getSelectorDescription(selector)}`);
    await this.page.click(selector, { timeout: step.timeout || 5000 });
  }

  private async doubleClick(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[DOUBLE_CLICK] ${getSelectorDescription(selector)}`);
    await this.page.dblclick(selector, { timeout: step.timeout || 5000 });
  }

  private async rightClick(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[RIGHT_CLICK] ${getSelectorDescription(selector)}`);
    await this.page.click(selector, { button: 'right', timeout: step.timeout || 5000 });
  }

  private async fill(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const value = resolveValue(step.value, this.variables);
    console.log(`[FILL] ${getSelectorDescription(selector)} with value: ${String(value).substring(0, 50)}...`);
    await this.page.fill(selector, String(value), { timeout: step.timeout || 5000 });
  }

  private async type(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const value = resolveValue(step.value, this.variables);
    const delay = step.delay || 50;
    console.log(`[TYPE] ${getSelectorDescription(selector)}`);
    await this.page.click(selector, { timeout: step.timeout || 5000 });
    await this.page.keyboard.type(String(value), { delay });
  }

  private async select(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const value = resolveValue(step.value, this.variables);
    console.log(`[SELECT] ${getSelectorDescription(selector)} value: ${value}`);
    await this.page.selectOption(selector, String(value), { timeout: step.timeout || 5000 });
  }

  private async check(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[CHECK] ${getSelectorDescription(selector)}`);
    await this.page.check(selector, { timeout: step.timeout || 5000 });
  }

  private async uncheck(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[UNCHECK] ${getSelectorDescription(selector)}`);
    await this.page.uncheck(selector, { timeout: step.timeout || 5000 });
  }

  private async submit(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[SUBMIT] Form: ${getSelectorDescription(selector)}`);
    await this.page.locator(selector).evaluate((el: any) => el.closest('form')?.submit());
  }

  private async press(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = step.selector ? resolveSelector(step.selector, this.variables) : null;
    const key = step.key || '';
    console.log(`[PRESS] Key: ${key}`);
    
    if (selector) {
      await this.page.focus(selector);
    }
    await this.page.keyboard.press(key);
  }

  private async hover(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[HOVER] ${getSelectorDescription(selector)}`);
    await this.page.hover(selector, { timeout: step.timeout || 5000 });
  }

  private async dragAndDrop(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const sourceSelector = resolveSelector(step.selector, this.variables);
    const targetSelector = resolveSelector(step.value as string, this.variables);
    console.log(`[DRAG_DROP] From ${getSelectorDescription(sourceSelector)} to ${getSelectorDescription(targetSelector)}`);
    await this.page.dragAndDrop(sourceSelector, targetSelector, { timeout: step.timeout || 5000 });
  }

  private async scrollIntoView(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    console.log(`[SCROLL_INTO_VIEW] ${getSelectorDescription(selector)}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  // ===== WAIT ACTIONS =====

  private async waitFor(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    console.log(`[WAIT_FOR] ${getSelectorDescription(selector)}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  private async waitForNavigation(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const timeout = step.timeout || 30000;
    console.log(`[WAIT_FOR_NAVIGATION]`);
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  private async waitForUrl(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const urlPattern = step.url || '';
    const timeout = step.timeout || 5000;
    console.log(`[WAIT_FOR_URL] Pattern: ${urlPattern}`);
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (matchesUrlPattern(this.page.url(), urlPattern)) {
        return;
      }
      await sleep(100);
    }
    throw new Error(`URL did not match pattern "${urlPattern}" within ${timeout}ms`);
  }

  private async waitForSelector(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    console.log(`[WAIT_FOR_SELECTOR] ${getSelectorDescription(selector)}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  private async wait(step: TestStep): Promise<void> {
    const timeout = step.timeout || 0;
    console.log(`[WAIT] ${timeout}ms`);
    await sleep(timeout);
  }

  private async waitForVisible(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    console.log(`[WAIT_FOR_VISIBLE] ${getSelectorDescription(selector)}`);
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  private async waitForHidden(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    console.log(`[WAIT_FOR_HIDDEN] ${getSelectorDescription(selector)}`);
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  // ===== UTILITY ACTIONS =====

  private async screenshot(step: TestStep): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    const name = step.name || `screenshot-${Date.now()}`;
    console.log(`[SCREENSHOT] ${name}`);
    const path = `./artifacts/${name}.png`;
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }

  private async sleep(step: TestStep): Promise<void> {
    const timeout = step.timeout || 1000;
    console.log(`[SLEEP] ${timeout}ms`);
    await sleep(timeout);
  }

  private async execute_(step: TestStep): Promise<any> {
    if (!this.page) throw new Error('Page not initialized');
    const script = step.script || '';
    console.log(`[EXECUTE] JavaScript`);
    return await this.page.evaluate(script);
  }

  private async setVariable(step: TestStep): Promise<void> {
    const key = step.key || '';
    const value = resolveValue(step.value, this.variables);
    console.log(`[SET_VARIABLE] ${key} = ${value}`);
    this.variables[key] = value;
  }

  private async log(step: TestStep): Promise<void> {
    const message = substituteVariables(step.value, this.variables);
    console.log(`[LOG] ${message}`);
  }
}
