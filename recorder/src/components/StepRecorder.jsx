import React, { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'

const ACTIONS = [
  { value: 'navigate', label: '🔗 Navigate', description: 'Go to a URL' },
  { value: 'click', label: '🖱️ Click', description: 'Click an element' },
  { value: 'fill', label: '📝 Fill', description: 'Fill input field' },
  { value: 'type', label: '⌨️ Type', description: 'Type text character by character' },
  { value: 'select', label: '📋 Select', description: 'Select dropdown option' },
  { value: 'check', label: '☑️ Check', description: 'Check checkbox' },
  { value: 'uncheck', label: '☐ Uncheck', description: 'Uncheck checkbox' },
  { value: 'hover', label: '🎯 Hover', description: 'Hover over element' },
  { value: 'press', label: '⌨️ Press Key', description: 'Press keyboard key' },
  { value: 'waitFor', label: '⏳ Wait For', description: 'Wait for element' },
  { value: 'waitForNavigation', label: '⏳ Wait Navigation', description: 'Wait for page navigation' },
  { value: 'screenshot', label: '📸 Screenshot', description: 'Take screenshot' },
  { value: 'assertElementVisible', label: '✅ Assert Visible', description: 'Assert element is visible' },
  { value: 'assertElementHidden', label: '❌ Assert Hidden', description: 'Assert element is hidden' },
  { value: 'assertText', label: '📄 Assert Text', description: 'Assert element text' },
  { value: 'assertUrl', label: '🔗 Assert URL', description: 'Assert current URL' },
  { value: 'assertValue', label: '🔢 Assert Value', description: 'Assert input value' },
  { value: 'scroll', label: '📜 Scroll', description: 'Scroll page' }
]

const LOCATOR_TYPES = [
  { value: 'css', label: 'CSS Selector' },
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'xpath', label: 'XPath' }
]

