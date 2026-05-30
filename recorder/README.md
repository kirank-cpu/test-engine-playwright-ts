# 🎬 Test Step Recorder

A powerful visual test recorder UI for the Low-Code Test Automation Engine. Record UI interactions and automatically convert them into JSON test steps.

## Features

✅ **Visual Step Recorder** - Record test steps with an intuitive UI  
✅ **18+ Action Types** - Navigate, click, fill, assert, and more  
✅ **Live Preview** - See your JSON in real-time  
✅ **Easy Export** - Download JSON files ready for your test engine  
✅ **Custom Variables** - Define reusable test data  
✅ **Beautiful UI** - Modern gradient design with Tailwind CSS  

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

```bash
# Navigate to the recorder directory
cd recorder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

### 1. Configure Test Suite
- Click **Edit Settings** on the right panel
- Set test suite name, description, and timeout
- Configure variables like `baseUrl` and credentials

### 2. Record Steps

For each test action:

1. **Select Action Type** - Choose from 18+ actions (Navigate, Click, Fill, Assert, etc.)
2. **Fill Parameters** - Depending on the action, provide:
   - **URL** - For navigation and URL assertions
   - **CSS Selector** - For element interactions (use standard CSS or XPath)
   - **Value** - For filling forms or asserting text
   - **Timeout** - How long to wait for elements (default: 5000ms)
3. **Click "Add Step"** - Step is added to the list

### 3. Review Recorded Steps

- See all steps in the list with color-coded action types
- Click on any step to expand and view full JSON
- Copy individual steps to clipboard
- Delete unwanted steps

### 4. Export as JSON

- Click **Preview JSON** to see the final output
- Click **Download JSON** to save the test file
- Use the downloaded `.test.json` file with your test engine:

```bash
npx ts-node runner.ts your-test.test.json
```

## Selector Examples

Here are common CSS selector patterns:

```
button.submit              # Button with class
input[name='email']        # Input by name attribute
.modal-container           # Element with class
#header                    # Element with ID
button:has-text('Login')   # Button containing text
div > p                    # Direct child selector
form.login input[type]     # Nested selectors
```

## Supported Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `navigate` | url | Go to a URL |
| `click` | selector | Click an element |
| `fill` | selector, value | Fill input field |
| `type` | selector, value | Type text (char by char) |
| `select` | selector, value | Select dropdown option |
| `check` / `uncheck` | selector | Check/uncheck checkbox |
| `hover` | selector | Hover over element |
| `press` | key | Press keyboard key |
| `waitFor` | selector, timeout | Wait for element |
| `waitForNavigation` | timeout | Wait for page load |
| `screenshot` | name | Take screenshot |
| `assertElementVisible` | selector | Assert visible |
| `assertElementHidden` | selector | Assert hidden |
| `assertText` | selector, text | Assert text content |
| `assertUrl` | url | Assert current URL |
| `assertValue` | selector, value | Assert input value |

## Tips & Best Practices

### 1. Use Specific Selectors
```
✅ Good:   input[name='username']
❌ Bad:    input
```

### 2. Set Appropriate Timeouts
- Slow operations: 10000ms (10 seconds)
- Normal operations: 5000ms (5 seconds)
- Fast operations: 2000ms (2 seconds)

### 3. Use Variables for Reusability
```json
{
  "variables": {
    "baseUrl": "https://staging.example.com",
    "username": "testuser@example.com",
    "password": "secure123"
  }
}
```

Then use them in steps: `${baseUrl}`, `${username}`, etc.

### 4. Take Screenshots Before Assertions
```
[Screenshot]
[Wait for element]
[Assert visible]
```

This helps debug if tests fail.

### 5. Wait Between Page Changes
```
[Click submit]
[Wait for navigation]
[Assert URL]
[Wait for element]
```

## Generated JSON Format

```json
{
  "name": "My Test Suite",
  "description": "Test suite description",
  "timeout": 30000,
  "variables": {
    "baseUrl": "https://example.com"
  },
  "tests": [
    {
      "name": "My Test Suite - Test",
      "steps": [
        {
          "action": "navigate",
          "url": "https://example.com"
        },
        {
          "action": "fill",
          "selector": "input[name='email']",
          "value": "test@example.com",
          "timeout": 5000
        },
        {
          "action": "click",
          "selector": "button.submit",
          "timeout": 5000
        }
      ]
    }
  ]
}
```

## Running Tests

Once you've exported your JSON:

```bash
# Run with default settings (headless)
npx ts-node runner.ts your-test.test.json

# Run in debug mode (visible browser)
npx ts-node runner.ts your-test.test.json --headless=false

# Run with Firefox
npx ts-node runner.ts your-test.test.json --browser=firefox

# Run with slow motion
npx ts-node runner.ts your-test.test.json --slowMo=1000
```

## Troubleshooting

### Selector not found?
- Use browser DevTools (F12) to inspect the element
- Copy the selector from the Inspector
- Test selector in browser console: `document.querySelector('your-selector')`

### Tests timing out?
- Increase timeout value
- Add explicit wait steps
- Check if element is in an iframe

### Element appears but still fails?
- Add `waitFor` step before interacting
- Wait for element to be visible/stable
- Take screenshot to debug

## Project Structure

```
recorder/
├── src/
│   ├── components/
│   │   ├── StepRecorder.jsx      # Main recorder UI
│   │   ├── StepList.jsx          # Display recorded steps
│   │   ├── TestSuiteForm.jsx     # Configure test suite
│   │   └── JsonOutput.jsx        # JSON preview modal
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind styles
├── index.html                    # HTML entry
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Support

For issues or questions:
1. Check the selector with browser DevTools
2. Verify timeout values
3. Review the generated JSON format
4. Check test runner logs

---

**Happy Testing! 🎉**
