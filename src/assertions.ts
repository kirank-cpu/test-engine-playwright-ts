/**
 * Assertion Implementations using Playwright
 */

import { Page } from 'playwright';
import { TestStep } from './types';
import { resolveSelector, resolveValue, substituteVariables, getSelectorDescription } from './utils';

export class AssertionExecutor {
  private variables: Record<string, any> = {};
  private page: Page | null = null;

  constructor(page: Page, variables: Record<string, any>) {
    this.page = page;
    this.variables = variables;
  }

  async execute(step: TestStep): Promise<void> {
    const action = step.action;

    switch (action) {
      case 'assertElementVisible': return this.assertElementVisible(step);
      case 'assertElementHidden': return this.assertElementHidden(step);
      case 'assertText': return this.assertText(step);
      case 'assertValue': return this.assertValue(step);
      case 'assertUrl': return this.assertUrl(step);
      case 'assertCount': return this.assertCount(step);
      case 'assertAttribute': return this.assertAttribute(step);
      case 'assertClass': return this.assertClass(step);
      case 'assertElementExists': return this.assertElementExists(step);

      default:
        throw new Error(`Unknown assertion: ${action}`);
    }
  }

  private async assertElementVisible(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_VISIBLE] ${getSelectorDescription(selector)}`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      console.log(`✓ Element is visible`);
    } catch (error) {
      throw new Error(`Assertion failed: Element ${getSelectorDescription(selector)} is not visible. ${error}`);
    }
  }

  private async assertElementHidden(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_HIDDEN] ${getSelectorDescription(selector)}`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'hidden', timeout });
      console.log(`✓ Element is hidden`);
    } catch (error) {
      throw new Error(`Assertion failed: Element ${getSelectorDescription(selector)} is not hidden. ${error}`);
    }
  }

  private async assertText(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const expectedText = substituteVariables(step.text, this.variables);
    const partial = step.partial || false;
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_TEXT] ${getSelectorDescription(selector)}`);
    console.log(`  Expected text: "${expectedText}" (partial: ${partial})`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      
      const actualText = await element.textContent();
      if (!actualText) {
        throw new Error(`Element has no text content`);
      }
      
      if (partial) {
        if (!actualText.includes(expectedText)) {
          throw new Error(`Text "${actualText}" does not contain "${expectedText}"`);
        }
      } else {
        if (actualText.trim() !== expectedText.trim()) {
          throw new Error(`Expected text "${expectedText}" but got "${actualText}"`);
        }
      }
      
      console.log(`✓ Text assertion passed`);
    } catch (error) {
      throw new Error(`Text assertion failed: ${error}`);
    }
  }

  private async assertValue(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const expectedValue = substituteVariables(step.value, this.variables);
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_VALUE] ${getSelectorDescription(selector)}`);
    console.log(`  Expected value: "${expectedValue}"`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      
      const actualValue = await element.inputValue();
      if (actualValue !== String(expectedValue)) {
        throw new Error(`Expected value "${expectedValue}" but got "${actualValue}"`);
      }
      
      console.log(`✓ Value assertion passed`);
    } catch (error) {
      throw new Error(`Value assertion failed: ${error}`);
    }
  }

  private async assertUrl(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const expectedUrl = substituteVariables(step.url, this.variables);
    const partial = step.partial || false;
    
    console.log(`[ASSERT_URL]`);
    console.log(`  Expected URL: "${expectedUrl}" (partial: ${partial})`);
    
    const actualUrl = this.page.url();
    
    if (partial) {
      if (!actualUrl.includes(expectedUrl)) {
        throw new Error(`URL "${actualUrl}" does not contain "${expectedUrl}"`);
      }
    } else {
      if (actualUrl !== expectedUrl) {
        throw new Error(`Expected URL "${expectedUrl}" but got "${actualUrl}"`);
      }
    }
    
    console.log(`✓ URL assertion passed`);
  }

  private async assertCount(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const expectedCount = step.count || 0;
    
    console.log(`[ASSERT_COUNT] ${getSelectorDescription(selector)}`);
    console.log(`  Expected count: ${expectedCount}`);
    
    try {
      const elements = this.page.locator(selector);
      const actualCount = await elements.count();
      
      if (actualCount !== expectedCount) {
        throw new Error(`Expected ${expectedCount} elements but found ${actualCount}`);
      }
      
      console.log(`✓ Count assertion passed`);
    } catch (error) {
      throw new Error(`Count assertion failed: ${error}`);
    }
  }

  private async assertAttribute(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const attribute = step.attribute || '';
    const expectedValue = substituteVariables(step.value, this.variables);
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_ATTRIBUTE] ${getSelectorDescription(selector)}`);
    console.log(`  Attribute: "${attribute}" Expected: "${expectedValue}"`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      
      const actualValue = await element.getAttribute(attribute);
      if (actualValue !== String(expectedValue)) {
        throw new Error(`Expected attribute "${attribute}" to be "${expectedValue}" but got "${actualValue}"`);
      }
      
      console.log(`✓ Attribute assertion passed`);
    } catch (error) {
      throw new Error(`Attribute assertion failed: ${error}`);
    }
  }

  private async assertClass(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    const className = step.className || '';
    const timeout = step.timeout || 5000;
    
    console.log(`[ASSERT_CLASS] ${getSelectorDescription(selector)}`);
    console.log(`  Expected class: "${className}"`);
    
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      
      const classes = await element.getAttribute('class');
      if (!classes || !classes.includes(className)) {
        throw new Error(`Element does not have class "${className}". Current classes: "${classes}"`);
      }
      
      console.log(`✓ Class assertion passed`);
    } catch (error) {
      throw new Error(`Class assertion failed: ${error}`);
    }
  }

  private async assertElementExists(step: TestStep): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = resolveSelector(step.selector, this.variables);
    
    console.log(`[ASSERT_EXISTS] ${getSelectorDescription(selector)}`);
    
    try {
      const count = await this.page.locator(selector).count();
      if (count === 0) {
        throw new Error(`Element does not exist in DOM`);
      }
      
      console.log(`✓ Element exists`);
    } catch (error) {
      throw new Error(`Element existence assertion failed: ${error}`);
    }
  }
}