function StepRecorder({ onAddStep, testSuite }) {
  const [action, setAction] = useState('navigate')
  const [selector, setSelector] = useState('')
  const [locatorType, setLocatorType] = useState('css')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [url, setUrl] = useState(testSuite?.variables?.baseUrl || '')
  const [key, setKey] = useState('')
  const [timeout, setTimeout] = useState(5000)
  const [partial, setPartial] = useState(false)

  const clearFields = () => {
    setSelector('')
    setLocatorType('css')
    setDescription('')
    setValue('')
    setUrl(testSuite?.variables?.baseUrl || '')
    setKey('')
    setTimeout(5000)
    setPartial(false)
  }

  const resetForm = () => {
    setAction('navigate')
    clearFields()
  }

  const buildLocator = () => {
    if (!selector.trim()) return ''

    switch (locatorType) {
      case 'id':
        return `#${selector.trim()}`
      case 'name':
        return `[name="${selector.trim()}"]`
      case 'xpath':
        return `xpath=${selector.trim()}`
      default:
        return selector.trim()
    }
  }

  const buildStep = () => {
    const step = { action }
    if (description.trim()) {
      step.description = description.trim()
    }
    const resolvedSelector = buildLocator()

    switch (action) {
      case 'navigate':
        if (!url.trim()) {
          alert('Please enter a URL')
          return null
        }
        step.url = url

        break
      case 'click':
      case 'hover':
      case 'waitFor':
        if (!resolvedSelector) {
          alert('Please enter a locator value')
          return null
        }
        step.selector = resolvedSelector
        if (timeout) step.timeout = timeout
        break

      case 'fill':
      case 'type':
      case 'select':
        if (!resolvedSelector) {
          alert('Please enter a locator value')
          return null
        }
        if (!value.trim()) {
          alert('Please enter a value')
          return null
        }
        step.selector = resolvedSelector
        step.value = value
        if (timeout) step.timeout = timeout
        break

      case 'check':
      case 'uncheck':
        if (!resolvedSelector) {
          alert('Please enter a locator value')
          return null
        }
        step.selector = resolvedSelector
        if (timeout) step.timeout = timeout
        break

      case 'press':
        if (!key.trim()) {
          alert('Please enter a key')
          return null
        }
        step.key = key
        break

      case 'screenshot':
        if (value.trim()) {
          step.name = value
        }
        break

      case 'waitForNavigation':
        if (timeout) step.timeout = timeout
        break

      case 'assertElementVisible':
      case 'assertElementHidden':
        if (!resolvedSelector) {
          alert('Please enter a locator value')
          return null
        }
        step.selector = resolvedSelector
        if (timeout) step.timeout = timeout
        break

      case 'assertText':
      case 'assertValue':
        if (!resolvedSelector) {
          alert('Please enter a locator value')
          return null
        }
        if (!value.trim()) {
          alert('Please enter text/value to assert')
          return null
        }
        step.selector = resolvedSelector
        step[action === 'assertText' ? 'text' : 'value'] = value
        if (partial) step.partial = true
        if (timeout) step.timeout = timeout
        break

      case 'assertUrl':
        if (!url.trim()) {
          alert('Please enter a URL')
          return null
        }
        step.url = url
        if (partial) step.partial = true
        if (timeout) step.timeout = timeout
        break

      default:
        break
    }

    return step
  }

  const handleAddStep = () => {
    const step = buildStep()
    if (step) {
      onAddStep(step)
      resetForm()
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Selector */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Step Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              const next = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
              setDescription(next)
            }}
            placeholder="Enter a short alphanumeric description"
            className="input-field"
            maxLength={80}
          />
          <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and spaces are allowed.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Action</label>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value)
              clearFields()
            }}
            className="select-field"
          >
          {ACTIONS.map((act) => (
            <option key={act.value} value={act.value}>
              {act.label} - {act.description}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Fields Based on Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL Field */}
        {(action === 'navigate' || action === 'assertUrl') && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="input-field"
            />
          </div>
        )}

        {/* Selector Field */}
        {[
          'click',
          'hover',
          'fill',
          'type',
          'select',
          'check',
          'uncheck',
          'waitFor',
          'assertElementVisible',
          'assertElementHidden',
          'assertText',
          'assertValue'
        ].includes(action) && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Locator Type</label>
              <select
                value={locatorType}
                onChange={(e) => setLocatorType(e.target.value)}
                className="select-field"
              >
                {LOCATOR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {locatorType === 'css'
                  ? 'CSS Selector'
                  : locatorType === 'id'
                  ? 'Element ID'
                  : locatorType === 'name'
                  ? 'Element Name'
                  : 'XPath Expression'}
              </label>
              <input
                type="text"
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                placeholder={
                  locatorType === 'css'
                    ? "button.submit, input[name='email'], .modal"
                    : locatorType === 'id'
                    ? 'my-button-id'
                    : locatorType === 'name'
                    ? 'email'
                    : "//div[@class='item']//button"
                }
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: use the locator type selector that matches your target element
              </p>
            </div>
          </div>
        )}

        {/* Value Field */}
        {['fill', 'type', 'select', 'assertText', 'assertValue'].includes(action) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {action === 'assertText' ? 'Expected Text' : 'Value'}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                action === 'fill' ? 'test@example.com' : action === 'assertText' ? 'Welcome' : 'Value'
              }
              className="input-field"
            />
          </div>
        )}

        {/* Screenshot Name */}
        {action === 'screenshot' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Screenshot Name (optional)</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="homepage-loaded"
              className="input-field"
            />
          </div>
        )}

        {/* Key Field */}
        {action === 'press' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Keyboard Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter, Escape, Tab, ArrowDown"
              className="input-field"
            />
          </div>
        )}

        {/* Timeout Field */}
        {[
          'click',
          'hover',
          'waitFor',
          'waitForNavigation',
          'assertElementVisible',
          'assertElementHidden',
          'assertText',
          'assertValue',
          'assertUrl'
        ].includes(action) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timeout (ms)</label>
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value))}
              placeholder="5000"
              className="input-field"
            />
          </div>
        )}
      </div>

      {/* Additional Options */}
      {['assertText', 'assertValue', 'assertUrl'].includes(action) && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="partial"
            checked={partial}
            onChange={(e) => setPartial(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="partial" className="text-sm text-gray-700 cursor-pointer">
            Partial match (substring only)
          </label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleAddStep}
          className="flex-1 flex items-center justify-center gap-2 btn-primary"
        >
          <Plus size={20} />
          Add Step
        </button>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>
    </div>
  )
}

export default StepRecorder
