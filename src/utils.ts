/**
 * Utility Functions
 */

/**
 * Substitute variables in a string using ${variableName} syntax
 */
export function substituteVariables(
  text: string | number | boolean | undefined,
  variables: Record<string, any>
): string {
  if (text === undefined || text === null) return '';
  
  const strText = String(text);
  return strText.replace(/\$\{([^}]+)\}/g, (match, key) => {
    if (key in variables) {
      return String(variables[key]);
    }
    console.warn(`Variable not found: ${key}`);
    return match;
  });
}

/**
 * Get selector with variable substitution
 */
export function resolveSelector(selector: string | undefined, variables: Record<string, any>): string {
  if (!selector) throw new Error('Selector is required');
  return substituteVariables(selector, variables);
}

/**
 * Get value with variable substitution
 */
export function resolveValue(value: any, variables: Record<string, any>): any {
  if (typeof value === 'string' || typeof value === 'number') {
    return substituteVariables(value, variables);
  }
  return value;
}

/**
 * Format duration in ms to readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get timestamp for file naming
 */
export function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

/**
 * Deep clone an object
 */
export function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Merge variables (test variables override global variables)
 */
export function mergeVariables(
  globalVariables: Record<string, any>,
  testVariables?: Record<string, any>
): Record<string, any> {
  return {
    ...globalVariables,
    ...(testVariables || {}),
    timestamp: new Date().getTime(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString().split('T')[1],
  };
}

/**
 * Validate step action
 */
export function isValidAction(action: string): boolean {
  const validActions = [
    // Navigation
    'navigate', 'reload', 'goBack', 'goForward',
    // Interaction
    'click', 'doubleClick', 'rightClick', 'fill', 'type', 'select',
    'check', 'uncheck', 'submit', 'press', 'hover', 'dragAndDrop', 'scrollIntoView',
    // Wait
    'waitFor', 'waitForNavigation', 'waitForUrl', 'waitForSelector',
    'wait', 'waitForVisible', 'waitForHidden',
    // Assertions
    'assertElementVisible', 'assertElementHidden', 'assertText', 'assertValue',
    'assertUrl', 'assertCount', 'assertAttribute', 'assertClass', 'assertElementExists',
    // Utility
    'screenshot', 'sleep', 'execute', 'setVariable', 'log',
  ];
  return validActions.includes(action);
}

/**
 * Parse URL with wildcard support
 */
export function matchesUrlPattern(actual: string, pattern: string): boolean {
  // Convert * to .* for regex
  const regexPattern = pattern.replace(/\*/g, '.*').replace(/\//g, '\\/');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(actual);
}

/**
 * Wait for condition with timeout
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition();
      if (result) return;
    } catch (e) {
      // Continue waiting
    }
    await sleep(interval);
  }
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Sleep for N milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape special characters in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get selector description for logging
 */
export function getSelectorDescription(selector: string): string {
  // Try to extract meaningful part of selector
  if (selector.includes(':has-text')) {
    const match = selector.match(/:has-text\(['"]([^'"]+)['"]\)/);
    if (match) return `button with text "${match[1]}"`;
  }
  if (selector.includes('[placeholder')) {
    const match = selector.match(/\[placeholder=['"]([^'"]+)['"]\]/);
    if (match) return `field with placeholder "${match[1]}"`;
  }
  if (selector.includes('.')) {
    const classes = selector.match(/\.([a-zA-Z0-9-_]+)/g);
    if (classes) return `element with class "${classes[0].substring(1)}"`;
  }
  if (selector.includes('#')) {
    const id = selector.match(/#([a-zA-Z0-9-_]+)/);
    if (id) return `element with id "${id[1]}"`;
  }
  return `element "${selector}"`;
}
