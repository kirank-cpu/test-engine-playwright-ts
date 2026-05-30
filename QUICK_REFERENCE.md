# Quick Reference Guide

## Common Test Scenarios

### Scenario 1: Simple Form Submission

```json
{
  "name": "Form Submission",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/form"
    },
    {
      "action": "fill",
      "selector": "input[name='name']",
      "value": "John Doe"
    },
    {
      "action": "fill",
      "selector": "input[name='email']",
      "value": "john@example.com"
    },
    {
      "action": "click",
      "selector": "button[type='submit']"
    },
    {
      "action": "waitForNavigation",
      "timeout": 5000
    },
    {
      "action": "assertText",
      "selector": ".success-message",
      "text": "Form submitted successfully",
      "partial": true
    }
  ]
}
```

---

### Scenario 2: Login & Navigation

```json
{
  "name": "User Login and Navigation",
  "variables": {
    "username": "testuser",
    "password": "pass123"
  },
  "steps": [
    {
      "action": "navigate",
      "url": "https://app.example.com/login"
    },
    {
      "action": "fill",
      "selector": "#username",
      "value": "${username}"
    },
    {
      "action": "fill",
      "selector": "#password",
      "value": "${password}"
    },
    {
      "action": "click",
      "selector": ".btn-login"
    },
    {
      "action": "waitForNavigation",
      "timeout": 10000
    },
    {
      "action": "assertUrl",
      "url": "/dashboard",
      "partial": true
    }
  ]
}
```

---

### Scenario 3: Dropdown Selection

```json
{
  "name": "Dropdown Selection",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/settings"
    },
    {
      "action": "select",
      "selector": "select[name='country']",
      "value": "US"
    },
    {
      "action": "assertValue",
      "selector": "select[name='country']",
      "value": "US"
    }
  ]
}
```

---

### Scenario 4: Checkbox and Radio Buttons

```json
{
  "name": "Checkbox and Radio Handling",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/preferences"
    },
    {
      "action": "check",
      "selector": "input[name='newsletter']"
    },
    {
      "action": "click",
      "selector": "input[value='premium']"
    },
    {
      "action": "click",
      "selector": ".btn-save"
    },
    {
      "action": "assertElementVisible",
      "selector": ".save-confirmation"
    }
  ]
}
```

---

### Scenario 5: Waiting for Dynamic Content

```json
{
  "name": "Dynamic Content Loading",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/data-page"
    },
    {
      "action": "click",
      "selector": ".load-more-btn"
    },
    {
      "action": "waitForVisible",
      "selector": ".loading-spinner",
      "timeout": 2000
    },
    {
      "action": "waitForHidden",
      "selector": ".loading-spinner",
      "timeout": 10000
    },
    {
      "action": "assertCount",
      "selector": ".data-item",
      "count": 20
    }
  ]
}
```

---

### Scenario 6: Modal/Popup Interaction

```json
{
  "name": "Modal Dialog Handling",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/page"
    },
    {
      "action": "click",
      "selector": ".open-modal-btn"
    },
    {
      "action": "waitForVisible",
      "selector": ".modal-dialog",
      "timeout": 3000
    },
    {
      "action": "fill",
      "selector": ".modal-dialog input[type='text']",
      "value": "Some input"
    },
    {
      "action": "click",
      "selector": ".modal-dialog .btn-confirm"
    },
    {
      "action": "waitForHidden",
      "selector": ".modal-dialog",
      "timeout": 3000
    }
  ]
}
```

---

### Scenario 7: Hover and Context Menu

```json
{
  "name": "Hover Actions",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/menu"
    },
    {
      "action": "hover",
      "selector": ".dropdown-menu-trigger"
    },
    {
      "action": "waitForVisible",
      "selector": ".dropdown-menu",
      "timeout": 2000
    },
    {
      "action": "click",
      "selector": ".dropdown-menu a:has-text('Option 1')"
    },
    {
      "action": "waitForNavigation",
      "timeout": 5000
    }
  ]
}
```

---

### Scenario 8: Table Interaction

```json
{
  "name": "Table Row Selection",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/table"
    },
    {
      "action": "waitFor",
      "selector": "table tbody tr",
      "timeout": 5000
    },
    {
      "action": "assertCount",
      "selector": "table tbody tr",
      "count": 10
    },
    {
      "action": "click",
      "selector": "table tbody tr:first-child button.edit"
    },
    {
      "action": "waitForNavigation",
      "timeout": 5000
    }
  ]
}
```

