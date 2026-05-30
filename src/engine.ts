/**
 * Main Test Execution Engine
 */

import { chromium, firefox, webkit, Browser, Page, BrowserContext } from 'playwright';
import { TestFile, ExecutionResult, ExecutionReport, BrowserConfig, StepResult } from './types';
import { ActionExecutor } from './actions';
import { AssertionExecutor } from './assertions';
import { mergeVariables, formatDuration, getTimestamp, sleep } from './utils';
import * as fs from 'fs';
import * as path from 'path';

export class TestEngine {
  private browserConfig: BrowserConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private results: ExecutionResult[] = [];
  private startTime: Date = new Date();
  private artifactsPath: string = './artifacts';

  constructor(config: Partial<BrowserConfig> = {}) {
    this.browserConfig = {
      headless: config.headless !== false,
      slowMo: config.slowMo || 0,
      timeout: config.timeout || 30000,
      viewport: config.viewport || { width: 1920, height: 1080 },
      args: config.args || [],
    };

    // Create artifacts directory
    if (!fs.existsSync(this.artifactsPath)) {
      fs.mkdirSync(this.artifactsPath, { recursive: true });
    }
  }

  /**
   * Initialize browser
   */
  async initialize(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium'): Promise<void> {
    console.log(`\n🚀 Initializing ${browserType} browser...`);

    const launchOptions: any = {
      headless: this.browserConfig.headless,
      slowMo: this.browserConfig.slowMo,
      args: this.browserConfig.args,
    };

    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }

    this.context = await this.browser.newContext({
      viewport: this.browserConfig.viewport,
      ignoreHTTPSErrors: true,
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.browserConfig.timeout ?? 30000);

    console.log(`✓ Browser initialized successfully\n`);
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log(`\n✓ Browser closed\n`);
  }

