/**
 * Core Type Definitions for Low-Code Test Automation Engine
 */

// Action Types
export type ActionType = 
  // Navigation
  | 'navigate' | 'reload' | 'goBack' | 'goForward'
  // Interaction
  | 'click' | 'doubleClick' | 'rightClick' | 'fill' | 'type' | 'select'
  | 'check' | 'uncheck' | 'submit' | 'press' | 'hover' | 'dragAndDrop'
  // Wait Actions
  | 'waitFor' | 'waitForNavigation' | 'waitForUrl' | 'waitForSelector'
  | 'wait' | 'waitForVisible' | 'waitForHidden'
  // Assertions
  | 'assertElementVisible' | 'assertElementHidden' | 'assertText' | 'assertValue'
  | 'assertUrl' | 'assertCount' | 'assertAttribute' | 'assertClass' | 'assertElementExists'
  // Utility
  | 'screenshot' | 'sleep' | 'execute' | 'setVariable' | 'log' | 'scrollIntoView';

export interface TestStep {
  action: ActionType;
  selector?: string;
  url?: string;
  value?: string | number | boolean;
  text?: string;
  timeout?: number;
  name?: string;
  partial?: boolean;
  key?: string;
  x?: number;
  y?: number;
  script?: string;
  attribute?: string;
  className?: string;
  count?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delay?: number;
  [key: string]: any;
}

export interface TestCase {
  name: string;
  steps: TestStep[];
  skip?: boolean;
  skipReason?: string;
}

export interface TestFile {
  name: string;
  description?: string;
  timeout?: number;
  retryFailed?: boolean;
  retryCount?: number;
  variables?: Record<string, string | number | boolean>;
  tests: TestCase[];
}

export interface BrowserConfig {
  headless?: boolean;
  slowMo?: number;
  timeout?: number;
  viewport?: {
    width: number;
    height: number;
  };
  args?: string[];
}

export interface ExecutionResult {
  testName: string;
  caseName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  errorStack?: string;
  steps: StepResult[];
  screenshots?: string[];
}

export interface StepResult {
  stepIndex: number;
  action: ActionType;
  status: 'passed' | 'failed';
  duration: number;
  error?: string;
  screenshot?: string;
}

export interface ExecutionReport {
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  results: ExecutionResult[];
  artifacts: ArtifactInfo[];
}

export interface ArtifactInfo {
  type: 'screenshot' | 'video' | 'log';
  path: string;
  testCase: string;
}

export interface LocatorResult {
  success: boolean;
  selector?: string;
  error?: string;
  strategy: 'css' | 'xpath' | 'text' | 'role' | 'label' | 'placeholder' | 'regex';
}