---

### Scenario 9: Search and Filter

```json
{
  "name": "Search Functionality",
  "variables": {
    "searchTerm": "laptop"
  },
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/products"
    },
    {
      "action": "fill",
      "selector": ".search-box",
      "value": "${searchTerm}"
    },
    {
      "action": "click",
      "selector": ".search-button"
    },
    {
      "action": "waitForNavigation",
      "timeout": 5000
    },
    {
      "action": "assertText",
      "selector": ".results-count",
      "text": "${searchTerm}",
      "partial": true
    }
  ]
}
```

---

### Scenario 10: Error Handling

```json
{
  "name": "Error Scenario Handling",
  "steps": [
    {
      "action": "navigate",
      "url": "https://example.com/login"
    },
    {
      "action": "fill",
      "selector": "input[name='email']",
      "value": "invalid@"
    },
    {
      "action": "click",
      "selector": "button[type='submit']"
    },
    {
      "action": "waitForVisible",
      "selector": ".error-message",
      "timeout": 3000
    },
    {
      "action": "assertText",
      "selector": ".error-message",
      "text": "Invalid email",
      "partial": true
    }
  ]
}
```

---

## Selector Tips

### Find elements by text
```
button:has-text('Click Me')
a:has-text('Login')
```

### Find by placeholder
```
input[placeholder='Enter email']
```

### Find by data attribute
```
button[data-action='delete']
div[data-testid='sidebar']
```

### Find by class combination
```
button.btn.btn-primary
div.card.active
```

### Find by type (inputs)
```
input[type='email']
input[type='password']
input[type='checkbox']
```

### XPath examples (if CSS doesn't work)
```
//button[text()='Submit']
//input[@name='email']
```

---

## Variable Substitution Examples

```json
{
  "variables": {
    "baseUrl": "https://api.example.com",
    "testUser": "admin@test.com",
    "testPass": "SecurePass123!"
  },
  "steps": [
    {
      "action": "navigate",
      "url": "${baseUrl}/login"
    },
    {
      "action": "fill",
      "selector": "input[name='email']",
      "value": "${testUser}"
    },
    {
      "action": "fill",
      "selector": "input[name='password']",
      "value": "${testPass}"
    },
    {
      "action": "log",
      "value": "Logging in as: ${testUser}"
    }
  ]
}
```

---

## Timeout Recommendations

- **Navigation/Page Load**: 10000ms
- **Element Appear**: 5000ms
- **Quick Actions (click, fill)**: 5000ms
- **Loading Spinner**: 10000ms
- **API Response**: 15000ms
- **Modal/Popup**: 3000ms

---

## Best Practice Patterns

### Pattern 1: Setup and Teardown
```json
{
  "name": "Test with Setup",
  "steps": [
    // SETUP
    { "action": "navigate", "url": "${baseUrl}/login" },
    // ... login steps ...
    
    // ACTUAL TEST
    { "action": "click", "selector": ".feature-btn" },
    // ... test steps ...
    
    // VERIFICATION
    { "action": "assertElementVisible", "selector": ".success" }
  ]
}
```

### Pattern 2: Modular Steps
```json
{
  "name": "Login and Verify",
  "variables": {
    "email": "test@example.com",
    "password": "pass123"
  },
  "steps": [
    { "action": "navigate", "url": "${baseUrl}/login" },
    { "action": "fill", "selector": "input[type='email']", "value": "${email}" },
    { "action": "fill", "selector": "input[type='password']", "value": "${password}" },
    { "action": "click", "selector": "button.login" },
    { "action": "waitForNavigation", "timeout": 10000 },
    { "action": "assertUrl", "url": "/dashboard", "partial": true }
  ]
}
```

---

## Debugging Tips

1. **Use screenshots** - Add before and after critical steps
2. **Add logs** - Use log action to track execution flow
3. **Run in debug mode** - `--headless=false --slowMo=1000`
4. **Check selectors** - Use browser DevTools to verify selectors
5. **Increase timeouts** - If tests are flaky, increase timeout values
6. **Check console errors** - Use `execute` action to check browser console

```json
{
  "action": "screenshot",
  "name": "debug-point-1"
},
{
  "action": "log",
  "value": "About to click submit button"
},
{
  "action": "execute",
  "script": "return window.location.href"
}
```

---

**Happy Testing! 🚀**