  /**
   * Execute test file
   */
  async executeTestFile(testFile: TestFile): Promise<ExecutionReport> {
    this.startTime = new Date();
    this.results = [];

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📋 Test Suite: ${testFile.name}`);
    console.log(`${testFile.description || ''}`);
    console.log(`${'='.repeat(70)}\n`);

    const globalVariables = testFile.variables || {};

    for (const testCase of testFile.tests) {
      if (testCase.skip) {
        console.log(`⊘ SKIPPED: ${testCase.name}`);
        console.log(`  Reason: ${testCase.skipReason || 'No reason provided'}\n`);
        this.results.push({
          testName: testFile.name,
          caseName: testCase.name,
          status: 'skipped',
          duration: 0,
          steps: [],
        });
        continue;
      }

      const result = await this.executeTestCase(
        testFile.name,
        testCase.name,
        testCase.steps,
        mergeVariables(globalVariables)
      );
      this.results.push(result);
    }

    return this.generateReport();
  }

  /**
   * Execute single test case
   */
  private async executeTestCase(
    testFileName: string,
    testCaseName: string,
    steps: any[],
    variables: Record<string, any>
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const result: ExecutionResult = {
      testName: testFileName,
      caseName: testCaseName,
      status: 'passed',
      duration: 0,
      steps: [],
      screenshots: [],
    };

    console.log(`\n📌 TEST: ${testCaseName}`);
    console.log(`${'─'.repeat(70)}`);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepStartTime = Date.now();
      const stepResult: StepResult = {
        stepIndex: i + 1,
        action: step.action,
        status: 'passed',
        duration: 0,
      };

      try {
        if (!this.page) throw new Error('Page not initialized');

        // Check if it's an assertion or action
        const assertionActions = [
          'assertElementVisible', 'assertElementHidden', 'assertText', 'assertValue',
          'assertUrl', 'assertCount', 'assertAttribute', 'assertClass', 'assertElementExists'
        ];

        if (assertionActions.includes(step.action)) {
          const executor = new AssertionExecutor(this.page, variables);
          await executor.execute(step);
        } else {
          const executor = new ActionExecutor(this.page, variables);
          await executor.execute(step);
        }

        stepResult.status = 'passed';
        stepResult.duration = Date.now() - stepStartTime;
        console.log(`  ✓ Step ${i + 1} passed (${formatDuration(stepResult.duration)})\n`);

      } catch (error) {
        stepResult.status = 'failed';
        stepResult.duration = Date.now() - stepStartTime;
        stepResult.error = String(error);

        result.status = 'failed';
        result.error = String(error);

        // Capture screenshot on failure
        try {
          if (this.page) {
            const screenshotName = `failure-${testCaseName}-step${i + 1}-${getTimestamp()}`;
            const screenshotPath = path.join(this.artifactsPath, `${screenshotName}.png`);
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            stepResult.screenshot = screenshotPath;
            result.screenshots?.push(screenshotPath);
          }
        } catch (screenshotError) {
          console.error(`Failed to capture screenshot: ${screenshotError}`);
        }

        console.log(`  ✗ Step ${i + 1} FAILED (${formatDuration(stepResult.duration)})`);
        console.log(`  Error: ${error}\n`);

        // Stop execution on first failure (can be configured)
        break;
      }

      result.steps.push(stepResult);
    }

    result.duration = Date.now() - startTime;

    // Print test result summary
    const icon = result.status === 'passed' ? '✓' : '✗';
    const status = result.status.toUpperCase();
    console.log(`${icon} ${status}: ${testCaseName} (${formatDuration(result.duration)})\n`);

    return result;
  }

  /**
   * Generate execution report
   */
  private generateReport(): ExecutionReport {
    const endTime = new Date();
    const totalDuration = endTime.getTime() - this.startTime.getTime();

    const report: ExecutionReport = {
      startTime: this.startTime,
      endTime,
      totalDuration,
      totalTests: this.results.length,
      passedTests: this.results.filter(r => r.status === 'passed').length,
      failedTests: this.results.filter(r => r.status === 'failed').length,
      skippedTests: this.results.filter(r => r.status === 'skipped').length,
      results: this.results,
      artifacts: [],
    };

    // Print summary
    console.log(`${'='.repeat(70)}`);
    console.log(`📊 TEST EXECUTION SUMMARY`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Total Tests:    ${report.totalTests}`);
    console.log(`Passed:         ${report.passedTests} ✓`);
    console.log(`Failed:         ${report.failedTests} ✗`);
    console.log(`Skipped:        ${report.skippedTests} ⊘`);
    console.log(`Total Duration: ${formatDuration(report.totalDuration)}`);
    console.log(`${'='.repeat(70)}\n`);

