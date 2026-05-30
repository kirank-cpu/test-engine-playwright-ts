# 🚀 Low-Code Test Automation Engine

A powerful JSON-based UI test automation engine built on top of Playwright. Write test scripts with minimal code using simple, declarative JSON format.

## Features

✅ **Low-Code JSON Format** - Define tests in clean, readable JSON  
✅ **25+ Built-in Actions** - Click, fill, type, navigate, assert, and more  
✅ **10+ Assertion Types** - Validate elements, text, URLs, attributes  
✅ **Smart Wait Strategies** - Automatic waits for elements and page loads  
✅ **Variable Substitution** - Use `${variableName}` in any step  
✅ **Screenshot Capture** - Automatic screenshots on failures  
✅ **HTML Reports** - Beautiful, detailed test execution reports  
✅ **Multiple Browsers** - Chromium, Firefox, WebKit support  
✅ **Cross-Platform** - Windows, macOS, Linux  

---

## Installation

### Prerequisites
- Node.js 14+ and npm
- Git (optional)

### Setup

```bash
# Clone or extract the project
cd test-engine

# Install dependencies
npm install
npx playwright install

# Verify installation
npm test
```

---

## Quick Start

### 1. Create a Test File

Create `my-test.json`:

```json
{
  "name": "My First Test",
  "description": "Test login functionality",
  "variables": {
    "baseUrl": "https://example.com",
    "username": "testuser@example.com",
    "password": "password123"
  },
  "tests": [
    {
      "name": "Login Test",
      "steps": [
        {
          "action": "navigate",
          "url": "${baseUrl}/login"
        },
        {
          "action": "fill",
          "selector": "input[name='email']",
          "value": "${username}"
        },
        {
          "action": "fill",
          "selector": "input[name='password']",
          "value": "${password}"
        },
        {
          "action": "click",
          "selector": "button:has-text('Sign In')"
        },
        {
          "action": "waitForNavigation",
          "timeout": 5000
        },
        {
          "action": "assertUrl",
          "url": "${baseUrl}/dashboard",
          "timeout": 5000
        }
      ]
    }
  ]
}
```

### 2. Run Tests

```bash
# Run with default settings (headless)
npx ts-node runner.ts my-test.json

# Run in debug mode (visible browser)
npx ts-node runner.ts my-test.json --headless=false

# Run with different browser
npx ts-node runner.ts my-test.json --browser=firefox

# Run with slow motion
npx ts-node runner.ts my-test.json --slowMo=500
```

### 3. View Results

Test reports are automatically generated:
- `artifacts/test-report.html` - Interactive HTML report
- `artifacts/test-report.json` - Raw JSON report
- `artifacts/` - Screenshots and error artifacts

---

## Available Actions

### Navigation

#### `navigate`
Go to a URL
```json
{
  "action": "navigate",
  "url": "https://example.com/page"
}
```

#### `reload`
Refresh the current page
```json
{
  "action": "reload"
}
```

#### `goBack`
Go to previous page
```json
{
  "action": "goBack"
}
```

#### `goForward`
Go to next page
```json
{
  "action": "goForward"
}
```

---

### Interaction

#### `click`
Click an element
```json
{
  "action": "click",
  "selector": "button.submit"
}
```

#### `doubleClick`
Double-click element
```json
{
  "action": "doubleClick",
  "selector": ".item"
}
```

#### `rightClick`
Right-click element
```json
{
  "action": "rightClick",
  "selector": ".menu-trigger"
}
```

#### `fill`
Fill input field (clears first)
```json
{
  "action": "fill",
  "selector": "input[type='email']",
  "value": "test@example.com"
}
```

#### `type`
Type text with delay (char by char)
```json
{
  "action": "type",
  "selector": ".search-box",
  "value": "search query",
  "delay": 100
}
```

#### `select`
Select dropdown option
```json
{
  "action": "select",
  "selector": "select[name='country']",
  "value": "US"
}
```

#### `check`
Check a checkbox
```json
{
  "action": "check",
  "selector": "input[name='agree']"
}
```

#### `uncheck`
Uncheck a checkbox
```json
{
  "action": "uncheck",
  "selector": "input[name='terms']"
}
```

#### `submit`
Submit a form
```json
{
  "action": "submit",
  "selector": "form.login-form"
}
```

