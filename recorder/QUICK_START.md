# 🚀 Quick Start Guide - Test Recorder

Welcome! This guide will help you get up and running with the Test Step Recorder in 5 minutes.

## Step 1: Install Dependencies

```bash
# Navigate to the recorder directory
cd recorder

# Install all dependencies
npm install
```

## Step 2: Start the Recorder UI

```bash
# Start the development server
npm run dev
```

The app will automatically open at **http://localhost:3000** in your browser.

## Step 3: Configure Your Test Suite

1. Click **Edit Settings** on the right panel
2. Enter your test suite details:
   - **Test Suite Name**: Give it a descriptive name (e.g., "Login Flow")
   - **Description**: What does this test do?
   - **Timeout**: Default 30000ms is fine for most cases
   - **Base URL**: The website you want to test (e.g., `https://demo.opencart.com`)

3. Click **Save Settings**

## Step 4: Record Your First Step

Let's record a step to navigate to a webpage:

1. **Select Action**: Choose `🔗 Navigate`
2. **Enter URL**: `${baseUrl}` (or any full URL)
3. **Click "Add Step"**

You'll see the step appear in the "Recorded Steps" list below!

## Step 5: Record More Steps

Try recording different types of steps:

### Example: Record a Login Flow

#### Step 1: Navigate
- Action: `🔗 Navigate`
- URL: `${baseUrl}/login`

#### Step 2: Fill Email
- Action: `📝 Fill`
- CSS Selector: `input[name='email']`
- Value: `test@example.com`
- Timeout: `5000`

#### Step 3: Fill Password
- Action: `📝 Fill`
- CSS Selector: `input[name='password']`
- Value: `password123`
- Timeout: `5000`

#### Step 4: Click Login
- Action: `🖱️ Click`
- CSS Selector: `button.login-btn`
- Timeout: `5000`

#### Step 5: Wait for Navigation
- Action: `⏳ Wait Navigation`
- Timeout: `5000`

#### Step 6: Assert Logged In
- Action: `✅ Assert Visible`
- CSS Selector: `.user-profile`
- Timeout: `5000`

## Step 6: Review Your Steps

1. In the "Recorded Steps" section, you'll see all your steps
2. Each step shows:
   - 🎨 Color-coded by action type
   - 📝 Step number and action
   - 🔍 Parameter preview
3. Click on any step to expand and see full JSON

## Step 7: Download Your Test

1. Click **Preview JSON** to see the final output
2. Review the JSON structure
3. Click **Download JSON** to save as `.test.json` file
4. The file will be saved to your Downloads folder

## Step 8: Run Your Test

Go back to the main project directory and run your test:

```bash
# Navigate back to project root
cd ..

# Run your downloaded test
npx ts-node runner.ts ../path/to/downloaded-test.test.json

# Or in debug mode (see browser):
npx ts-node runner.ts ../path/to/downloaded-test.test.json --headless=false
```

## Common Selector Patterns

Here's how to find CSS selectors using browser DevTools:

### Method 1: Using Browser DevTools
1. Open DevTools (F12 or Right-click → Inspect)
2. Click the element selector tool (top-left arrow)
3. Click on the element you want to select
4. Copy the selector from the Inspector panel

### Method 2: Common Patterns

```
button.submit              # Button with class "submit"
input[name='email']        # Input with name="email"
input[type='password']     # Input with type="password"
.modal-dialog              # Element with class "modal-dialog"
#submit-btn                # Element with id="submit-btn"
button:has-text('Login')   # Button containing text "Login"
a[href*='dashboard']       # Link with href containing "dashboard"
div > p                    # Direct child paragraph of div
form.login input           # Input inside form with class "login"
```

## Tips for Better Tests

### ✅ DO:
- Use specific selectors: `input[name='email']`
- Wait for elements: Add `waitFor` steps
- Use meaningful names: "Login with valid credentials"
- Add timeouts: Usually 5000ms is good
- Take screenshots before assertions

### ❌ DON'T:
- Use generic selectors: `input`, `button`
- Use hardcoded values where variables work: Use `${baseUrl}` instead of full URL
- Forget to wait for page transitions
- Test multiple things in one step

## Using Variables

Variables make your tests reusable. Define them in Settings:

```json
{
  "variables": {
    "baseUrl": "https://example.com",
    "username": "testuser",
    "password": "pass123",
    "testEmail": "test@example.com"
  }
}
```

Then use them in your steps: `${baseUrl}`, `${username}`, etc.

## Example Test Suite JSON

Here's what your downloaded JSON will look like:

```json
{
  "name": "E-Commerce Login Flow",
  "description": "Test user login on e-commerce site",
  "timeout": 30000,
  "variables": {
    "baseUrl": "https://demo.example.com",
    "username": "testuser@example.com",
    "password": "secure123"
  },
  "tests": [
    {
      "name": "E-Commerce Login Flow - Test",
      "steps": [
        {
          "action": "navigate",
          "url": "${baseUrl}/login"
        },
        {
          "action": "fill",
          "selector": "input[name='email']",
          "value": "${username}",
          "timeout": 5000
        },
        {
          "action": "fill",
          "selector": "input[name='password']",
          "value": "${password}",
          "timeout": 5000
        },
        {
          "action": "click",
          "selector": "button.btn-login",
          "timeout": 5000
        },
        {
          "action": "waitForNavigation",
          "timeout": 5000
        },
        {
          "action": "assertElementVisible",
          "selector": ".user-dashboard",
          "timeout": 5000
        }
      ]
    }
  ]
}
```

## Running Tests with Options

Once you've downloaded your test JSON:

```bash
# Basic run (headless)
npx ts-node runner.ts my-test.test.json

# Run with visible browser
npx ts-node runner.ts my-test.test.json --headless=false

# Run with Firefox
npx ts-node runner.ts my-test.test.json --browser=firefox

# Slow down interactions (good for debugging)
npx ts-node runner.ts my-test.test.json --headless=false --slowMo=1000

# Run with WebKit
npx ts-node runner.ts my-test.test.json --browser=webkit
```

## Troubleshooting

### "Selector not found" error?
1. Take a screenshot (add `📸 Screenshot` step)
2. Compare with actual page
3. Use DevTools to find correct selector
4. Test selector in console: `document.querySelector('your-selector')`

### Test times out?
1. Increase the timeout value
2. Add explicit `⏳ Wait For` steps
3. Check if element is in iframe
4. Run with `--headless=false` to see what's happening

### Need to modify downloaded JSON?
- JSON file is plain text, you can edit it in any editor
- Make sure to maintain valid JSON syntax
- Test your changes: `npx ts-node runner.ts your-test.test.json`

## Next Steps

1. ✅ Explore different action types
2. ✅ Test on your target website
3. ✅ Save your test files
4. ✅ Run tests with different browsers
5. ✅ Integrate into your CI/CD pipeline

---

**Enjoy recording your tests! 🎉**

For more details, see [Recorder Documentation](./README.md) and [Main Project README](../README.md)
