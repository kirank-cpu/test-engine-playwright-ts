#!/usr/bin/env node

/**
 * Test Runner - Execute JSON test files
 */

import { TestEngine } from './src/engine';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: npx ts-node runner.ts <test-file.json> [options]

Options:
  --headless=true|false   Run in headless mode (default: true)
  --browser=chromium|firefox|webkit   Browser to use (default: chromium)
  --slowMo=100            Slow down actions by N ms
  --verbose               Show detailed logs

Examples:
  npx ts-node runner.ts examples/example.test.json
  npx ts-node runner.ts examples/example.test.json --headless=false --browser=firefox
  npx ts-node runner.ts examples/example.test.json --slowMo=100
    `);
    process.exit(1);
  }

  const testFilePath = args[0];
  let browserType: 'chromium' = 'chromium';
  let headless = false;
  let slowMo = 0;

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--browser=')) {
      browserType = arg.split('=')[1] as any;
    } else if (arg.startsWith('--headless=')) {
      headless = arg.split('=')[1] === 'true';
    } else if (arg.startsWith('--slowMo=')) {
      slowMo = parseInt(arg.split('=')[1]);
    }
  }

  // Validate file exists
  if (!fs.existsSync(testFilePath)) {
    console.error(`❌ Test file not found: ${testFilePath}`);
    process.exit(1);
  }

  try {
    // Read test file
    const testContent = fs.readFileSync(testFilePath, 'utf-8');
    const testFile = JSON.parse(testContent);

    // Initialize engine
    const engine = new TestEngine({
      headless,
      slowMo,
      timeout: testFile.timeout || 30000,
    });

    // Initialize browser
    await engine.initialize(browserType);

    // Execute tests
    const report = await engine.executeTestFile(testFile);

    // Save reports
    engine.saveReportJson(report);
    engine.saveReportHtml(report);

    // Close browser
    await engine.close();

    // Exit with appropriate code
    process.exit(report.failedTests > 0 ? 1 : 0);

  } catch (error) {
    console.error(`\n❌ Test execution failed:`);
    console.error(error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