#### `press`
Press a keyboard key
```json
{
  "action": "press",
  "key": "Enter"
}
```

#### `hover`
Hover over element
```json
{
  "action": "hover",
  "selector": ".dropdown-trigger"
}
```

#### `dragAndDrop`
Drag element to another location
```json
{
  "action": "dragAndDrop",
  "selector": ".source-item",
  "value": ".target-container"
}
```

#### `scrollIntoView`
Scroll element into view
```json
{
  "action": "scrollIntoView",
  "selector": ".bottom-element"
}
```

---

### Wait Actions

#### `waitFor`
Wait for element to exist in DOM
```json
{
  "action": "waitFor",
  "selector": ".popup",
  "timeout": 5000
}
```

#### `waitForNavigation`
Wait for page load
```json
{
  "action": "waitForNavigation",
  "timeout": 10000
}
```

#### `waitForUrl`
Wait for URL to match pattern (supports wildcard `*`)
```json
{
  "action": "waitForUrl",
  "url": "**/dashboard",
  "timeout": 5000
}
```

#### `waitForSelector`
Wait for CSS selector
```json
{
  "action": "waitForSelector",
  "selector": "h1.page-title",
  "timeout": 5000
}
```

#### `wait`
Wait specific milliseconds
```json
{
  "action": "wait",
  "timeout": 2000
}
```

#### `waitForVisible`
Wait for element to be visible
```json
{
  "action": "waitForVisible",
  "selector": ".success-message",
  "timeout": 5000
}
```

#### `waitForHidden`
Wait for element to be hidden
```json
{
  "action": "waitForHidden",
  "selector": ".loading-spinner",
  "timeout": 5000
}
```

---

### Assertions

#### `assertElementVisible`
Assert element is visible
```json
{
  "action": "assertElementVisible",
  "selector": ".dashboard",
  "timeout": 5000
}
```

#### `assertElementHidden`
Assert element is hidden
```json
{
  "action": "assertElementHidden",
  "selector": ".error-banner"
}
```

#### `assertText`
Assert element text content
```json
{
  "action": "assertText",
  "selector": "h1",
  "text": "Welcome",
  "partial": true
}
```

#### `assertValue`
Assert input field value
```json
{
  "action": "assertValue",
  "selector": "input[name='email']",
  "value": "test@example.com"
}
```

#### `assertUrl`
Assert current URL
```json
{
  "action": "assertUrl",
  "url": "https://example.com/dashboard",
  "partial": true
}
```

#### `assertCount`
Assert number of matching elements
```json
{
  "action": "assertCount",
  "selector": ".item",
  "count": 5
}
```

#### `assertAttribute`
Assert element attribute value
```json
{
  "action": "assertAttribute",
  "selector": "button.submit",
  "attribute": "disabled",
  "value": ""
}
```

#### `assertClass`
Assert element has CSS class
```json
{
  "action": "assertClass",
  "selector": ".button",
  "className": "active"
}
```

#### `assertElementExists`
Assert element exists in DOM
```json
{
  "action": "assertElementExists",
  "selector": ".header"
}
```

---

### Utility

#### `screenshot`
Capture full page screenshot
```json
{
  "action": "screenshot",
  "name": "step-completion"
}
```

#### `execute`
Execute JavaScript
```json
{
  "action": "execute",
  "script": "return document.querySelectorAll('.item').length"
}
```

#### `setVariable`
Set a variable for later use
```json
{
  "action": "setVariable",
  "key": "itemCount",
  "value": 5
}
```

#### `log`
Log a message (supports variable substitution)
```json
{
  "action": "log",
  "value": "Current user: ${username}"
}
```

#### `sleep`
Wait for N milliseconds
```json
{
  "action": "sleep",
  "timeout": 1000
}
```

---

## Selector Strategies

The engine supports multiple CSS selector styles:

### Standard CSS
```json
{
  "selector": "button.primary"
}
```

### Text matching
```json
{
  "selector": "button:has-text('Click Me')"
}
```

### Attribute matching
```json
{
  "selector": "input[placeholder='Enter email']"
}
```

### Complex selectors
```json
{
  "selector": "form.login input[type='email']"
}
```

### First/Last child
```json
{
  "selector": ".item:first-child"
}
```