    return report;
  }

  /**
   * Export report to JSON
   */
  saveReportJson(report: ExecutionReport, fileName: string = 'test-report.json'): string {
    const reportPath = path.join(this.artifactsPath, fileName);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved: ${reportPath}`);
    return reportPath;
  }

  /**
   * Export report to HTML
   */
  saveReportHtml(report: ExecutionReport, fileName: string = 'test-report.html'): string {
    const html = this.generateHtmlReport(report);
    const reportPath = path.join(this.artifactsPath, fileName);
    fs.writeFileSync(reportPath, html);
    console.log(`📄 HTML Report saved: ${reportPath}`);
    return reportPath;
  }

  /**
   * Generate HTML report content
   */
  private generateHtmlReport(report: ExecutionReport): string {
    const passPercent = report.totalTests > 0 ? Math.round((report.passedTests / report.totalTests) * 100) : 0;

    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            padding: 30px;
            border-bottom: 1px solid #eee;
        }
        .stat {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 12px; color: #999; text-transform: uppercase; margin-top: 5px; }
        .stat.passed { border-left-color: #4caf50; }
        .stat.passed .stat-number { color: #4caf50; }
        .stat.failed { border-left-color: #f44336; }
        .stat.failed .stat-number { color: #f44336; }
        .stat.skipped { border-left-color: #ff9800; }
        .stat.skipped .stat-number { color: #ff9800; }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #eee;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4caf50 0%, #4caf50 ${passPercent}%, #f44336 ${passPercent}%, #f44336 100%);
        }
        .content { padding: 30px; }
        .test-case {
            margin-bottom: 30px;
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
        }
        .test-case-header {
            padding: 15px 20px;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-case-header.passed { border-left: 4px solid #4caf50; }
        .test-case-header.failed { border-left: 4px solid #f44336; background: #fff3cd; }
        .test-case-header.skipped { border-left: 4px solid #ff9800; }
        .test-case-title { font-weight: 600; }
        .test-case-status { font-size: 12px; padding: 4px 8px; border-radius: 4px; }
        .test-case-status.passed { background: #e8f5e9; color: #2e7d32; }
        .test-case-status.failed { background: #ffebee; color: #c62828; }
        .test-case-status.skipped { background: #fff3e0; color: #e65100; }
        .test-case-body { padding: 15px 20px; }
        .step {
            padding: 10px;
            border-left: 3px solid #667eea;
            margin-bottom: 10px;
            background: #f9f9f9;
            border-radius: 4px;
        }
        .step.passed { border-left-color: #4caf50; }
        .step.failed { border-left-color: #f44336; background: #ffebee; }
        .step-number { font-weight: bold; color: #667eea; }
        .step-action { font-family: monospace; color: #666; margin: 5px 0; }
        .step-error { color: #f44336; margin-top: 5px; font-size: 12px; }
        .footer {
            padding: 20px 30px;
            border-top: 1px solid #eee;
            background: #f9f9f9;
            font-size: 12px;
            color: #999;
        }
        .time { color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Execution Report</h1>
            <p>Automated Test Results</p>
        </div>

        <div class="stats">
            <div class="stat passed">
                <div class="stat-number">${report.passedTests}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat failed">
                <div class="stat-number">${report.failedTests}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat skipped">
                <div class="stat-number">${report.skippedTests}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat">
                <div class="stat-number">${report.totalTests}</div>
                <div class="stat-label">Total</div>
            </div>
        </div>

        <div style="padding: 0 30px; padding-top: 20px;">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p style="text-align: center; margin-top: 10px; font-size: 14px; color: #666;">
                <strong>${passPercent}%</strong> Pass Rate
            </p>
        </div>

        <div class="content">
`;

    // Add test cases
    for (const result of report.results) {
      const statusClass = result.status === 'passed' ? 'passed' : result.status === 'failed' ? 'failed' : 'skipped';
      const statusIcon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '⊘';

      html += `
            <div class="test-case">
                <div class="test-case-header ${statusClass}">
                    <div>
                        <div class="test-case-title">${result.caseName}</div>
                        <div class="time">${formatDuration(result.duration)}</div>
                    </div>
                    <div class="test-case-status ${statusClass}">
                        ${statusIcon} ${result.status.toUpperCase()}
                    </div>
                </div>
                <div class="test-case-body">
`;

      // Add steps
      for (const step of result.steps) {
        html += `
                    <div class="step ${step.status}">
                        <div><span class="step-number">Step ${step.stepIndex}:</span> <span class="step-action">${step.action}</span></div>
                        <div style="font-size: 12px; color: #999;">Duration: ${formatDuration(step.duration)}</div>
`;
        if (step.error) {
          html += `<div class="step-error">Error: ${step.error}</div>`;
        }
        html += `</div>`;
      }

      if (result.error) {
        html += `<div style="padding: 10px; background: #ffebee; border: 1px solid #ef5350; border-radius: 4px; color: #c62828; margin-top: 10px;">
            <strong>Test Error:</strong> ${result.error}
        </div>`;
      }

      html += `
                </div>
            </div>
`;
    }

    html += `
        </div>

        <div class="footer">
            <p>Generated on ${report.startTime.toLocaleString()}</p>
            <p>Total Duration: ${formatDuration(report.totalDuration)}</p>
        </div>
    </div>
</body>
</html>
`;

    return html;
  }
}