---

## Variable Substitution

Use `${variableName}` syntax in any step value:

```json
{
  "name": "Login Flow",
  "variables": {
    "username": "testuser",
    "password": "pass123",
    "baseUrl": "https://app.example.com"
  },
  "tests": [
    {
      "name": "Login",
      "steps": [
        {
          "action": "navigate",
          "url": "${baseUrl}/login"
        },
        {
          "action": "fill",
          "selector": "input[name='username']",
          "value": "${username}"
        },
        {
          "action": "fill",
          "selector": "input[name='password']",
          "value": "${password}"
        },
        {
          "action": "log",
          "value": "Logging in as: ${username}"
        }
      ]
    }
  ]
}
```

### Built-in Variables

```
${timestamp} - Current Unix timestamp
${date}      - Current date (YYYY-MM-DD)
${time}      - Current time (HH:MM:SS)
```

---

## Test Structure

### Test File
```json
{
  "name": "Test Suite Name",
  "description": "Optional description",
  "timeout": 30000,
  "variables": {
    "key": "value"
  },
  "tests": [/* test cases */]
}
```

### Test Case
```json
{
  "name": "Test Case Name",
  "skip": false,
  "skipReason": "Not implemented yet",
  "steps": [/* steps */]
}
```

### Step
```json
{
  "action": "click",
  "selector": "button",
  "timeout": 5000,
  "/* ... other properties based on action ... */
}
```

---

## Command Line Options

```bash
npx ts-node runner.ts <test-file> [options]

Options:
  --headless=true|false       Run in headless mode (default: true)
  --browser=chromium|firefox|webkit
                              Browser to use (default: chromium)
  --slowMo=100                Slow down actions by N ms
```

---

## Best Practices

### 1. Use Meaningful Test Names
```json
{
  "name": "Valid user can login successfully"
}
```

### 2. Set Appropriate Timeouts
```json
{
  "action": "waitFor",
  "selector": ".modal",
  "timeout": 10000  // Increase for slow operations
}
```

### 3. Use Variables for Configuration
```json
{
  "variables": {
    "baseUrl": "https://staging.example.com"
  }
}
```

### 4. Organize Tests Logically
- Group related tests together
- Use descriptive test names
- One assertion per test when possible

### 5. Handle Dynamic Content
```json
{
  "action": "waitForNavigation",
  "timeout": 10000
},
{
  "action": "waitFor",
  "selector": ".content-loaded",
  "timeout": 5000
}
```

### 6. Use Specific Selectors
```json
// Good - Specific
{
  "selector": "input[name='email']"
}

// Less good - Generic
{
  "selector": "input"
}
```

---

## Troubleshooting

### Element not found
- Check selector syntax
- Add wait action before interaction
- Take screenshot to debug

### Timeout errors
- Increase timeout value
- Add explicit wait action
- Check if element is in iframe

### Test hangs
- Check for missing wait/navigation
- Verify page loaded completely
- Check browser console for errors

### Stale element
- Add wait action between page changes
- Use more specific selectors
- Re-query element after navigation

---

## Report Files

After test execution, check `artifacts/` directory:

- `test-report.html` - Interactive HTML report with detailed results
- `test-report.json` - Machine-readable test results
- `*.png` - Screenshots taken during test execution

---

## Advanced Usage

### Data-Driven Testing

Create a data file and parameterize tests:

```json
{
  "variables": {
    "testData": [
      { "email": "user1@test.com", "password": "pass1" },
      { "email": "user2@test.com", "password": "pass2" }
    ]
  }
}
```

### Conditional Steps

Use `execute` action to set variables:

```json
{
  "action": "execute",
  "script": "return document.querySelectorAll('.item').length > 0"
}
```

---

## Examples

See `examples/example.test.json` for a complete example with:
- Form filling
- Navigation
- Assertions
- Screenshot capture
- Multiple test scenarios

---

## Contributing

Contributions welcome! Areas for expansion:
- Additional action types
- Better error reporting
- Visual comparison testing
- Mobile-specific actions
- API testing integration

---

## License

MIT

---

## Support

For issues or questions, please check:
1. The example test file
2. This documentation
3. Playwright documentation: https://playwright.dev

---

**Happy Testing! 🎉**
